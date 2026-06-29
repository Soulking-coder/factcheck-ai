import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { animate, createTimeline, utils } from 'animejs';
import {
  Shield, Zap, BarChart2, Globe2, CheckCircle, AlertTriangle,
  XCircle, BookOpen, ArrowRight, Star, ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const stats = [
  { label: 'Analyses Possible', value: '∞', sublabel: 'With your API key' },
  { label: 'AI Model', value: 'Gemini', sublabel: "Google's Gemini 2.5 Flash" },
  { label: 'Fact-Check Sources', value: '7+', sublabel: 'Trusted sources' },
  { label: 'Languages', value: '50+', sublabel: 'Multilingual AI' },
];

const features = [
  {
    icon: BarChart2,
    title: 'Credibility Scoring',
    description: '0-100 score based on evidence quality, source citations, expert consensus, and factual accuracy.',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    icon: Globe2,
    title: 'Political Bias Detection',
    description: 'Detect left/right political bias using language analysis, framing patterns, and source selection.',
    color: 'from-indigo-400 to-purple-600',
  },
  {
    icon: AlertTriangle,
    title: 'Emotional Manipulation',
    description: 'Identify fear-mongering, outrage bait, us-vs-them framing, and other emotional manipulation tactics.',
    color: 'from-amber-400 to-orange-600',
  },
  {
    icon: Shield,
    title: 'Misinformation Risk',
    description: 'Overall risk assessment: Low, Medium, High, or Very High based on combined analysis.',
    color: 'from-rose-400 to-red-600',
  },
  {
    icon: BookOpen,
    title: 'Source Recommendations',
    description: 'Get 3-5 specific fact-checking sources relevant to the exact claims in your content.',
    color: 'from-emerald-400 to-teal-600',
  },
  {
    icon: CheckCircle,
    title: 'Clear Verdict',
    description: 'Simple verdict: Likely True, Mixed, Likely False, or Unverifiable — explained in plain English.',
    color: 'from-sky-400 to-blue-500',
  },
];

const steps = [
  {
    step: '01',
    title: 'Paste Your Content',
    description: 'Paste any article, social media post, or specific factual claim you want to verify.',
    icon: '📋',
  },
  {
    step: '02',
    title: 'AI Analyzes Instantly',
    description: 'Gemini analyzes the content for credibility, bias, emotional manipulation, and red flags.',
    icon: '🧠',
  },
  {
    step: '03',
    title: 'Get Your Report',
    description: 'Receive a detailed report with scores, specific flags, and recommended fact-checking sources.',
    icon: '📊',
  },
];

const verdictExamples = [
  { verdict: 'Likely True', icon: CheckCircle, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', score: 88 },
  { verdict: 'Mixed', icon: AlertTriangle, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', score: 52 },
  { verdict: 'Likely False', icon: XCircle, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10', score: 18 },
];

const faqs = [
  {
    q: 'How accurate is the AI analysis?',
    a: 'Gemini is highly capable but not infallible. Our analysis is a helpful starting point, not a final verdict. Always cross-reference with human fact-checkers. We aim for 85%+ agreement with professional fact-checkers.',
  },
  {
    q: 'Is my content stored or shared?',
    a: 'No. Content you analyze is sent directly to Google using your own API key and is subject to Google\'s privacy policy. We do not store your content on any server. History is saved locally in your browser only.',
  },
  {
    q: 'What languages are supported?',
    a: 'Gemini supports 50+ languages. You can paste content in any language and receive analysis. The AI will analyze in that language but return scores and verdicts in English.',
  },
  {
    q: 'How is this different from Snopes or PolitiFact?',
    a: 'Those are human fact-checkers with databases of verified claims. We use AI to analyze ANY content in real-time, even brand-new claims not yet fact-checked by humans. We also recommend those sources for verification.',
  },
  {
    q: 'How does the bias score work?',
    a: 'The bias score (-100 to +100) measures political perspective, not accuracy. -100 is extreme left bias, +100 is extreme right bias. A score of 0 means neutral. Biased content can still be factually accurate.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No account needed. You only need a free Gemini API key (from Google AI Studio). Your key stays in your browser and is never sent to our servers.',
  },
];

export function HomePage() {
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Hero animations using anime.js
    const tl = createTimeline({
      defaults: { easing: 'easeOutExpo' },
    });

    tl.add('.hero-element', {
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 1200,
      delay: utils.stagger(150)
    })
    .add('.verdict-card', {
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: utils.stagger(100),
    }, '-=800');

    // Scroll animation for features
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate('.feature-card', {
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 1000,
            delay: utils.stagger(100),
            easing: 'easeOutExpo'
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden py-20 md:py-32">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40" />
        
        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Badge */}
            <div className="hero-element inline-flex items-center gap-2 glass border border-cyan-400/30 text-cyan-300 px-5 py-2 rounded-full text-sm font-medium shadow-[0_0_15px_rgba(34,211,238,0.2)]" style={{ opacity: 0 }}>
              <Star className="w-4 h-4 fill-current glow-text" />
              AI-Powered Fact Checking · Powered by Gemini
            </div>

            {/* Headline */}
            <h1 className="hero-element text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight text-white" style={{ opacity: 0 }}>
              Don't Share Misinformation.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 glow-text">
                Verify First.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="hero-element text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed" style={{ opacity: 0 }}>
              Instantly analyze any article or claim for credibility, political bias, 
              and misinformation risk using advanced AI. Results in seconds.
            </p>

            {/* CTAs */}
            <div className="hero-element flex flex-col sm:flex-row items-center justify-center gap-6 pt-4" style={{ opacity: 0 }}>
              <Link to="/analyze">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-base font-semibold px-8 py-4 shadow-[0_0_20px_rgba(6,182,212,0.4)] border-0 text-white" leftIcon={<Zap className="w-5 h-5" />}>
                  Analyze Now — It's Free
                </Button>
              </Link>
              <button
                onClick={scrollToHowItWorks}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-base font-medium glass px-6 py-3.5 rounded-lg hover:bg-slate-800/50"
              >
                See How It Works
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust indicators */}
            <div className="hero-element flex flex-wrap justify-center gap-8 pt-8" style={{ opacity: 0 }}>
              {['Powered by Gemini', 'No account required', 'Results in seconds', 'Your data stays private'].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                  <CheckCircle className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Preview Cards */}
          <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6">
            {verdictExamples.map(({ verdict, icon: Icon, color, score }, i) => (
              <div
                key={verdict}
                className={`verdict-card flex items-center gap-4 px-6 py-4 rounded-xl border glass-card ${color}`}
                style={{ opacity: 0 }}
              >
                <div className={`p-2 rounded-lg bg-slate-900/50`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-base text-white">{verdict}</div>
                  <div className="text-xs font-medium opacity-80 mt-0.5">Credibility: {score}/100</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative border-y border-slate-800/60 glass z-10">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center group">
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                <div className="font-semibold text-slate-200 text-sm tracking-wide uppercase">{stat.label}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 glow-text">How It Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">Three simple steps to verify any content using advanced AI fact-checking.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className="relative group">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-px border-t-2 border-dashed border-slate-700 -translate-x-1/2 z-0 opacity-50" />
                )}
                <div className="relative glass-card rounded-2xl p-8 border border-slate-700/50 shadow-lg text-center hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500 transform hover:-translate-y-2">
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">Step {step.step}</div>
                  <h3 className="font-bold text-white text-xl mb-3">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-full bg-blue-900/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 glow-text">Comprehensive Analysis</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">Deep fact-checking across six key dimensions of content integrity.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="feature-card p-8 rounded-2xl border border-slate-800 glass-card hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 group"
                style={{ opacity: 0 }}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 relative bg-slate-950">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="glass rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-colors"
              >
                <h3 className="font-semibold text-white mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 shrink-0 font-bold">Q.</span>
                  {faq.q}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 pointer-events-none" />
        <div className="absolute inset-0 glass z-0" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white glow-text">Stop Misinformation.</h2>
            <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
              Verify content in seconds. No account needed. Just add your Gemini API key and start fact-checking.
            </p>
            <Link to="/analyze" className="inline-block mt-4">
              <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-200 text-lg font-bold px-10 py-5 shadow-[0_0_30px_rgba(255,255,255,0.3)] border-0">
                Start Analyzing Free
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white tracking-wide">FactCheck AI</span>
            </div>
            <div className="flex gap-8 text-sm font-medium">
              <Link to="/sources" className="hover:text-cyan-400 transition-colors">Methodology</Link>
              <Link to="/analyze" className="hover:text-cyan-400 transition-colors">Analyze</Link>
            </div>
            <p className="text-xs">
              © {new Date().getFullYear()} FactCheck AI.
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800/50">
            <p className="text-xs text-center leading-relaxed max-w-3xl mx-auto opacity-70">
              ⚠️ <strong>Disclaimer:</strong> This tool uses AI to assist in identifying potential misinformation. 
              It is not a substitute for professional fact-checking. Results may not be 100% accurate. 
              Always verify important claims with multiple independent human sources before making decisions or sharing content.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
