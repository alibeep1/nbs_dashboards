import { createRoot } from "react-dom/client";
import "./index.css";
import CustomerAnalyticsDashboard from "./App.tsx";
import SalesDashboard from "./RetailSalesAnalytics.tsx";
import CorpSalesDashboard from "./CorpSalesDashboard.tsx";
import ItemsCatalogueDashboard from "./ItemsCatalogueDashboard.tsx";
import ScmInventoryDashboard from "./ScmInventoryDashboard.tsx";
import ScmInterbranchDashboard from "./ScmInterbranchDashboard.tsx";
import ScmOrderManagementDashboard from "./ScmOrderManagementDashboard.tsx";
import HrDashboard from "./HrDashboard.tsx";

const dashboards = {
  corp: CorpSalesDashboard,
  hr: HrDashboard,
  items: ItemsCatalogueDashboard,
  pin: CustomerAnalyticsDashboard,
  pos: SalesDashboard,
  scm_IM: ScmInventoryDashboard,
  scm_IO: ScmOrderManagementDashboard,
  scm_MB: ScmInterbranchDashboard,
} as const;

const dashboardTarget =
  (import.meta.env.VITE_DASHBOARD_TARGET as keyof typeof dashboards) ||
  "scm_MB";
const Dashboard = dashboards[dashboardTarget];

createRoot(document.getElementById("root")!).render(
  Dashboard ? (
    <Dashboard />
  ) : (
    <div className="p-4 text-red-500">
      Unknown dashboard target: {dashboardTarget}
    </div>
  ),
);
