import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateGoalDto, GoalTypeDto } from './create-goal.dto';

describe('CreateGoalDto', () => {
  async function validateDto(data: Record<string, unknown>) {
    const dto = plainToInstance(CreateGoalDto, data);

    return validate(dto);
  }

  it('deve aceitar uma meta válida', async () => {
    const errors = await validateDto({
      title: 'Reserva de emergência',
      description: 'Meta para emergências',
      category: 'Economia',
      type: GoalTypeDto.SAVINGS,
      targetAmount: 5000,
      currentAmount: 1000,
      deadline: '2026-12-31',
    });

    expect(errors).toHaveLength(0);
  });

  it('deve rejeitar título vazio', async () => {
    const errors = await validateDto({
      title: '',
      category: 'Economia',
      type: GoalTypeDto.SAVINGS,
      targetAmount: 5000,
    });

    expect(errors).not.toHaveLength(0);

    const titleError = errors.find((error) => error.property === 'title');

    expect(titleError).toBeDefined();
  });

  it('deve rejeitar um tipo inválido', async () => {
    const errors = await validateDto({
      title: 'Reserva',
      category: 'Economia',
      type: 'invalid-type',
      targetAmount: 5000,
    });

    const typeError = errors.find((error) => error.property === 'type');

    expect(typeError).toBeDefined();
  });

  it('deve rejeitar targetAmount negativo', async () => {
    const errors = await validateDto({
      title: 'Reserva',
      category: 'Economia',
      type: GoalTypeDto.SAVINGS,
      targetAmount: -100,
    });

    const amountError = errors.find(
      (error) => error.property === 'targetAmount',
    );

    expect(amountError).toBeDefined();
  });

  it('deve rejeitar currentAmount negativo', async () => {
    const errors = await validateDto({
      title: 'Reserva',
      category: 'Economia',
      type: GoalTypeDto.SAVINGS,
      targetAmount: 5000,
      currentAmount: -1,
    });

    const amountError = errors.find(
      (error) => error.property === 'currentAmount',
    );

    expect(amountError).toBeDefined();
  });

  it('deve rejeitar prazo inválido', async () => {
    const errors = await validateDto({
      title: 'Reserva',
      category: 'Economia',
      type: GoalTypeDto.SAVINGS,
      targetAmount: 5000,
      deadline: 'data-invalida',
    });

    const deadlineError = errors.find((error) => error.property === 'deadline');

    expect(deadlineError).toBeDefined();
  });

  it('deve aceitar os campos opcionais ausentes', async () => {
    const errors = await validateDto({
      title: 'Reserva',
      category: 'Economia',
      type: GoalTypeDto.SAVINGS,
      targetAmount: 5000,
    });

    expect(errors).toHaveLength(0);
  });
});
