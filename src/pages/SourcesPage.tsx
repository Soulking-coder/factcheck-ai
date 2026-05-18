import { motion } from 'framer-motion';
import { BookOpen, Shield, AlertTriangle, ExternalLink, CheckCircle, Brain, Scale, Info } from 'lucide-react';

const trustedSources = [
  {
    name: 'Snopes',
    url: 'https://snopes.com',
    description: 'One of the oldest and most respected fact-checking websites. Covers viral rumors, urban legends, and internet misinformation.',
    specialty: 'Viral claims, urban legends',
    reliability: 'high',
    color: '#FF6B35',
  },
  {
    name: 'PolitiFact',
    url: 'https://politifact.com',
    description: 'Pulitzer Prize-winning fact-checker from the Poynter Institute. Specializes in US political claims with the famous Truth-O-Meter.',
    specialty: 'US Politics',
    reliability: 'high',
    color: '#2D9CDB',
  },
  {
    name: 'FactCheck.org',
    url: 'https://factcheck.org',
    description: 'Project of the Annenberg Public Policy Center. Focuses on reducing deception and confusion in US politics.',
    specialty: 'US political statements',
    reliability: 'high',
    color: '#27AE60',
  },
  {
    name: 'Reuters Fact Check',
    url: 'https://reuters.com/fact-check',
    description: 'International news agency\'s fact-checking unit. Covers global claims with strong journalistic standards.',
    specialty: 'Global news and claims',
    reliability: 'high',
    color: '#E74C3C',
  },
  {
    name: 'AP Fact Check',
    url: 'https://apnews.com/APFactCheck',
    description: 'Associated Press fact-checking team. International coverage with rigorous journalism standards.',
    specialty: 'Global politics and news',
    reliability: 'high',
    color: '#C0392B',
  },
  {
    name: 'Full Fact',
    url: 'https://fullfact.org',
    description: 'UK\'s independent fact-checking charity. Focuses on UK politics, health, and economics.',
    specialty: 'UK politics and health',
    reliability: 'high',
    color: '#8E44AD',
  },
  {
    name: 'Africa Check',
    url: 'https://africacheck.org',
    description: 'Africa\'s first independent fact-checking organization. Covers claims across the African continent.',
    specialty: 'African news and politics',
    reliability: 'high',
    color: '#F39C12',
  },
];

const analysisFactors = [
  {
    icon: Shield,
    title: 'Credibility Score (0-100)',
    description: 'Evaluates source quality, evidence provided, verifiable citations, expert consensus, and journalistic standards. A score above 70 indicates mostly credible content.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Scale,
    title: 'Political Bias (-100 to +100)',
    description: 'Measures the political lean of the content based on language choice, framing, source selection, and omission of counterarguments. 0 = neutral. Does NOT indicate accuracy.',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    icon: Brain,
    title: 'Emotional Manipulation (0-100)',
    description: 'Detects emotional manipulation tactics including fear-mongering, outrage bait, us-vs-them framing, loaded language, sensationalism, and conspiracy framing.',
    color: 'text-red-600 bg-red-50',
  },
  {
    icon: AlertTriangle,
    title: 'Misinformation Risk',
    description: 'Overall risk assessment combining all scores: Low (mostly accurate), Medium (some concerns), High (significant issues), Very High (likely misinformation).',
    color: 'text-amber-600 bg-amber-50',
  },
];

const limitations = [
  'AI models can make mistakes. Always verify with human fact-checkers.',
  'The AI may not know about very recent events (after training cutoff).',
  'The AI cannot access the internet to verify real-time information.',
  'Nuanced or complex topics may be oversimplified.',
  'Satire and humor may be misidentified as misinformation.',
  'Content in less common languages may have lower accuracy.',
  'The AI reflects patterns in its training data, which may have biases.',
];

export function SourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-3 bg-blue-50 rounded-2xl mb-4">
            <BookOpen className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Our Methodology</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Understanding how FactCheck AI analyzes content for credibility, bias, and misinformation.
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">How the AI Analysis Works</h2>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              FactCheck AI uses <strong className="text-slate-800">Gemini 2.5 Flash</strong>, Google's highly capable language model, 
              configured with a detailed system prompt written by our team. The AI is instructed to behave as a 
              professional fact-checker analyzing content for multiple dimensions of credibility.
            </p>
            <p>
              The system prompt is designed to be <strong className="text-slate-800">completely non-partisan</strong> — 
              the AI is explicitly instructed not to take political sides and to evaluate content based solely on 
              journalistic standards, evidence quality, and factual accuracy.
            </p>
            <p>
              Every response is <strong className="text-slate-800">validated against a strict JSON schema</strong> to ensure 
              all scores are within valid ranges and all required fields are present. If the response is invalid, 
              the system retries with corrective prompts.
            </p>
          </div>
        </motion.div>

        {/* Analysis Factors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">What Gets Analyzed</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {analysisFactors.map((factor, i) => (
              <motion.div
                key={factor.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
              >
                <div className={`inline-flex p-2 rounded-xl ${factor.color} mb-3`}>
                  <factor.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 text-sm">{factor.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{factor.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Verdict Explanations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">Understanding Verdicts</h2>
          <div className="space-y-4">
            {[
              { verdict: '✅ Likely True', color: 'text-emerald-700', description: 'The main claims appear factually accurate based on available evidence and align with expert consensus.' },
              { verdict: '⚠️ Mixed', color: 'text-amber-700', description: 'The content contains a mix of accurate and inaccurate or misleading information. Read critically and verify specific claims.' },
              { verdict: '❌ Likely False', color: 'text-red-700', description: 'The main claims appear to be false, misleading, or not supported by credible evidence. Do not share without thorough verification.' },
              { verdict: '❓ Unverifiable', color: 'text-slate-600', description: 'The claims cannot be independently verified. This may be because they involve predictions, unconfirmed events, or information that cannot be cross-referenced.' },
            ].map(item => (
              <div key={item.verdict} className="p-4 bg-slate-50 rounded-xl">
                <h3 className={`font-semibold mb-1 ${item.color}`}>{item.verdict}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trusted Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-2">Trusted Fact-Checking Organizations</h2>
          <p className="text-sm text-slate-500 mb-5">
            These are independent organizations we recommend for verification. We are not affiliated with any of them.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {trustedSources.map((source, i) => (
              <motion.a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
                className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: source.color }}
                >
                  {source.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{source.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-1">{source.description}</p>
                  <span className="text-xs text-blue-600 font-medium">{source.specialty}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Limitations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-amber-800">Important Limitations</h2>
          </div>
          <div className="space-y-2.5">
            {limitations.map((limitation, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">{limitation}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-amber-100/50 rounded-xl border border-amber-200">
            <p className="text-sm font-semibold text-amber-900 mb-1">Our Core Principle</p>
            <p className="text-sm text-amber-800">
              FactCheck AI is a <strong>decision-support tool</strong>, not a replacement for human judgment. 
              Use our analysis as a starting point, then verify important claims with professional fact-checkers 
              and multiple independent sources before making decisions or sharing content.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
