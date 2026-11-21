import { Download } from "lucide-react";
import { toast } from "sonner";

import type { Expense } from "@/features/expenses/types/expense";
import { Button } from "@/components/ui/button";
import { exportExpensesCsv } from "@/features/expenses/utils/export-expenses-csv";

type ExpensesExportButtonProps = {
  expenses: Expense[];
  disabled?: boolean;
};

export function ExpensesExportButton({
  expenses,
  disabled = false,
}: ExpensesExportButtonProps) {
  function handleExport() {
    if (expenses.length === 0) {
      toast.info("Nenhum lançamento disponível para exportar.");
      return;
    }

    exportExpensesCsv(expenses);
    toast.success("Arquivo CSV exportado com sucesso.");
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleExport}
      disabled={disabled}
    >
      <Download className="mr-2 h-4 w-4" />
      Exportar CSV
    </Button>
  );
}