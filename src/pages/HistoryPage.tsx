import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, Search, Filter, BarChart2, Trash2, AlertCircle } from 'lucide-react';
import { useAnalysisHistory } from '../hooks/useAnalysisHistory';
import { HistoryCard } from '../components/history/HistoryCard';
import { useAppStore } from '../store/appStore';
import { AnalysisResult, FilterOptions, Verdict, ContentType } from '../types';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import { VerdictPieChart } from '../components/stats/VerdictPieChart';
import { ScoreAreaChart } from '../components/stats/ScoreAreaChart';

const verdictFilters: Array<{ value: Verdict | 'all'; label: string }> = [
  { value: 'all', label: 'All Verdicts' },
  { value: 'Likely True', label: 'Likely True' },
  { value: 'Mixed', label: 'Mixed' },
  { value: 'Likely False', label: 'Likely False' },
  { value: 'Unverifiable', label: 'Unverifiable' },
];

const contentTypeFilters: Array<{ value: ContentType | 'all'; label: string }> = [
  { value: 'all', label: 'All Types' },
  { value: 'article', label: 'Articles' },
  { value: 'claim', label: 'Claims' },
  { value: 'social-media-post', label: 'Social Posts' },
];

const sortOptions: Array<{ value: FilterOptions['sort']; label: string }> = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest-score', label: 'Highest Score' },
  { value: 'lowest-score', label: 'Lowest Score' },
];

export function HistoryPage() {
  const { history, stats, isLoaded, removeAnalysis, removeAll, getFiltered } = useAnalysisHistory();
  const { setCurrentResult } = useAppStore();
  const [filters, setFilters] = useState<FilterOptions>({ verdict: 'all', contentType: 'all', sort: 'newest' });
  const [search, setSearch] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() => getFiltered({ ...filters, search }), [getFiltered, filters, search]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = page < totalPages;

  const handleView = (result: AnalysisResult) => {
    setCurrentResult(result);
    window.location.href = '/analyze';
  };

  const handleDelete = (id: string) => {
    removeAnalysis(id);
  };

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ verdict: 'all', contentType: 'all', sort: 'newest' });
    setSearch('');
    setPage(1);
  };

  const hasActiveFilters = filters.verdict !== 'all' || filters.contentType !== 'all' || search.trim() !== '';

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <History className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Analysis History</h1>
                <p className="text-sm text-slate-500">{stats.total} total analyses stored locally</p>
              </div>
            </div>

            {stats.total > 0 && (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Clear All Confirm */}
        <AnimatePresence>
          {showConfirmClear && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-red-800 text-sm">Delete all {stats.total} analyses?</p>
                <p className="text-xs text-red-600 mt-0.5">This cannot be undone.</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="danger" onClick={() => { removeAll(); setShowConfirmClear(false); }}>
                  Delete All
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowConfirmClear(false)}>Cancel</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        {stats.total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
          >
            {[
              { label: 'Total', value: stats.total, icon: '📊' },
              { label: 'This Month', value: stats.thisMonth, icon: '📅' },
              { label: 'Avg Credibility', value: `${stats.avgCredibility}/100`, icon: '⭐' },
              {
                label: 'Most Common',
                value: Object.entries(stats.verdictCounts).sort((a, b) => b[1] - a[1])[0]?.[0]?.replace('Likely ', '') || '-',
                icon: '🏆',
              },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className="font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Search & Filters */}
        {stats.total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 space-y-3"
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search your analyses..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Filter className="w-4 h-4 text-slate-400 mt-1.5 shrink-0" />

              {/* Verdict */}
              <select
                value={filters.verdict}
                onChange={e => updateFilter('verdict', e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              >
                {verdictFilters.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>

              {/* Content Type */}
              <select
                value={filters.contentType}
                onChange={e => updateFilter('contentType', e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              >
                {contentTypeFilters.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>

              {/* Sort */}
              <select
                value={filters.sort}
                onChange={e => updateFilter('sort', e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              >
                {sortOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {filtered.length !== stats.total && (
              <p className="text-xs text-slate-400">
                Showing {filtered.length} of {stats.total} analyses
              </p>
            )}
          </motion.div>
        )}

        {/* Results */}
        {stats.total === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">No analyses yet</h2>
            <p className="text-slate-500 mb-6">Your analysis history will appear here after you fact-check some content.</p>
            <Link to="/analyze">
              <Button>Analyze Your First Article</Button>
            </Link>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">No results match your filters</h2>
            <p className="text-slate-500 mb-4">Try adjusting your search or filter criteria.</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {paginated.map((result, i) => (
                <HistoryCard
                  key={result.id}
                  result={result}
                  onView={handleView}
                  onDelete={handleDelete}
                  index={i}
                />
              ))}
            </AnimatePresence>

            {hasMore && (
              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => setPage(p => p + 1)}>
                  Load More ({filtered.length - paginated.length} remaining)
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Stats Charts */}
        {stats.total >= 3 && (
          <div className="mt-8 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Verdict Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >
                <div className="flex items-center gap-2 mb-5">
                  <BarChart2 className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-slate-800">Verdict Distribution</h3>
                </div>
                <VerdictPieChart stats={stats} />
              </motion.div>

              {/* Score Trends */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <BarChart2 className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-slate-800">Score Trends (Last 14 Days)</h3>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    Avg Credibility
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    Avg Emotional Manip.
                  </div>
                </div>
                <ScoreAreaChart history={history} days={14} />
              </motion.div>
            </div>

            {/* Bar breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
            >
              <h3 className="font-semibold text-slate-800 mb-4">Verdict Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(stats.verdictCounts).map(([verdict, count]) => {
                  const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  const colors: Record<string, string> = {
                    'Likely True': 'bg-emerald-400',
                    Mixed: 'bg-amber-400',
                    'Likely False': 'bg-red-400',
                    Unverifiable: 'bg-slate-400',
                  };
                  return (
                    <div key={verdict}>
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>{verdict}</span>
                        <span className="font-medium">{count} ({Math.round(percent)}%)</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className={cn('h-full rounded-full', colors[verdict])}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
