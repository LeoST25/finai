import { NavLink } from "react-router-dom";
import {
  ChartColumn,
  LayoutDashboard,
  Settings,
  Wallet,
} from "lucide-react";

const items = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Wallet,
    label: "Despesas",
    href: "/expenses",
  },
  {
    icon: ChartColumn,
    label: "Relatórios",
    href: "/reports",
  },
  {
    icon: Settings,
    label: "Configurações",
    href: "/settings",
  },
];

export function Sidebar() {
  return (
    <aside className="w-72 border-r bg-white">
      <div className="p-6">
        <h2 className="text-xl font-bold">💰 FinAI</h2>
        <p className="text-sm text-slate-500">
          Assistente financeiro inteligente
        </p>
      </div>

      <nav className="space-y-2 px-4">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-lg p-3 text-sm transition hover:bg-slate-100 ${
                isActive ? "bg-slate-100 font-semibold" : "text-slate-600"
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}