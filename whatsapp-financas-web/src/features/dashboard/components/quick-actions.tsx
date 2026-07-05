import { Bot, FileText, PlusCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle>Ações rápidas</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto justify-start gap-3 p-4 text-left"
              asChild
            >
              <Link to={action.href}>
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
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}