import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Link2, Zap, ChevronDown, CheckCircle, XCircle,
  Newspaper, MessageSquare, Quote, ClipboardCheck
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ContentType } from '../../types';
import { EXAMPLE_PRESETS } from '../../lib/prompts/misinformationAnalysis';
import { cn } from '../../utils/cn';

interface AnalyzerInputProps {
  onAnalyze: (text: string, contentType: ContentType, url?: string) => void;
  isAnalyzing: boolean;
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

export function AnalyzerInput({ onAnalyze, isAnalyzing }: AnalyzerInputProps) {
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
  const canSubmit = isTextReady || isUrlReady;

  const charPercent = (text.length / MAX_CHARS) * 100;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/50 gap-1.5 backdrop-blur-md shadow-inner">
        <button
          onClick={() => setActiveTab('text')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300',
            activeTab === 'text'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
          )}
        >
          <FileText className="w-4 h-4" />
          Paste Text
        </button>
        <button
          onClick={() => setActiveTab('url')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300',
            activeTab === 'url'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
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
            className="space-y-4"
          >
            {/* Paste Feedback */}
            <AnimatePresence>
              {pasteFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-lg px-4 py-2.5"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  Text pasted. Ready to analyze.
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 pointer-events-none" />
              <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                onPaste={handlePaste}
                placeholder="Paste the article, news excerpt, claim, or social media post you want to fact-check..."
                className="relative w-full min-h-[220px] px-5 py-4 rounded-xl border border-slate-700/80 bg-slate-900/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-y text-base leading-relaxed backdrop-blur-xl shadow-inner transition-all"
                style={{ fontSize: '16px' }}
              />
              {/* Char Counter */}
              <div className={cn(
                'absolute bottom-3 right-3 text-xs font-mono transition-colors glass px-2 py-1 rounded-md border-0',
                text.length >= MAX_CHARS ? 'text-red-400' : text.length > MAX_CHARS * 0.8 ? 'text-amber-400' : 'text-slate-400'
              )}>
                {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </div>
            </div>

            {/* Char progress bar */}
            {text.length > 0 && (
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className={cn('h-full rounded-full transition-colors', charPercent > 90 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : charPercent > 70 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]')}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(charPercent, 100)}%` }}
                />
              </div>
            )}

            {/* Content Type */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">Select Content Type</label>
              <div className="grid grid-cols-3 gap-3">
                {contentTypeOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setContentType(opt.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center transition-all duration-300',
                      contentType === opt.value
                        ? 'border-cyan-500/50 bg-cyan-900/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] scale-[1.02]'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-600 hover:bg-slate-800/80 hover:text-slate-200'
                    )}
                  >
                    {opt.icon}
                    <span className="text-xs font-semibold tracking-wide">{opt.label}</span>
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
            className="space-y-4"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 pointer-events-none" />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                <Link2 className="w-5 h-5" />
              </div>
              <input
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://example.com/article..."
                className="relative w-full pl-12 pr-12 py-4 rounded-xl border border-slate-700/80 bg-slate-900/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-base backdrop-blur-xl shadow-inner transition-all"
                style={{ fontSize: '16px' }}
              />
              {urlValid !== null && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                  {urlValid ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]" />
                  )}
                </div>
              )}
            </div>

            {urlValid === false && (
              <p className="text-sm text-red-400 flex items-center gap-2 font-medium bg-red-950/30 p-2.5 rounded-lg border border-red-500/20">
                <XCircle className="w-4 h-4" />
                Please enter a valid URL starting with https://
              </p>
            )}

            <div className="p-5 glass rounded-xl border border-slate-800">
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="font-semibold text-cyan-400 mr-2">Note:</span> 
                For URL analysis, paste the article text directly into the text tab for best results. 
                URL analysis requires server-side content extraction which is not available in this demo version.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Examples */}
      <div className="relative pt-2">
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
        >
          <Zap className="w-4 h-4" />
          Load Example
          <ChevronDown className={cn('w-4 h-4 transition-transform duration-300', showExamples && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {showExamples && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-3 glass-card border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden z-20 min-w-[320px]"
            >
              {EXAMPLE_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => loadExample(i)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-slate-800/80 transition-colors border-b border-slate-800/50 last:border-0 group"
                >
                  <span className="text-sm font-bold text-cyan-400 group-hover:text-cyan-300">{preset.label.split(' ')[0]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-200 truncate">
                      {preset.label.split(' ').slice(1).join(' ')}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 truncate">
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
      <div className="space-y-4 pt-4">
        <Button
          fullWidth
          size="lg"
          onClick={handleSubmit}
          disabled={!canSubmit}
          loading={isAnalyzing}
          leftIcon={!isAnalyzing ? <Zap className="w-5 h-5" /> : undefined}
          className="text-lg font-bold py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-0 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 text-white disabled:opacity-50 disabled:shadow-none"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
        </Button>

        {activeTab === 'text' && text.length > 0 && text.length < MIN_CHARS && (
          <p className="text-xs text-amber-400 text-center font-medium bg-amber-950/20 py-1.5 rounded-md border border-amber-500/10">
            Please enter at least {MIN_CHARS} characters ({MIN_CHARS - text.length} more needed)
          </p>
        )}

        <p className="text-xs text-slate-500 text-center leading-relaxed">
          ⚠️ AI analysis may not be 100% accurate. Always verify with human fact-checkers.
        </p>
      </div>
    </div>
  );
}

