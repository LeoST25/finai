import { CalendarDays, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type DashboardHeaderProps = {
  user: {
    name: string;
    avatar?: string;
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
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4" />
            <span className="capitalize">{getFormattedDate()}</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getGreeting()}, {user.name} 👋
            </h1>

            <p className="mt-1 text-slate-500">
              Seu assistente financeiro está pronto para analisar seus dados.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium">FinAI</p>
            <p className="text-xs text-slate-500">
              Assistente financeiro inteligente
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
            {getInitials(user.name)}
          </div>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo lançamento
          </Button>
        </div>
      </div>
    </section>
  );
}