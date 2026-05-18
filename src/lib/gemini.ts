import { AnalysisResult, ContentType } from '../types';

export async function analyzeContent(
  text: string,
  contentType: ContentType,
  signal?: AbortSignal
): Promise<AnalysisResult> {
  let lastError: Error | null = null;
  const maxRetries = 3;
  const delays = [1000, 2000, 4000];

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (signal?.aborted) {
      throw new Error('Analysis cancelled by user.');
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          contentType,
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
          throw new Error('Analysis service is currently busy (Rate Limit). Please try again in a moment.');
        }

        if (response.status >= 500) {
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, delays[attempt]));
            continue;
          }
          throw new Error(errorData.error || 'Analysis service is temporarily unavailable. Please try again later.');
        }

        throw new Error(errorData.error || `API error: ${response.statusText}`);
      }

      const result: AnalysisResult = await response.json();
      return result;

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Analysis cancelled by user.');
      }
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      
      if (lastError.message.includes('cancelled') ||
          lastError.message.includes('too short') ||
          lastError.message.includes('Server configuration error')) {
        throw lastError;
      }

      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delays[attempt]));
      }
    }
  }

  throw lastError || new Error('Analysis failed after multiple attempts. Please try again.');
}
