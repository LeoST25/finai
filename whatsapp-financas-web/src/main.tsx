import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "src/components/ui/sonner";

import App from "./App";
import { QueryProvider } from "./app/providers/query-provider";

import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <App />
      <Toaster richColors position="top-right" />
    </QueryProvider>
  </StrictMode>,
);