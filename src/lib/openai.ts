import { AnalysisResult, ContentType, FactCheckSource, RiskLevel, Verdict } from '../types';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts/misinformationAnalysis';
import { searchFactChecks } from './googleFactCheck';

// Rate limiting store (in-memory for demo)
interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 per hour for anonymous

export function checkClientRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(identifier, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX - 1,
      resetAt: new Date(now + RATE_LIMIT_WINDOW),
    };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(entry.windowStart + RATE_LIMIT_WINDOW),
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - entry.count,
    resetAt: new Date(entry.windowStart + RATE_LIMIT_WINDOW),
  };
}

function sanitizeText(text: string): string {
  // Remove HTML tags
  const stripped = text.replace(/<[^>]*>/g, ' ');
  // Remove null bytes
  const noNulls = stripped.replace(/\0/g, '');
  // Normalize whitespace
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
  // Remove markdown code blocks if present
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
  apiKey: string,
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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.2,
          max_tokens: 2000,
          response_format: { type: 'json_object' },
        }),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          // Check if it's a hard quota error vs a temporary rate limit
          if (errorData.error?.message?.toLowerCase().includes('quota')) {
            throw new Error(`OpenAI Quota Exceeded: ${errorData.error.message} (You must add prepaid credits to your OpenAI account to use the API).`);
          }
          
          // Rate limit from OpenAI
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, delays[attempt]));
            continue;
          }
          throw new Error('AI service is currently busy (Rate Limit). Please try again in a moment.');
        }

        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key in Settings.');
        }

        if (response.status === 400) {
          throw new Error('Invalid request. Please try with different content.');
        }

        if (response.status >= 500) {
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, delays[attempt]));
            continue;
          }
          throw new Error('AI service is temporarily unavailable. Please try again later.');
        }

        throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;

      if (!rawContent) {
        throw new Error('Empty response from AI. Please try again.');
      }

      let parsed: unknown;
      try {
        parsed = parseResponse(rawContent);
      } catch {
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delays[attempt]));
          continue;
        }
        throw new Error('AI returned invalid data. Please try again.');
      }

      if (!validateAnalysisResponse(parsed)) {
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delays[attempt]));
          continue;
        }
        throw new Error('AI response validation failed. Please try again.');
      }

      const id = `analysis_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const tokensUsed = data.usage?.total_tokens || 0;

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
        modelUsed: 'gpt-4o',
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
