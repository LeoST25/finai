import { IsIn, IsOptional, IsString } from 'class-validator';
import type { AgentRole } from '../ai.types';

export class RunAgentDto {
  @IsIn(['cfo', 'auditor', 'planner', 'categorizer'])
  agentId: AgentRole;

  @IsString()
  prompt: string;

  @IsOptional()
  @IsIn(['api', 'cli'])
  executionMode?: 'api' | 'cli';
}
