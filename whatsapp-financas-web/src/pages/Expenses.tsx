import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/shared/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "src/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteExpense } from "@/features/expenses/hooks/use-delete-expense";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import {
  filterExpenses,
  getExpenseCategories,
} from "@/features/expenses/utils/expense-filters";
import { EditExpenseDialog } from "@/features/expenses/components/edit-expense-dialog";

export function Expenses() {
  const { data = [], isLoading, error } = useExpenses();
  const deleteExpense = useDeleteExpense();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => getExpenseCategories(data), [data]);

  const filteredExpenses = useMemo(
    () =>
      filterExpenses(data, {
        search,
        type,
        category,
      }),
    [data, search, type, category],
  );

  function handleDelete(id: string) {
    deleteExpense.mutate(id, {
      onSuccess: () => {
        toast.success("Lançamento excluído com sucesso.");
      },
      onError: () => {
        toast.error("Não foi possível excluir o lançamento.");
      },
    });
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Lançamentos</h2>
          <p className="text-slate-500">
            Consulte, filtre e acompanhe suas receitas e despesas.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                placeholder="Buscar por descrição ou categoria"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <select
                className="h-10 rounded-md border bg-background px-3 text-sm"
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <option value="all">Todos os tipos</option>
                <option value="income">Receitas</option>
                <option value="expense">Despesas</option>
              </select>

              <select
                className="h-10 rounded-md border bg-background px-3 text-sm"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="all">Todas as categorias</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Transações encontradas: {filteredExpenses.length}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading && <p>Carregando lançamentos...</p>}

            {error && <p>Erro ao carregar lançamentos.</p>}

            {!isLoading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {expense.description}
                      </TableCell>

                      <TableCell>{expense.category}</TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            expense.type === "income" ? "default" : "outline"
                          }
                        >
                          {expense.type === "income" ? "Receita" : "Despesa"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {new Date(expense.createdAt).toLocaleDateString(
                          "pt-BR",
                        )}
                      </TableCell>

                      <TableCell
                        className={
                          expense.type === "income"
                            ? "text-right font-semibold text-emerald-600"
                            : "text-right font-semibold text-red-600"
                        }
                      >
                        {expense.type === "income" ? "+" : "-"} R${" "}
                        {expense.value.toFixed(2)}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <EditExpenseDialog expense={expense} />

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={deleteExpense.isPending}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Excluir lançamento?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Essa ação não poderá ser desfeita. O
                                  lançamento será removido permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(expense.id)}
                                >
                                  Confirmar exclusão
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredExpenses.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-8 text-center text-slate-500"
                      >
                        Nenhum lançamento encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}