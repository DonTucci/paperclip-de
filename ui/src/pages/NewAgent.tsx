import { tf } from "@/i18n/fork";
import { useEffect } from "react";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { NewAgentSetup } from "../components/new-agent/NewAgentSetup";

export function NewAgent() {
  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([
      { label: tf("text.Agents"), href: "/agents" },
      { label: tf("auto.98a23e6db3431d16") },
    ]);
  }, [setBreadcrumbs]);
  return <NewAgentSetup />;
}
