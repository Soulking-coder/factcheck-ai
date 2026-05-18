import { ContentType, AnalysisResult, RiskLevel, Verdict, FactCheckSource } from '../src/types';
import { SYSTEM_PROMPT, buildUserPrompt } from '../src/lib/prompts/misinformationAnalysis';
import { searchFactChecks } from '../src/lib/googleFactCheck';

export const config = {
  runtime: 'edge',
};

function sanitizeText(text: string): string {
  const stripped = text.replace(/<[^>]*>/g, ' ');
  const noNulls = stripped.replace(/\0/g, '');
  const normalized = noNulls.replace(/\s+/g, ' ').trim();
  return normalized;
}

function validateAnalysisResponse(data: unknown): data is {
  credibilityScore: number;
  biasScore: number;
  emotionalManipulationScore: number;
  misinformationRisk: RiskLevel;
  keyFlags: string[];
  missingContext: string[];
  factCheckSources: FactCheckSource[];
  summary: string;
  verdict: Verdict;
} {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;

  const validVerdicts: Verdict[] = ['Likely True', 'Mixed', 'Likely False', 'Unverifiable'];
  const validRisks: RiskLevel[] = ['low', 'medium', 'high', 'very-high'];

  if (typeof d.credibilityScore !== 'number' || d.credibilityScore < 0 || d.credibilityScore > 100) return false;
  if (typeof d.biasScore !== 'number' || d.biasScore < -100 || d.biasScore > 100) return false;
  if (typeof d.emotionalManipulationScore !== 'number' || d.emotionalManipulationScore < 0 || d.emotionalManipulationScore > 100) return false;
  if (!validRisks.includes(d.misinformationRisk as RiskLevel)) return false;
  if (!validVerdicts.includes(d.verdict as Verdict)) return false;
  if (!Array.isArray(d.keyFlags)) return false;
  if (!Array.isArray(d.missingContext)) return false;
  if (!Array.isArray(d.factCheckSources)) return false;
  if (typeof d.summary !== 'string') return false;

  return true;
}

function parseResponse(raw: string): unknown {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
  if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();
  return JSON.parse(cleaned);
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { 
      status: 405, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  try {
    const { text, contentType } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing or invalid text' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const googleApiKey = process.env.GOOGLE_FACTCHECK_API_KEY;

    if (!geminiApiKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error: Gemini API key missing' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sanitized = sanitizeText(text);

    if (sanitized.length < 10) {
      return new Response(JSON.stringify({ error: 'Content is too short to analyze. Please provide at least 10 characters.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (sanitized.length > 10000) {
      return new Response(JSON.stringify({ error: 'Content exceeds maximum length of 10,000 characters.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let factCheckContext = '';
    if (googleApiKey) {
      factCheckContext = await searchFactChecks(sanitized, googleApiKey);
    }

    const userPrompt = buildUserPrompt(sanitized, contentType as ContentType, factCheckContext);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: { text: SYSTEM_PROMPT }
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Gemini AI service is currently busy (Rate Limit). Please try again in a moment.' }), { status: 429 });
      }

      if (response.status >= 500) {
        return new Response(JSON.stringify({ error: 'Gemini AI service is temporarily unavailable. Please try again later.' }), { status: 500 });
      }

      return new Response(JSON.stringify({ error: `API error: ${errorData.error?.message || 'Unknown error'}` }), { status: response.status });
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      return new Response(JSON.stringify({ error: 'Empty response from Gemini. Please try again.' }), { status: 500 });
    }

    let parsed: unknown;
    try {
      parsed = parseResponse(rawContent);
    } catch {
      return new Response(JSON.stringify({ error: 'Gemini returned invalid data format. Please try again.' }), { status: 500 });
    }

    if (!validateAnalysisResponse(parsed)) {
      return new Response(JSON.stringify({ error: 'Gemini response validation failed. Please try again.' }), { status: 500 });
    }

    const id = `analysis_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const tokensUsed = data.usageMetadata?.totalTokenCount || 0;

    const result: AnalysisResult = {
      id,
      inputText: sanitized,
      contentType: contentType as ContentType,
      credibilityScore: Math.round(parsed.credibilityScore),
      biasScore: Math.round(parsed.biasScore),
      emotionalManipulationScore: Math.round(parsed.emotionalManipulationScore),
      misinformationRisk: parsed.misinformationRisk,
      keyFlags: parsed.keyFlags.slice(0, 7),
      missingContext: parsed.missingContext.slice(0, 5),
      factCheckSources: parsed.factCheckSources.slice(0, 5),
      summary: parsed.summary,
      verdict: parsed.verdict,
      analyzedAt: new Date().toISOString(),
      tokensUsed,
      modelUsed: 'gemini-2.5-flash',
      isPublic: false,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const err = error as Error;
    return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
