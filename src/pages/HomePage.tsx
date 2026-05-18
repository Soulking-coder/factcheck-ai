import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Zap, BarChart2, Globe2, CheckCircle, AlertTriangle,
  XCircle, BookOpen, ArrowRight, Star, ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

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
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Globe2,
    title: 'Political Bias Detection',
    description: 'Detect left/right political bias using language analysis, framing patterns, and source selection.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: AlertTriangle,
    title: 'Emotional Manipulation',
    description: 'Identify fear-mongering, outrage bait, us-vs-them framing, and other emotional manipulation tactics.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Misinformation Risk',
    description: 'Overall risk assessment: Low, Medium, High, or Very High based on combined analysis.',
    color: 'from-red-500 to-rose-600',
  },
  {
    icon: BookOpen,
    title: 'Source Recommendations',
    description: 'Get 3-5 specific fact-checking sources relevant to the exact claims in your content.',
    color: 'from-emerald-500 to-green-600',
  },
  {
    icon: CheckCircle,
    title: 'Clear Verdict',
    description: 'Simple verdict: Likely True, Mixed, Likely False, or Unverifiable — explained in plain English.',
    color: 'from-sky-500 to-blue-500',
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
  { verdict: 'Likely True', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', score: 88 },
  { verdict: 'Mixed', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-200', score: 52 },
  { verdict: 'Likely False', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200', score: 18 },
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

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-white">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            className="text-center space-y-6 max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium">
              <Star className="w-3.5 h-3.5 fill-current" />
              AI-Powered Fact Checking · Powered by Gemini
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Don't Share Misinformation.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Verify First.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={fadeUp} custom={2} className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Instantly analyze any article or claim for credibility, political bias, 
              and misinformation risk using advanced AI. Results in seconds.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/analyze">
                <Button size="lg" className="text-base font-semibold px-8 shadow-lg shadow-blue-500/25" leftIcon={<Zap className="w-5 h-5" />}>
                  Analyze Now — It's Free
                </Button>
              </Link>
              <button
                onClick={scrollToHowItWorks}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-base font-medium"
              >
                See How It Works
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap justify-center gap-6 pt-4">
              {['Powered by Gemini', 'No account required', 'Results in seconds', 'Your data stays private'].map(item => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  {item}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Preview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {verdictExamples.map(({ verdict, icon: Icon, color, score }, i) => (
              <div
                key={verdict}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border ${color} backdrop-blur-sm bg-white/90`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Icon className="w-5 h-5" />
                <div>
                  <div className="font-semibold text-sm">{verdict}</div>
                  <div className="text-xs opacity-70">Credibility: {score}/100</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
                <div className="font-medium text-slate-800 text-sm">{stat.label}</div>
                <div className="text-xs text-slate-400">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Three simple steps to verify any content using advanced AI fact-checking.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px border-t-2 border-dashed border-slate-200 -translate-x-1/2 z-0" />
                )}
                <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Step {step.step}</div>
                  <h3 className="font-bold text-slate-900 text-lg mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What Gets Analyzed</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Comprehensive fact-checking across six key dimensions.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group p-6 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all bg-white"
              >
                <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 shadow-sm`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-slate-200 p-6"
              >
                <h3 className="font-semibold text-slate-900 mb-3 flex items-start gap-2">
                  <span className="text-blue-500 shrink-0">Q.</span>
                  {faq.q}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed pl-5">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">Stop Misinformation Before It Spreads</h2>
            <p className="text-blue-100 text-lg max-w-xl mx-auto">
              Verify content in seconds. No account needed. Just add your Gemini API key and start fact-checking.
            </p>
            <Link to="/analyze">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 text-base font-semibold px-8">
                Start Analyzing Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white text-sm">FactCheck AI</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/sources" className="hover:text-white transition-colors">Methodology</Link>
              <Link to="/analyze" className="hover:text-white transition-colors">Analyze</Link>
            </div>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} FactCheck AI. Not affiliated with any fact-checking organization.
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-600 text-center leading-relaxed max-w-2xl mx-auto">
              ⚠️ <strong className="text-slate-500">Disclaimer:</strong> This tool uses AI to assist in identifying potential misinformation. 
              It is not a substitute for professional fact-checking. Results may not be 100% accurate. 
              Always verify important claims with multiple independent human sources before making decisions or sharing content.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
