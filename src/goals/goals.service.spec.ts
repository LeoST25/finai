import { NotFoundException } from '@nestjs/common';
import { GoalType } from '@prisma/client';
import { Test, type TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { GoalsService } from './goals.service';

describe('GoalsService', () => {
  let service: GoalsService;

  const prismaServiceMock = {
    financialGoal: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const prismaGoal = {
    id: 'goal-1',
    title: 'Reserva de emergência',
    description: 'Guardar dinheiro para imprevistos',
    category: 'Investimentos',
    type: GoalType.SAVINGS,
    targetAmount: 5000,
    currentAmount: 1250,
    deadline: new Date('2026-12-31T00:00:00.000Z'),
    createdAt: new Date('2026-07-11T00:00:00.000Z'),
    updatedAt: new Date('2026-07-11T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalsService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<GoalsService>(GoalsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a goal', async () => {
    prismaServiceMock.financialGoal.create.mockResolvedValue(prismaGoal);

    const result = await service.create({
      title: 'Reserva de emergência',
      description: 'Guardar dinheiro para imprevistos',
      category: 'Investimentos',
      type: 'savings',
      targetAmount: 5000,
      currentAmount: 1250,
      deadline: '2026-12-31',
    });

    expect(result.type).toBe('savings');
    expect(result.targetAmount).toBe(5000);
    expect(prismaServiceMock.financialGoal.create).toHaveBeenCalled();
  });

  it('should list goals', async () => {
    prismaServiceMock.financialGoal.findMany.mockResolvedValue([prismaGoal]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0]?.currentAmount).toBe(1250);
  });

  it('should return a goal by id', async () => {
    prismaServiceMock.financialGoal.findUnique.mockResolvedValue(prismaGoal);

    const result = await service.findOne('goal-1');

    expect(result.id).toBe('goal-1');
  });

  it('should throw when a goal is not found', async () => {
    prismaServiceMock.financialGoal.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should update a goal', async () => {
    prismaServiceMock.financialGoal.findUnique.mockResolvedValue({
      id: 'goal-1',
    });
    prismaServiceMock.financialGoal.update.mockResolvedValue({
      ...prismaGoal,
      currentAmount: 2000,
    });

    const result = await service.update('goal-1', {
      currentAmount: 2000,
    });

    expect(result.currentAmount).toBe(2000);
  });

  it('should remove a goal', async () => {
    prismaServiceMock.financialGoal.findUnique.mockResolvedValue({
      id: 'goal-1',
    });
    prismaServiceMock.financialGoal.delete.mockResolvedValue(prismaGoal);

    const result = await service.remove('goal-1');

    expect(result.id).toBe('goal-1');
  });
});
