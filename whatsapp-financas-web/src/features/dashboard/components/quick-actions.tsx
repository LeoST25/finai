import { Bot, FileText, PlusCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

import { DashboardWidget } from "@/shared/ui/components/dashboard-widget";

const actions = [
  {
    title: "Nova despesa",
    description: "Registre uma saída manualmente",
    icon: PlusCircle,
    href: "/expenses",
  },
  {
    title: "Nova receita",
    description: "Adicione uma entrada financeira",
    icon: TrendingUp,
    href: "/expenses",
  },
  {
    title: "Relatórios",
    description: "Analise tendências e categorias",
    icon: FileText,
    href: "/reports",
  },
  {
    title: "WhatsApp Bot",
    description: "Registre gastos por conversa",
    icon: Bot,
    href: "/expenses",
  },
];

export function QuickActions() {
  return (
    <DashboardWidget
      title="Ações rápidas"
      description="Acesse rapidamente as principais funcionalidades."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className="flex h-auto items-center justify-start gap-3 rounded-md border p-4 text-left text-sm transition hover:bg-slate-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <action.icon className="h-5 w-5" />
            </div>

            <div>
              <p className="font-medium">{action.title}</p>
              <p className="text-xs font-normal text-slate-500">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </DashboardWidget>
  );
}