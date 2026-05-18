import { AnalysisResult, ContentType, FactCheckSource, RiskLevel, Verdict } from '../types';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts/misinformationAnalysis';
import { searchFactChecks } from './googleFactCheck';

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

export async function analyzeContent(
  text: string,
  contentType: ContentType,
  geminiApiKey: string,
  googleApiKey?: string,
  signal?: AbortSignal
): Promise<AnalysisResult> {
  const sanitized = sanitizeText(text);

  if (sanitized.length < 10) {
    throw new Error('Content is too short to analyze. Please provide at least 10 characters.');
  }

  if (sanitized.length > 10000) {
    throw new Error('Content exceeds maximum length of 10,000 characters.');
  }

  let factCheckContext = '';
  if (googleApiKey) {
    factCheckContext = await searchFactChecks(sanitized, googleApiKey);
  }

  const userPrompt = buildUserPrompt(sanitized, contentType, factCheckContext);

  let lastError: Error | null = null;
  const maxRetries = 3;
  const delays = [1000, 2000, 4000];

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (signal?.aborted) {
      throw new Error('Analysis cancelled by user.');
    }

    try {
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
        }),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, delays[attempt]));
            continue;
          }
          throw new Error('Gemini AI service is currently busy (Rate Limit). Please try again in a moment.');
        }

        if (response.status === 400) {
          throw new Error('Invalid API key or bad request. Please check your Gemini API key.');
        }

        if (response.status >= 500) {
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, delays[attempt]));
            continue;
          }
          throw new Error('Gemini AI service is temporarily unavailable. Please try again later.');
        }

        throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawContent) {
        throw new Error('Empty response from Gemini. Please try again.');
      }

      let parsed: unknown;
      try {
        parsed = parseResponse(rawContent);
      } catch {
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delays[attempt]));
          continue;
        }
        throw new Error('Gemini returned invalid data format. Please try again.');
      }

      if (!validateAnalysisResponse(parsed)) {
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delays[attempt]));
          continue;
        }
        throw new Error('Gemini response validation failed. Please try again.');
      }

      const id = `analysis_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const tokensUsed = data.usageMetadata?.totalTokenCount || 0;

      const result: AnalysisResult = {
        id,
        inputText: sanitized,
        contentType,
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

      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Analysis cancelled by user.');
      }
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      
      if (lastError.message.includes('Invalid API key') ||
          lastError.message.includes('cancelled') ||
          lastError.message.includes('too short') ||
          lastError.message.includes('Invalid request')) {
        throw lastError;
      }

      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delays[attempt]));
      }
    }
  }

  throw lastError || new Error('Analysis failed after multiple attempts. Please try again.');
}
