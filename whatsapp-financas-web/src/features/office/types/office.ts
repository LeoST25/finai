import type { ReactNode } from "react";

export type AgentRole = 'cfo' | 'auditor' | 'planner' | 'categorizer';

export type AgentStatus = 'idle' | 'thinking' | 'working' | 'reviewing' | 'done' | 'error';

export interface AgentProfile {
  id: AgentRole;
  name: string;
  roleTitle: string;
  department: string;
  model: string;
  engine: 'opencode-go-api' | 'opencode-cli';
  status: AgentStatus;
  currentTask: string;
  deskPosition: { x: number; y: number };
  accentColor: string;
  avatarBadge: string;
  lastOutput?: string;
  updatedAt: string;
}

export interface OfficeLogEntry {
  message: ReactNode;
  id: string;
  agentId: AgentRole;
  agentName: string;
  action: string;
  detail: string;
  timestamp: string;
  type: 'info' | 'action' | 'alert' | 'success';
}

export interface OfficeState {
  provider: string;
  baseUrl: string;
  apiKeyConfigured: boolean;
  agents: AgentProfile[];
  logs: OfficeLogEntry[];
}

export interface AgentTaskResult {
  agentId: AgentRole;
  modelUsed: string;
  mode: 'opencode-go-api' | 'opencode-cli' | 'local-fallback';
  response: string;
  durationMs: number;
  timestamp: string;
}
