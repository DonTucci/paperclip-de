import { tf } from "@/i18n/fork";
import { auditSectionHref, type AuditSection } from "./audit/audit-navigation";

export type AgentDetailView =
  | "overview"
  | "instructions"
  | "skills"
  | "runtime"
  | "secrets"
  | "tools"
  | "channels"
  | "permissions"
  | "api-keys"
  | "revisions"
  | "run-detail";

export type AgentLocalDetailView = Exclude<AgentDetailView, "run-detail">;

export const AGENT_DETAIL_NAVIGATION: ReadonlyArray<{
  label: string;
  items: ReadonlyArray<{ value: AgentLocalDetailView; label: string }>;
}> = [
  {
    label: tf("text.Agent"),
    items: [
      { value: "overview", label: tf("text.Overview") },
      { value: "instructions", label: tf("text.Instructions") },
      { value: "skills", label: tf("text.Skills") },
    ],
  },
  {
    label: tf("auto.1093115897879aa3"),
    items: [
      { value: "runtime", label: tf("auto.6711e546a022dbe7") },
      { value: "secrets", label: tf("text.Secrets") },
      { value: "tools", label: tf("text.Tools") },
      { value: "channels", label: tf("auto.4c8906cf76f5740a") },
    ],
  },
  {
    label: tf("auto.86f8a694159b712f"),
    items: [
      { value: "permissions", label: tf("auto.183c6ae80610fdda") },
      { value: "api-keys", label: tf("auto.c08f17eb9e11a353") },
      { value: "revisions", label: tf("auto.da80b1d5740caaef") },
    ],
  },
] as const;

export function parseAgentDetailView(value: string | null): AgentLocalDetailView {
  if (value === "instructions" || value === "prompts") return "instructions";
  if (value === "skills") return "skills";
  if (value === "runtime" || value === "configure" || value === "configuration") return "runtime";
  if (value === "secrets") return "secrets";
  if (value === "tools") return "tools";
  if (value === "channels") return "channels";
  if (value === "permissions" || value === "trust") return "permissions";
  if (value === "api-keys" || value === "keys") return "api-keys";
  if (value === "revisions" || value === "history") return "revisions";
  return "overview";
}

export function agentDetailHref(agentRef: string, view: AgentLocalDetailView = "overview") {
  return `/agents/${agentRef}/${view}`;
}

export function agentLegacyAuditSection(value: string | null): AuditSection | null {
  if (value === "runs") return "runs";
  if (value === "audit" || value === "activity") return "activity";
  if (value === "cost" || value === "costs") return "costs";
  if (value === "budget" || value === "budgets") return "budgets";
  return null;
}

export function agentScopedAuditHref(agentId: string, section: AuditSection) {
  return auditSectionHref(section, {
    mode: section === "activity" ? "agents" : undefined,
    agentId,
  });
}
