import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import englishCatalog from "../../i18n/fork/en.json";

function source(relativePath: string) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function expectLocalizedText(fileSource: string, text: string) {
  const key = Object.entries(englishCatalog).find(([, value]) => value === text)?.[0];
  expect(key, `Missing English catalog entry for: ${text}`).toBeDefined();
  expect(fileSource).toContain(`tf("${key}")`);
}

describe("Apps agent selector contract", () => {
  it("keeps every agent chooser under /apps searchable", () => {
    const appConnect = source("./AppsConnect.tsx");
    const connectionSetupFlow = source("../../features/connections/ConnectionSetupFlow.tsx");
    const permissions = source("./app-detail/PermissionsPanel.tsx");
    const tester = source("./app-detail/TestPanel.tsx");
    const profiles = source("../tools/ProfilesTab.tsx");
    const audit = source("../tools/AuditTab.tsx");

    expect(appConnect).toContain("<ConnectionSetupFlow");
    expect(connectionSetupFlow).toContain("<AgentMultiSelect");
    expect(permissions).toContain("<AgentMultiSelect");
    expectLocalizedText(tester, "Search agents…");

    expect(profiles.match(/<AgentSelect/g)).toHaveLength(2);
    expect(profiles).not.toContain("<Select value={agentId}");
    expect(profiles).not.toContain("<Select value={targetAgentId}");

    expect(audit).toContain("<AgentSelect");
    expect(audit).not.toContain("<Select value={agent}");
  });
});
