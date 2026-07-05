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

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/90 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Wallet className="h-5 w-5" />
          </div>

          <div>
            <p className="font-bold tracking-tight">FinAI</p>
            <p className="text-xs text-slate-500">Controle financeiro</p>
          </div>
        </div>

        <div className="hidden md:block">
          <p className="text-sm font-medium text-slate-500">
            Bem-vindo de volta
          </p>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Painel financeiro
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
          LM
        </div>
      </div>

      <nav className="mt-4 grid grid-cols-3 gap-2 md:hidden">
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50",
                isActive && "border-slate-950 bg-slate-950 text-white hover:bg-slate-950",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}