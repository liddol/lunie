import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { MoonDetailPage } from './pages/MoonDetailPage';
import { StarryBackground } from './components/Ornaments';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-serif mb-4" style={{ color: '#c6a445' }}>
        404 — Lost in the Shadows
      </h1>
      <p className="mb-6" style={{ color: 'rgba(232,212,168,0.7)' }}>
        This celestial path does not exist.
      </p>
      <a href="/" className="font-serif uppercase tracking-widest text-sm" style={{ color: '#c6a445', textDecoration: 'underline' }}>
        Return to the Sky
      </a>
    </div>
  );
}

export default function App() {
  return (
    <Router hook={useHashLocation}>
      <div className="relative min-h-screen w-full overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
        <StarryBackground />
        <div className="relative z-10">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/library" component={LibraryPage} />
            <Route path="/moon/:id" component={MoonDetailPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}
