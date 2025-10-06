import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AgentState, Task, LogEntry, Settings } from '../types';
import type { MedicalSpecialty, ResearchStudyType } from '../types/medical';
import { generateMedicalTasks } from '../services/medicalTaskGenerator';
import { MedicalExporter } from '../services/medicalExporter';

const defaultSettings: Settings = {
  apiKey: '',
  provider: 'openrouter',
  model: 'meta-llama/llama-3.1-8b-instruct:free',
  temperature: 0.7,
  iterationDelay: 1000,
  maxTokens: 1000,
  enableSounds: false,
  autoScroll: true,
  maxIterations: 20,
};

interface AgentStore extends AgentState {
  // Existing methods
  setObjective: (objective: string) => void;
  startAgent: () => void;
  stopAgent: () => void;
  pauseAgent: () => void;
  resetAgent: () => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  completeTask: (taskId: string, result: string) => void;
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSelectedTask: (taskId: string | null) => void;
  incrementIteration: () => void;
  setMode: (mode: 'simulated' | 'ai') => void;
  
  // Medical research methods
  generateMedicalTasks: (objective: string, specialty?: MedicalSpecialty, studyType?: ResearchStudyType) => void;
  exportMedicalReport: (format: 'markdown' | 'json' | 'csv' | 'pubmed', specialty?: MedicalSpecialty) => string;
  setMedicalMode: (enabled: boolean) => void;
  medicalMode?: boolean;
  currentSpecialty?: MedicalSpecialty;
  currentStudyType?: ResearchStudyType;
}

export const useAgentStore = create<AgentStore>()(
  persist(
    (set, get) => ({
      objective: '',
      tasks: [],
      executionLog: [],
      isRunning: false,
      isPaused: false,
      currentIteration: 0,
      maxIterations: 20,
      mode: 'simulated',
      settings: defaultSettings,
      theme: 'dark',
      sidebarCollapsed: false,
      selectedTask: null,
      sessionId: Date.now().toString(),

      setObjective: (objective) => set({ objective }),

      startAgent: () => set({ isRunning: true, isPaused: false }),

      stopAgent: () => set({ isRunning: false }),

      pauseAgent: () => set({ isPaused: true }),

      resetAgent: () => {
        set({
          objective: '',
          tasks: [],
          executionLog: [],
          isRunning: false,
          isPaused: false,
          currentIteration: 0,
          selectedTask: null,
          sessionId: Date.now().toString(),
        });
      },

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        })),

      completeTask: (taskId, result) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, status: 'completed' as const, result, completedAt: Date.now() }
              : task
          ),
        })),

      addLog: (entry) =>
        set((state) => ({
          executionLog: [
            ...state.executionLog,
            {
              ...entry,
              id: `log-${Date.now()}-${Math.random()}`,
              timestamp: Date.now(),
            },
          ],
        })),

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),

      setSelectedTask: (taskId) => set({ selectedTask: taskId }),

      incrementIteration: () =>
        set((state) => ({
          currentIteration: state.currentIteration + 1,
        })),

      setMode: (mode) => set({ mode }),

      // Medical research methods
      generateMedicalTasks: (objective, specialty, studyType) => {
        const medicalTasks = generateMedicalTasks(objective, specialty, studyType);
        set((state) => ({
          tasks: [...state.tasks, ...medicalTasks],
          currentSpecialty: specialty,
          currentStudyType: studyType,
          medicalMode: true
        }));
      },

      exportMedicalReport: (format, specialty) => {
        const state = get();
        switch (format) {
          case 'markdown':
            return MedicalExporter.exportToMarkdown(
              state.objective,
              state.tasks,
              state.executionLog,
              specialty || state.currentSpecialty
            );
          case 'json':
            return MedicalExporter.exportToJSON(
              state.objective,
              state.tasks,
              state.executionLog,
              specialty || state.currentSpecialty
            );
          case 'csv':
            return MedicalExporter.exportToCSV(state.tasks);
          case 'pubmed':
            return MedicalExporter.exportToPubMedFormat(state.tasks);
          default:
            return MedicalExporter.exportToMarkdown(
              state.objective,
              state.tasks,
              state.executionLog,
              specialty || state.currentSpecialty
            );
        }
      },

      setMedicalMode: (enabled) => set({ medicalMode: enabled }),
    }),
    {
      name: 'babyagi-storage',
      partialize: (state) => ({
        settings: state.settings,
        theme: state.theme,
      }),
    }
  )
);
