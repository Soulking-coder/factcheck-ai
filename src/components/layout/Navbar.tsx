import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Key, BookOpen, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/appStore';
import { cn } from '../../utils/cn';

interface NavbarProps {
  onOpenApiKey: () => void;
}

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/analyze', label: 'Analyze', icon: Search },
  { to: '/sources', label: 'Methodology', icon: BookOpen },
];

export function Navbar({ onOpenApiKey }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { geminiApiKey } = useAppStore();

  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Shield className="w-4.5 h-4.5 text-white" style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm leading-none block">FactCheck AI</span>
              <span className="text-xs text-slate-400 leading-none">Misinformation Detector</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative',
                  location.pathname === link.to
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenApiKey}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                geminiApiKey
                  ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                  : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
              )}
            >
              <Key className="w-4 h-4" />
              {geminiApiKey ? 'API Key Set' : 'Set API Key'}
            </button>
            <Link to="/analyze">
              <Button size="sm">
                Analyze Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full',
                    location.pathname === link.to
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => { onOpenApiKey(); setMobileOpen(false); }}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    geminiApiKey ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'
                  )}
                >
                  <Key className="w-4 h-4" />
                  {geminiApiKey ? '✓ API Key Configured' : '⚠ Set API Key'}
                </button>
                <Link to="/analyze" onClick={() => setMobileOpen(false)}>
                  <Button fullWidth size="sm">
                    Analyze Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
