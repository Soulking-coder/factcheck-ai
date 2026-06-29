import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Key, BookOpen, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface NavbarProps {}

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/analyze', label: 'Analyze', icon: Search },
  { to: '/sources', label: 'Methodology', icon: BookOpen },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm shadow-cyan-500/20 group-hover:shadow-md transition-shadow">
              <Shield className="w-4.5 h-4.5 text-white" style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <span className="font-bold text-white text-sm leading-none block">FactCheck AI</span>
              <span className="text-xs text-slate-500 leading-none">Misinformation Detector</span>
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
                    ? 'text-cyan-400 bg-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">

            <Link to="/analyze">
              <Button size="sm">
                Analyze Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
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
            className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-md overflow-hidden"
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
                      ? 'text-cyan-400 bg-cyan-500/10'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  )}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-slate-800 space-y-2">

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
