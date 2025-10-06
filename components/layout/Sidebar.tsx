'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAgentStore } from '@/lib/stores/agentStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskQueue } from '../task/TaskQueue';
import { useAgent } from '@/lib/hooks/useAgent';
import { Play, Pause, RotateCcw, Download, ChevronRight, ChevronLeft } from 'lucide-react';
import { MedicalPanel } from '../medical/MedicalPanel';

import { useMobileGestures, useIsMobile } from '@/lib/hooks/useMobileGestures';

export function Sidebar() {
  const { objective, setObjective, isRunning, isPaused, sidebarCollapsed, toggleSidebar } = useAgentStore();
  const { startAgent, pauseAgent, resetAgent } = useAgent();
  const [localObjective, setLocalObjective] = useState(objective);
  const isMobile = useIsMobile();
  
  // Mobile gesture support for sidebar
  const sidebarGestureRef = useMobileGestures({
    onSwipeLeft: () => {
      if (!sidebarCollapsed && isMobile) {
        toggleSidebar();
      }
    },
    onSwipeRight: () => {
      if (sidebarCollapsed && isMobile) {
        toggleSidebar();
      }
    },
    threshold: 80
  });

  const handleStart = () => {
    setObjective(localObjective);
    startAgent();
  };

  const handleExport = () => {
    const state = useAgentStore.getState();
    const exportData = {
      sessionId: state.sessionId,
      objective: state.objective,
      tasks: state.tasks,
      executionLog: state.executionLog,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `babyagi-session-${state.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarCollapsed ? 0 : 320,
          x: sidebarCollapsed ? -320 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-800 overflow-hidden z-40 md:relative md:translate-x-0"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        <div className="w-[320px] h-full flex flex-col touch-pan-y" ref={sidebarGestureRef as React.RefObject<HTMLDivElement>}>
          {/* Header */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-100">BabyAGI PWA</h1>
                <p className="text-xs text-slate-400">Autonomous Agent</p>
              </div>
            </div>
          </div>

          {/* Objective Input */}
          <div className="p-4 border-b border-slate-800">
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Objective
            </label>
            <Textarea
              value={localObjective}
              onChange={(e) => setLocalObjective(e.target.value)}
              placeholder="Enter your objective here..."
              className="min-h-[100px] bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 resize-none"
              disabled={isRunning}
            />
            <Button
              onClick={handleStart}
              disabled={isRunning || !localObjective.trim()}
              className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Agent
            </Button>
          </div>

          {/* Medical Panel and Task Queue - Combined Scrollable Area */}
          <ScrollArea className="flex-1 max-h-[calc(100vh-280px)] overscroll-contain">
            <div className="p-4 border-b border-slate-800 touch-manipulation">
              <MedicalPanel />
            </div>
            <div className="touch-manipulation">
              <TaskQueue />
            </div>
          </ScrollArea>

          {/* Controls */}
          <div className="p-4 border-t border-slate-800 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={isRunning && !isPaused ? pauseAgent : startAgent}
                disabled={!objective}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                {isRunning && !isPaused ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
              <Button
                onClick={resetAgent}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Session
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Toggle Button */}
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="icon"
        className="fixed left-2 top-2 z-50 bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700 touch-manipulation"
        style={{
          top: 'max(env(safe-area-inset-top), 8px)',
          left: '8px'
        }}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4 text-slate-300" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-slate-300" />
        )}
      </Button>
    </>
  );
}
