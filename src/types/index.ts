export interface FactCheckSource {
  name: string;
  url: string;
  reliability: 'high' | 'medium' | 'low';
  reason: string;
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'very-high';
export type Verdict = 'Likely True' | 'Mixed' | 'Likely False' | 'Unverifiable';
export type ContentType = 'article' | 'claim' | 'social-media-post';
export type BiasLevel = 'far-left' | 'left' | 'center' | 'right' | 'far-right';

export interface AnalysisResult {
  id: string;
  inputText: string;
  inputUrl?: string;
  contentType: ContentType;
  credibilityScore: number;
  biasScore: number;
  emotionalManipulationScore: number;
  misinformationRisk: RiskLevel;
  keyFlags: string[];
  missingContext: string[];
  factCheckSources: FactCheckSource[];
  summary: string;
  verdict: Verdict;
  analyzedAt: string;
  tokensUsed?: number;
  modelUsed?: string;
  isPublic?: boolean;
  shareToken?: string;
}

export interface HistoryStats {
  total: number;
  avgCredibility: number;
  verdictCounts: Record<Verdict, number>;
  thisMonth: number;
  avgBias: number;
  avgEmotional: number;
}

export interface RateLimitInfo {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  type: 'anonymous' | 'free' | 'pro';
}

export interface AnalyzeRequest {
  text: string;
  url?: string;
  contentType: ContentType;
}

export interface AnalyzeResponse {
  result?: AnalysisResult;
  error?: string;
  rateLimitInfo?: {
    remaining: number;
    resetAt: string;
  };
}

export interface FilterOptions {
  verdict?: Verdict | 'all';
  contentType?: ContentType | 'all';
  search?: string;
  sort?: 'newest' | 'oldest' | 'highest-score' | 'lowest-score';
}
