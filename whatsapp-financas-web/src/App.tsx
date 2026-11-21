import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { PageLoader } from "@/components/common/PageLoader";

const Dashboard = lazy(() =>
  import("@/pages/Dashboard").then((module) => ({
    default: module.Dashboard,
  })),
);

const Expenses = lazy(() =>
  import("@/pages/Expenses").then((module) => ({
    default: module.Expenses,
  })),
);

const Reports = lazy(() =>
  import("@/pages/Reports").then((module) => ({
    default: module.Reports,
  })),
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;