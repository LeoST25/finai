import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { GoalTypeDto } from './create-goal.dto';
import { UpdateGoalDto } from './update-goal.dto';

describe('UpdateGoalDto', () => {
  async function validateDto(data: Record<string, unknown>) {
    const dto = plainToInstance(UpdateGoalDto, data);

    return validate(dto);
  }

  it('deve aceitar um objeto vazio', async () => {
    const errors = await validateDto({});

    expect(errors).toHaveLength(0);
  });

  it('deve aceitar atualização parcial válida', async () => {
    const errors = await validateDto({
      title: 'Novo título',
      currentAmount: 1500,
    });

    expect(errors).toHaveLength(0);
  });

  it('deve manter as validações do CreateGoalDto', async () => {
    const errors = await validateDto({
      targetAmount: -100,
      type: 'invalid-type',
    });

    expect(errors.some((error) => error.property === 'targetAmount')).toBe(
      true,
    );

    expect(errors.some((error) => error.property === 'type')).toBe(true);
  });

  it('deve aceitar um tipo válido', async () => {
    const errors = await validateDto({
      type: GoalTypeDto.EXPENSE_LIMIT,
    });

    expect(errors).toHaveLength(0);
  });
});
