import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Link2, Zap, ChevronDown, CheckCircle, XCircle,
  Newspaper, MessageSquare, Quote, ClipboardCheck, Key
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ContentType } from '../../types';
import { EXAMPLE_PRESETS } from '../../lib/prompts/misinformationAnalysis';
import { useAppStore } from '../../store/appStore';
import { cn } from '../../utils/cn';

interface AnalyzerInputProps {
  onAnalyze: (text: string, contentType: ContentType, url?: string) => void;
  isAnalyzing: boolean;
  onOpenApiKey: () => void;
}

const contentTypeOptions: { value: ContentType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'article', label: 'Article', icon: <Newspaper className="w-4 h-4" />, description: 'News article or blog post' },
  { value: 'claim', label: 'Claim', icon: <Quote className="w-4 h-4" />, description: 'A specific factual statement' },
  { value: 'social-media-post', label: 'Social Post', icon: <MessageSquare className="w-4 h-4" />, description: 'Twitter, Facebook, etc.' },
];

const MAX_CHARS = 10000;
const MIN_CHARS = 20;

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function AnalyzerInput({ onAnalyze, isAnalyzing, onOpenApiKey }: AnalyzerInputProps) {
  const { geminiApiKey } = useAppStore();
  const activeApiKey = geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY;
  const [activeTab, setActiveTab] = useState<'text' | 'url'>('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [contentType, setContentType] = useState<ContentType>('article');
  const [showExamples, setShowExamples] = useState(false);
  const [pasteFeedback, setPasteFeedback] = useState(false);
  const [urlValid, setUrlValid] = useState<boolean | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pasteFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value.slice(0, MAX_CHARS));
  };

  const handlePaste = () => {
    if (pasteFeedbackTimer.current) clearTimeout(pasteFeedbackTimer.current);
    setPasteFeedback(true);
    pasteFeedbackTimer.current = setTimeout(() => setPasteFeedback(false), 3000);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    if (val.trim() === '') {
      setUrlValid(null);
    } else {
      setUrlValid(isValidUrl(val));
    }
  };

  const loadExample = useCallback((index: number) => {
    const preset = EXAMPLE_PRESETS[index];
    setText(preset.text);
    setContentType(preset.contentType);
    setActiveTab('text');
    setShowExamples(false);
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (activeTab === 'text') {
      onAnalyze(text, contentType);
    } else {
      onAnalyze(url, contentType, url);
    }
  };

  const isTextReady = activeTab === 'text' && text.length >= MIN_CHARS && !isAnalyzing;
  const isUrlReady = activeTab === 'url' && urlValid === true && !isAnalyzing;
  const canSubmit = (isTextReady || isUrlReady) && !!activeApiKey;

  const charPercent = (text.length / MAX_CHARS) * 100;

  return (
    <div className="space-y-4">
      {/* API Key Warning */}
      {!activeApiKey && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl"
        >
          <Key className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="flex-1 text-sm text-amber-800">
            <span className="font-semibold">Gemini API key required</span>
            <span className="text-amber-700"> — Your key connects directly to Google Gemini from your browser.</span>
          </div>
          <Button size="sm" variant="outline" onClick={onOpenApiKey} className="shrink-0 border-amber-300 text-amber-700 hover:bg-amber-100">
            Add Key
          </Button>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
        <button
          onClick={() => setActiveTab('text')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
            activeTab === 'text'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          <FileText className="w-4 h-4" />
          Paste Text
        </button>
        <button
          onClick={() => setActiveTab('url')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
            activeTab === 'url'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          <Link2 className="w-4 h-4" />
          Paste URL
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'text' ? (
          <motion.div
            key="text"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-3"
          >
            {/* Paste Feedback */}
            <AnimatePresence>
              {pasteFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  Text pasted. Ready to analyze.
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                onPaste={handlePaste}
                placeholder="Paste the article, news excerpt, claim, or social media post you want to fact-check..."
                className="w-full min-h-[220px] px-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-base leading-relaxed bg-white"
                style={{ fontSize: '16px' }}
              />
              {/* Char Counter */}
              <div className={cn(
                'absolute bottom-3 right-3 text-xs font-mono transition-colors',
                text.length >= MAX_CHARS ? 'text-red-500' : text.length > MAX_CHARS * 0.8 ? 'text-amber-500' : 'text-slate-400'
              )}>
                {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </div>
            </div>

            {/* Char progress bar */}
            {text.length > 0 && (
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full transition-colors', charPercent > 90 ? 'bg-red-400' : charPercent > 70 ? 'bg-amber-400' : 'bg-blue-400')}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(charPercent, 100)}%` }}
                />
              </div>
            )}

            {/* Content Type */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Content Type</label>
              <div className="grid grid-cols-3 gap-2">
                {contentTypeOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setContentType(opt.value)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all',
                      contentType === opt.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    )}
                  >
                    {opt.icon}
                    <span className="text-xs font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="url"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-3"
          >
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Link2 className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://example.com/article..."
                className="w-full pl-10 pr-10 py-3.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
                style={{ fontSize: '16px' }}
              />
              {urlValid !== null && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {urlValid ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              )}
            </div>

            {urlValid === false && (
              <p className="text-sm text-red-600 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                Please enter a valid URL starting with https://
              </p>
            )}

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-600">
                <span className="font-medium">Note:</span> For URL analysis, paste the article text directly into the text tab for best results. 
                URL analysis requires server-side content extraction which is not available in this demo version.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Examples */}
      <div className="relative">
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          Load Example
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showExamples && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {showExamples && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-10 min-w-[280px]"
            >
              {EXAMPLE_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => loadExample(i)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                >
                  <span className="text-base">{preset.label.split(' ')[0]}</span>
                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      {preset.label.split(' ').slice(1).join(' ')}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {preset.text.slice(0, 60)}...
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Analyze Button */}
      <div className="space-y-2">
        <Button
          fullWidth
          size="lg"
          onClick={handleSubmit}
          disabled={!canSubmit}
          loading={isAnalyzing}
          leftIcon={!isAnalyzing ? <Zap className="w-5 h-5" /> : undefined}
          className="text-base font-semibold"
        >
          {!activeApiKey ? 'Add API Key to Analyze' : isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
        </Button>

        {!activeApiKey && (
          <button onClick={onOpenApiKey} className="w-full text-center text-sm text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline">
            Set your Gemini API key to get started
          </button>
        )}

        {activeTab === 'text' && text.length > 0 && text.length < MIN_CHARS && (
          <p className="text-xs text-amber-600 text-center">
            Please enter at least {MIN_CHARS} characters ({MIN_CHARS - text.length} more needed)
          </p>
        )}

        <p className="text-xs text-slate-400 text-center leading-relaxed">
          ⚠️ AI analysis may not be 100% accurate. Always verify with human fact-checkers.
        </p>
      </div>
    </div>
  );
}
