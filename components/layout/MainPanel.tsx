'use client';

import { useAgentStore } from '@/lib/stores/agentStore';
import { ProgressBar } from '../controls/ProgressBar';
import { ExecutionLog } from '../log/ExecutionLog';

export function MainPanel() {
  const { sidebarCollapsed } = useAgentStore();

  return (
    <main 
      className={`
        fixed top-16 right-0 bottom-0 transition-all duration-300
        ${sidebarCollapsed ? 'left-0' : 'left-0 md:left-[320px]'}
        touch-manipulation overscroll-contain
      `}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      <div className="h-full flex flex-col p-3 md:p-6 gap-3 md:gap-6 overflow-hidden">
        {/* Progress Section */}
        <ProgressBar />

        {/* Execution Log */}
        <div className="flex-1 bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden touch-pan-y">
          <ExecutionLog />
        </div>
      </div>
    </main>
  );
}
