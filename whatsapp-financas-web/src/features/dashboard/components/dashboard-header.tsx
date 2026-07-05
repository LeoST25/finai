import { CalendarDays, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

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
    <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-sm">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">
            <CalendarDays className="h-4 w-4" />
            <span className="capitalize">{getFormattedDate()}</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {getGreeting()}, {user.name} 👋
            </h1>

            <p className="mt-2 max-w-2xl text-slate-300">
              Seu assistente financeiro está pronto para analisar receitas,
              despesas e oportunidades de economia.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium">FinAI</p>
            <p className="text-xs text-slate-300">
              Assistente financeiro inteligente
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
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

          <Button variant="secondary">
            <Plus className="mr-2 h-4 w-4" />
            Novo lançamento
          </Button>
        </div>
      </div>
    </section>
  );
}