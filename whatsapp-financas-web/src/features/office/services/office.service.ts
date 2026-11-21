import { api } from '@/features/expenses/services/api';
import type { AgentRole, AgentTaskResult, OfficeState } from '../types/office';

export const officeService = {
  async getOfficeState(): Promise<OfficeState> {
    const { data } = await api.get<OfficeState>('/ai/office');
    return data;
  },

  async runAgent(payload: {
    agentId: AgentRole;
    prompt: string;
    executionMode?: 'api' | 'cli';
  }): Promise<AgentTaskResult> {
    const { data } = await api.post<AgentTaskResult>('/ai/agents/run', payload);
    return data;
  },

  async runStandup(): Promise<AgentTaskResult[]> {
    const { data } = await api.post<AgentTaskResult[]>('/ai/office/standup');
    return data;
  },
};
