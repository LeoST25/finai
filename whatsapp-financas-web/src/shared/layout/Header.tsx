export function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8">
      <div>
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="text-sm text-slate-500">
          Bem-vindo ao seu painel financeiro.
        </p>
      </div>

      <div className="font-semibold">
        Leonardo
      </div>
    </header>
  );
}