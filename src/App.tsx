import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/layout/Navbar';

import { DisclaimerBanner } from './components/ui/DisclaimerBanner';
import { HomePage } from './pages/HomePage';
import { AnalyzePage } from './pages/AnalyzePage';
import { SourcesPage } from './pages/SourcesPage';

export default function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Navbar />

        <main className="pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/sources" element={<SourcesPage />} />
            {/* Fallback */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="text-6xl mb-4">🔍</div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
                <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">← Go Home</a>
              </div>
            } />
          </Routes>
        </main>

        <DisclaimerBanner />



        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              fontSize: '14px',
              borderRadius: '12px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#f1f5f9' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' },
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
