import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExpenseDto) {
    return this.prisma.prisma.expense.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.prisma.expense.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const expense = await this.prisma.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async update(id: string, dto: Partial<CreateExpenseDto>) {
    await this.findOne(id);

    return this.prisma.prisma.expense.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.prisma.expense.delete({
      where: { id },
    });
  }
}