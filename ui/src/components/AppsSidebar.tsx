import { tf } from "@/i18n/fork";
import { Store, ShieldQuestion } from "lucide-react";
import { DEVELOPER_TABS, advancedTabHref, isExperimentalToolTab } from "@/pages/tools/tool-tabs";
import { useSmokeLabEnabled } from "@/hooks/useSmokeLabEnabled";
import { useReviewCount } from "@/pages/apps/useReviewCount";
import { SidebarNavItem } from "./SidebarNavItem";
import { contextualSidebarStyles } from "./contextual-sidebar-styles";

/**
 * Secondary sidebar for the Apps area.
 *
 * Connectors combines discovery, account management, and connection health.
 * Review keeps governed actions waiting on the user's approval. Advanced
 * developer surfaces remain hidden unless one is explicitly enabled.
 */
export function AppsSidebar() {
  const reviewCount = useReviewCount();
  const { enabled: smokeLabEnabled } = useSmokeLabEnabled();
  const developerTabs = DEVELOPER_TABS.filter((tab) => {
    // Temporarily hide Gateways and Profiles until they are ready to ship.
    // Keep their tab definitions and routes intact so we can bring them back later.
    if (tab.key === "gateways" || tab.key === "profiles") return false;
    return !isExperimentalToolTab(tab.key) || smokeLabEnabled;
  });

  return (
    <aside className="w-full h-full min-h-0 border-r border-border bg-background flex flex-col">
      <nav
        aria-label={tf("text.Connectors")}
        data-slot="contextual-sidebar-nav"
        className={contextualSidebarStyles.nav}
      >
        <div data-slot="contextual-sidebar-group" className={contextualSidebarStyles.group}>
          <SidebarNavItem to="/apps" label={tf("auto.3227aa9666253f7a")} icon={Store} end />
          <SidebarNavItem
            to="/apps/review"
            label={tf("auto.aff0766a5290e117")}
            icon={ShieldQuestion}
            badge={reviewCount > 0 ? reviewCount : undefined}
            badgeTone="warning"
            badgeLabel={tf("auto.ee8bba46e5333c77")}
          />
        </div>
        {developerTabs.length > 0 ? (
          <div data-slot="contextual-sidebar-section" className={contextualSidebarStyles.section}>
            <div
              data-slot="contextual-sidebar-section-label"
              className={contextualSidebarStyles.sectionLabel}
            >
              {tf("auto.3fb7b39416f1d067")}
            </div>
            <p
              data-slot="contextual-sidebar-section-description"
              className={contextualSidebarStyles.sectionDescription}
            >
              {tf("auto.7ee7c5aabbc1b220")}
            </p>
            <div data-slot="contextual-sidebar-group" className={contextualSidebarStyles.group}>
              {developerTabs.map((tab) => (
                <SidebarNavItem
                  key={tab.key}
                  to={advancedTabHref(tab.key)}
                  label={tab.label}
                  icon={tab.icon}
                  end
                />
              ))}
            </div>
          </div>
        ) : null}
      </nav>
    </aside>
  );
}
