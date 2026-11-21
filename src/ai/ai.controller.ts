import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { RunAgentDto } from './dto/run-agent.dto';

@ApiTags('AI Agents Office')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('office')
  @ApiOperation({
    summary:
      'Retorna o estado em tempo real do escritório de agentes OpenCode Go',
  })
  getOfficeState() {
    return this.aiService.getOfficeState();
  }

  @Post('agents/run')
  @ApiOperation({
    summary: 'Executa um agente específico usando OpenCode Go (API ou CLI)',
  })
  runAgent(@Body() dto: RunAgentDto) {
    return this.aiService.runAgent(
      dto.agentId,
      dto.prompt,
      dto.executionMode || 'api',
    );
  }

  @Post('office/standup')
  @ApiOperation({
    summary:
      'Dispara uma reunião de Daily Standup entre os agentes financeiros',
  })
  runStandup() {
    return this.aiService.runDailyStandup();
  }
}
