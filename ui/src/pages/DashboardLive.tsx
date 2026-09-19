import { tf } from "@/i18n/fork";
import { useEffect } from "react";
import { ArrowLeft, RadioTower } from "lucide-react";
import { Link } from "@/lib/router";
import { ActiveAgentsPanel } from "../components/ActiveAgentsPanel";
import { EmptyState } from "../components/EmptyState";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { useCompany } from "../context/CompanyContext";

const DASHBOARD_LIVE_RUN_LIMIT = 50;

export function DashboardLive() {
  const { selectedCompanyId, companies } = useCompany();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: tf("text.Dashboard"), href: "/dashboard" },
      { label: tf("auto.905f1fefa6932455") },
    ]);
  }, [setBreadcrumbs]);

  if (!selectedCompanyId) {
    return (
      <EmptyState
        icon={RadioTower}
        message={companies.length === 0 ? tf("auto.dfd72377cca37638") : tf("auto.1a5b4c52d3d07fc7")}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {tf("text.Dashboard")}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal text-foreground">{tf("auto.6663a17b699c35a5")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tf("auto.e4351c0f7022fd92")}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">Showing up to {DASHBOARD_LIVE_RUN_LIMIT}</div>
      </div>

      <ActiveAgentsPanel
        companyId={selectedCompanyId}
        title={tf("auto.29047d81c75e0353")}
        minRunCount={DASHBOARD_LIVE_RUN_LIMIT}
        fetchLimit={DASHBOARD_LIVE_RUN_LIMIT}
        cardLimit={DASHBOARD_LIVE_RUN_LIMIT}
        emptyMessage={tf("auto.ae4f00afad4e95ae")}
        queryScope="dashboard-live"
        showMoreLink={false}
      />
    </div>
  );
}
