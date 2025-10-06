export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';
export type LogType = 'info' | 'success' | 'warning' | 'error' | 'task' | 'result' | 'thinking' | 'milestone';
export type AgentMode = 'simulated' | 'ai';
export type Theme = 'light' | 'dark';

export interface Task {
  id: string;
  title?: string;
  description: string;
  status: TaskStatus;
  priority: number | 'high' | 'medium' | 'low';
  createdAt: number | Date;
  completedAt?: number;
  result?: string;
  dependencies?: string[];
  // Medical research specific fields
  specialty?: string;
  studyType?: string;
  evidenceLevel?: string;
  citationsRequired?: boolean;
  ethicalApproval?: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  type: LogType;
  message: string;
  icon: string;
  metadata?: Record<string, unknown>;
}

export interface Settings {
  apiKey: string;
  provider: 'openrouter' | 'openai' | 'anthropic';
  model: string;
  temperature: number;
  iterationDelay: number;
  maxTokens: number;
  enableSounds: boolean;
  autoScroll: boolean;
  maxIterations: number;
}

export interface AgentState {
  objective: string;
  tasks: Task[];
  executionLog: LogEntry[];
  isRunning: boolean;
  isPaused: boolean;
  currentIteration: number;
  maxIterations: number;
  mode: AgentMode;
  settings: Settings;
  theme: Theme;
  sidebarCollapsed: boolean;
  selectedTask: string | null;
  sessionId: string;
  // Medical research fields
  medicalMode?: boolean;
  currentSpecialty?: string;
  currentStudyType?: string;
}
