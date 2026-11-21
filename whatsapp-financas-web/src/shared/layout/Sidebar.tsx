import { BarChart3, LayoutDashboard, ReceiptText, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

const navigation = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Lançamentos",
    href: "/expenses",
    icon: ReceiptText,
  },
  {
    label: "Relatórios",
    href: "/reports",
    icon: BarChart3,
  },
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r bg-white p-5 md:flex md:flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <Wallet className="h-5 w-5" />
        </div>

        <div>
          <p className="text-lg font-bold tracking-tight">FinAI</p>
          <p className="text-xs text-slate-500">Controle financeiro</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
                isActive && "bg-slate-950 text-white hover:bg-slate-950 hover:text-white",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">
          FinAI Assistant
        </p>

        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Registre, acompanhe e analise suas finanças em um só lugar.
        </p>
      </div>
    </aside>
  );
}