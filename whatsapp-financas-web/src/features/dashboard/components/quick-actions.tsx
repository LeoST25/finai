import { useState } from "react";
import { Bot, FileText, PlusCircle, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateExpenseForm } from "@/features/expenses/components/create-expense-form";
import { DashboardWidget } from "@/shared/ui/components/dashboard-widget";

type ExpenseType = "income" | "expense";

type ActionContentProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
};

const actionClassName =
  "flex h-full w-full items-center justify-start gap-3 rounded-md border p-4 text-left text-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60";

function ActionContent({
  title,
  description,
  icon: Icon,
  badge,
}: ActionContentProps) {
  return (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <Icon className="h-5 w-5" />
      </span>

      <span className="flex flex-1 flex-col">
        <span className="flex items-center gap-2 font-medium">
          {title}

          {badge && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              {badge}
            </span>
          )}
        </span>

        <span className="text-xs font-normal text-slate-500">
          {description}
        </span>
      </span>
    </>
  );
}

export function QuickActions() {
  const [expenseType, setExpenseType] = useState<ExpenseType | null>(null);

  const isDialogOpen = expenseType !== null;

  function handleOpenChange(open: boolean) {
    if (!open) {
      setExpenseType(null);
    }
  }

  return (
    <>
      <DashboardWidget
        title="Ações rápidas"
        description="Acesse rapidamente as principais funcionalidades."
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            className={actionClassName}
            onClick={() => setExpenseType("expense")}
          >
            <ActionContent
              title="Nova despesa"
              description="Registre uma saída manualmente"
              icon={PlusCircle}
            />
          </button>

          <button
            type="button"
            className={actionClassName}
            onClick={() => setExpenseType("income")}
          >
            <ActionContent
              title="Nova receita"
              description="Adicione uma entrada financeira"
              icon={TrendingUp}
            />
          </button>

          <Link to="/reports" className={actionClassName}>
            <ActionContent
              title="Relatórios"
              description="Analise tendências e categorias"
              icon={FileText}
            />
          </Link>

          <button type="button" className={actionClassName} disabled>
            <ActionContent
              title="WhatsApp Bot"
              description="Registre gastos por conversa"
              icon={Bot}
              badge="Em breve"
            />
          </button>
        </div>
      </DashboardWidget>

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {expenseType === "income" ? "Nova receita" : "Nova despesa"}
            </DialogTitle>
          </DialogHeader>

          {expenseType && (
            <CreateExpenseForm
              defaultType={expenseType}
              onSuccess={() => setExpenseType(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}