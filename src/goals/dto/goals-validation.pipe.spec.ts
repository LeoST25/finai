import { BadRequestException, ValidationPipe } from '@nestjs/common';

import { CreateGoalDto } from './create-goal.dto';

describe('Goals ValidationPipe', () => {
  const pipe = new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });

  const metadata = {
    type: 'body' as const,
    metatype: CreateGoalDto,
    data: undefined,
  };

  it('deve transformar dados válidos', async () => {
    const transformed: unknown = await pipe.transform(
      {
        title: 'Reserva',
        category: 'Economia',
        type: 'savings',
        targetAmount: 5000,
      },
      metadata,
    );

    expect(transformed).toBeInstanceOf(CreateGoalDto);

    if (!(transformed instanceof CreateGoalDto)) {
      throw new Error('O resultado não foi transformado em CreateGoalDto.');
    }

    expect(transformed.targetAmount).toBe(5000);
  });

  it('deve lançar BadRequest para dados inválidos', async () => {
    await expect(
      pipe.transform(
        {
          title: '',
          category: 'Economia',
          type: 'tipo-invalido',
          targetAmount: -100,
        },
        metadata,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('deve rejeitar propriedades não permitidas', async () => {
    await expect(
      pipe.transform(
        {
          title: 'Reserva',
          category: 'Economia',
          type: 'savings',
          targetAmount: 5000,
          admin: true,
        },
        metadata,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
