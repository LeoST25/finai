import { Filter, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ExpenseFilterType = "all" | "income" | "expense";

type ExpensesFiltersProps = {
  search: string;
  type: ExpenseFilterType;
  category: string;
  categories: string[];
  total: number;
  filteredTotal: number;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: ExpenseFilterType) => void;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
};

export function ExpensesFilters({
  search,
  type,
  category,
  categories,
  total,
  filteredTotal,
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onClearFilters,
}: ExpensesFiltersProps) {
  const hasActiveFilters =
    search.trim().length > 0 || type !== "all" || category !== "all";

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
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
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
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

          <select
            className="h-10 rounded-md border bg-slate-50 px-3 text-sm text-slate-400"
            disabled
          >
            <option>Período em breve</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}