import { CalendarDays, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

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

export function DashboardHeader() {
  return (
    <section className="flex flex-col gap-6 rounded-2xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <CalendarDays className="h-4 w-4" />
          <span className="capitalize">{getFormattedDate()}</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, Leonardo 👋
          </h1>

          <p className="mt-1 text-slate-500">
            Aqui está o resumo inteligente das suas finanças.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right md:block">
          <p className="text-sm font-medium">FinAI</p>
          <p className="text-xs text-slate-500">
            Assistente financeiro
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
          LM
        </div>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo lançamento
        </Button>
      </div>
    </section>
  );
}