import { CalendarDays } from "lucide-react";

import { CreateExpenseDialog } from "@/features/expenses/components/create-expense-dialog";

type DashboardHeaderProps = {
  user: {
    name: string;
    avatarUrl?: string;
  };
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";

  return "Boa noite";
}

function getFormattedDate() {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-white shadow-sm sm:rounded-3xl sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 sm:text-sm">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="truncate capitalize">{getFormattedDate()}</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {getGreeting()}, {user.name} 👋
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Seu assistente financeiro está pronto para analisar receitas,
              despesas e oportunidades de economia.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950 sm:h-12 sm:w-12">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                getInitials(user.name)
              )}
            </div>

            <div className="block sm:hidden lg:block">
              <p className="text-sm font-medium">FinAI</p>
              <p className="text-xs text-slate-300">
                Assistente financeiro inteligente
              </p>
            </div>
          </div>

          <CreateExpenseDialog triggerVariant="secondary" />
        </div>
      </div>
    </section>
  );
}