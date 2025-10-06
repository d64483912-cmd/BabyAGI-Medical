'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MainPanel } from '@/components/layout/MainPanel';
import { PWAInstall } from '@/components/PWAInstall';
import { SplashScreen } from '@/components/splash/SplashScreen';
import { useAgentStore } from '@/lib/stores/agentStore';
import { useEffect, useState } from 'react';

export default function Home() {
  const { theme } = useAgentStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Add PWA-specific mobile viewport meta tags
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
    }
    
    // Add mobile-specific CSS classes
    document.body.classList.add('mobile-optimized');
    
    // Check if this is a PWA launch
    const urlParams = new URLSearchParams(window.location.search);
    const isPWALaunch = urlParams.get('source') === 'pwa' || window.matchMedia('(display-mode: standalone)').matches;
    
    if (!isPWALaunch && localStorage.getItem('baby-agi-visited')) {
      // Skip splash for repeat visits from browser
      setShowSplash(false);
    } else {
      // Show splash for PWA launches or first visit
      localStorage.setItem('baby-agi-visited', 'true');
    }
  }, [theme]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 mobile-layout">
      <Sidebar />
      <TopBar />
      <MainPanel />
      <PWAInstall />
      
      {/* Mobile-specific styles */}
      <style jsx global>{`
        .mobile-optimized {
          -webkit-overflow-scrolling: touch;
          -webkit-text-size-adjust: 100%;
          -webkit-tap-highlight-color: transparent;
        }
        
        .mobile-layout {
          touch-action: manipulation;
        }
        
        @media (max-width: 768px) {
          body {
            overflow-x: hidden;
          }
          
          .mobile-layout {
            padding-bottom: env(safe-area-inset-bottom);
            padding-top: env(safe-area-inset-top);
          }
        }
        
        /* PWA specific styles */
        @media (display-mode: standalone) {
          .mobile-layout {
            padding-top: max(env(safe-area-inset-top), 20px);
          }
        }
      `}</style>
    </div>
  );
}
