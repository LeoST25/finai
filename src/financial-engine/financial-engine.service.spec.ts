import { Test, type TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { FinancialEngineService } from './financial-engine.service';

describe('FinancialEngineService', () => {
  let service: FinancialEngineService;
  let prisma: jest.Mocked<PrismaService>;

  function createDecimal(value: number) {
    return {
      toNumber: () => value,
      toString: () => String(value),
      valueOf: () => value,
    };
  }

  const mockExpenses = [
    {
      id: '1',
      description: 'Salário',
      category: 'Receita',
      value: createDecimal(3000),
      type: 'income',
      createdAt: new Date('2026-07-01T10:00:00.000Z'),
    },
    {
      id: '2',
      description: 'Mercado',
      category: 'Alimentação',
      value: createDecimal(200),
      type: 'expense',
      createdAt: new Date('2026-07-05T10:00:00.000Z'),
    },
    {
      id: '3',
      description: 'Uber',
      category: 'Transporte',
      value: createDecimal(50),
      type: 'expense',
      createdAt: new Date('2026-07-10T10:00:00.000Z'),
    },
  ];

  const mockGoals = [
    {
      id: 'goal-1',
      title: 'Reserva de emergência',
      description: 'Guardar dinheiro',
      category: 'Pessoal',
      type: 'SAVINGS',
      targetAmount: createDecimal(1000),
      currentAmount: createDecimal(300),
      deadline: new Date('2026-12-31'),
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 'goal-2',
      title: 'Limite de alimentação',
      description: 'Controle',
      category: 'Alimentação',
      type: 'EXPENSE_LIMIT',
      targetAmount: createDecimal(500),
      currentAmount: createDecimal(200),
      deadline: new Date('2026-07-31'),
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ];

  beforeEach(async () => {
    const prismaMock = {
      expense: {
        findMany: jest.fn().mockResolvedValue(mockExpenses),
      },
      financialGoal: {
        findMany: jest.fn().mockResolvedValue(mockGoals),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialEngineService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<FinancialEngineService>(FinancialEngineService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('centralizes balance, cash flow, goals and limits in one snapshot', async () => {
    const snapshot = await service.buildSnapshot();

    expect(snapshot.balance).toBe(2750);
    expect(snapshot.totalIncome).toBe(3000);
    expect(snapshot.totalExpenses).toBe(250);
    expect(snapshot.savingsGoals).toHaveLength(1);
    expect(snapshot.savingsGoals[0].title).toBe('Reserva de emergência');
    expect(snapshot.savingsGoals[0].progress).toBe(30);
    expect(snapshot.limits).toHaveLength(1);
    expect(snapshot.limits[0].title).toBe('Limite de alimentação');
    expect(snapshot.patrimony).toBe(3050);
    expect(snapshot.cashFlow.projectedExpenses).toBeGreaterThan(0);
    expect(snapshot.topCategory?.name).toBe('Alimentação');
    expect(snapshot.topCategory?.total).toBe(200);
  });

  it('returns empty arrays when there are no goals', async () => {
    prisma.financialGoal.findMany.mockResolvedValue([]);

    const snapshot = await service.buildSnapshot();

    expect(snapshot.savingsGoals).toHaveLength(0);
    expect(snapshot.limits).toHaveLength(0);
    expect(snapshot.patrimony).toBe(2750);
  });

  it('handles empty expenses gracefully', async () => {
    prisma.expense.findMany.mockResolvedValue([]);

    const snapshot = await service.buildSnapshot();

    expect(snapshot.balance).toBe(0);
    expect(snapshot.totalIncome).toBe(0);
    expect(snapshot.totalExpenses).toBe(0);
    expect(snapshot.savingsRate).toBe(0);
    expect(snapshot.topCategory).toBeUndefined();
  });

  it('computes savings rate correctly', async () => {
    const snapshot = await service.buildSnapshot();

    const expectedRate = (2750 / 3000) * 100;
    expect(snapshot.savingsRate).toBeCloseTo(expectedRate, 1);
  });
});