import { CalendarDays, Filter, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type {
  ExpenseFilterType,
  ExpensePeriodFilter,
} from "@/features/expenses/utils/expense-filters";

type ExpensesFiltersProps = {
  search: string;
  type: ExpenseFilterType;
  category: string;
  period: ExpensePeriodFilter;
  categories: string[];
  total: number;
  filteredTotal: number;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: ExpenseFilterType) => void;
  onCategoryChange: (value: string) => void;
  onPeriodChange: (value: ExpensePeriodFilter) => void;
  onClearFilters: () => void;
};

export function ExpensesFilters({
  search,
  type,
  category,
  period,
  categories,
  total,
  filteredTotal,
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onPeriodChange,
  onClearFilters,
}: ExpensesFiltersProps) {
  const hasActiveFilters =
    search.trim().length > 0 ||
    type !== "all" ||
    category !== "all" ||
    period !== "all";

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-col gap-3 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>

          <p className="mt-1 text-sm text-slate-500">
            {hasActiveFilters
              ? `${filteredTotal} de ${total} lançamentos encontrados`
              : `${total} lançamentos cadastrados`}
          </p>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Input
            placeholder="Buscar por descrição ou categoria"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />

          <select
            className="h-10 rounded-md border bg-background px-3 text-sm"
            value={type}
            onChange={(event) =>
              onTypeChange(event.target.value as ExpenseFilterType)
            }
          >
            <option value="all">Todos os tipos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>

          <select
            className="h-10 rounded-md border bg-background px-3 text-sm"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="all">Todas as categorias</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm"
              value={period}
              onChange={(event) =>
                onPeriodChange(event.target.value as ExpensePeriodFilter)
              }
            >
              <option value="all">Todos os períodos</option>
              <option value="today">Hoje</option>
              <option value="last7days">Últimos 7 dias</option>
              <option value="last30days">Últimos 30 dias</option>
              <option value="currentMonth">Mês atual</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}