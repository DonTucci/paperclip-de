import { tf } from "@/i18n/fork";
import { configFieldsForSection } from "../config-sections";
import type { AdapterConfigFieldsProps } from "../types";
import {
  DraftNumberInput,
  DraftInput,
  Field,
} from "../../components/agent-config-primitives";
import { ChoosePathButton } from "../../components/PathInstructionsModal";

const inputClass =
  "w-full rounded-md border border-border px-2.5 py-1.5 bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/40";
const instructionsFileHint =
  "Absolute path to a markdown file (e.g. AGENTS.md) that defines this agent's behavior. Prepended to the Gemini prompt at runtime.";

export function GeminiLocalConfigFields({
  section,
  isCreate,
  values,
  set,
  config,
  eff,
  mark,
  hideInstructionsFile,
  managedSandboxOnly,
}: AdapterConfigFieldsProps) {
  const rawEngine = isCreate
    ? values!.geminiEngine ?? "auto"
    : eff("adapterConfig", "engine", String(config.engine ?? "auto"));
  const engine = rawEngine === "acp" || rawEngine === "cli" ? rawEngine : "auto";
  const acpSelected = engine === "acp";

  return configFieldsForSection(section, (
    <>
      {/*
        The execution engine picks which binary runs on the execution host, and
        the ACP sub-fields below name host paths. The platform-managed
        environment owns both, so the managed-sandbox-only policy hides them.
      */}
      {!managedSandboxOnly && <Field label={tf("auto.da96ed44c9414cb4")} hint="Default uses ACP. If ACP is unavailable, the run fails with a setup error. Choose CLI explicitly to use it.">
        <select
          className={inputClass}
          value={engine}
          onChange={(e) => {
            const value = e.target.value === "acp" ? "acp" : e.target.value === "cli" ? "cli" : "auto";
            isCreate
              ? set!({ geminiEngine: value })
              : mark("adapterConfig", "engine", value === "auto" ? undefined : value);
          }}
        >
          <option value="auto">{tf("auto.db3da2a98fda28e7")}</option>
          <option value="cli">{tf("auto.731732835cd76be6")}</option>
          <option value="acp">{tf("auto.75ad69d7586c3d7e")}</option>
        </select>
      </Field>}
      {acpSelected && (
        <>
          {!managedSandboxOnly && (
            <Field configSection="advanced"
              label={tf("auto.3a0d4f5f95706435")}
              hint="Optional override for the Gemini ACP server command. Defaults to gemini --acp."
            >
              <DraftInput
                value={
                  isCreate
                    ? values!.geminiAcpAgentCommand ?? ""
                    : eff("adapterConfig", "agentCommand", String(config.agentCommand ?? ""))
                }
                onCommit={(v) =>
                  isCreate
                    ? set!({ geminiAcpAgentCommand: v })
                    : mark("adapterConfig", "agentCommand", v || undefined)
                }
                immediate
                className={inputClass}
                placeholder={tf("auto.9b034d4e7fd5c24a")}
              />
            </Field>
          )}
          <Field configSection="runPolicy" label={tf("auto.6b7415b4b77c69fc")} hint="Persistent keeps ACP session state between runs. One-shot starts fresh each run.">
            <select
              className={inputClass}
              value={
                isCreate
                  ? values!.geminiAcpMode ?? "persistent"
                  : eff("adapterConfig", "mode", String(config.mode ?? "persistent"))
              }
              onChange={(e) => {
                const value = e.target.value === "oneshot" ? "oneshot" : "persistent";
                isCreate
                  ? set!({ geminiAcpMode: value })
                  : mark("adapterConfig", "mode", value);
              }}
            >
              <option value="persistent">{tf("auto.f067b731a9eb7fda")}</option>
              <option value="oneshot">{tf("auto.4c6e65c60f5bd2e3")}</option>
            </select>
          </Field>
          <Field
            label={tf("auto.775568b9ccf2a097")}
            hint="Fallback if the ACP agent asks for input outside an interactive session."
          >
            <select
              className={inputClass}
              value={
                isCreate
                  ? values!.geminiAcpNonInteractivePermissions ?? "deny"
                  : eff("adapterConfig", "nonInteractivePermissions", String(config.nonInteractivePermissions ?? "deny"))
              }
              onChange={(e) => {
                const value = e.target.value === "fail" ? "fail" : "deny";
                isCreate
                  ? set!({ geminiAcpNonInteractivePermissions: value })
                  : mark("adapterConfig", "nonInteractivePermissions", value);
              }}
            >
              <option value="deny">{tf("auto.05a2d7332eb9d8bf")}</option>
              <option value="fail">{tf("auto.09230b3dbc35635f")}</option>
            </select>
          </Field>
          {!managedSandboxOnly && (
            <Field
              label={tf("auto.519b9622e450f632")}
              hint="Optional ACP session state directory. Defaults to Paperclip-managed organization/agent scoped storage."
            >
              <div className="flex items-center gap-2">
                <DraftInput
                  value={
                    isCreate
                      ? values!.geminiAcpStateDir ?? ""
                      : eff("adapterConfig", "stateDir", String(config.stateDir ?? ""))
                  }
                  onCommit={(v) =>
                    isCreate
                      ? set!({ geminiAcpStateDir: v })
                      : mark("adapterConfig", "stateDir", v || undefined)
                  }
                  immediate
                  className={inputClass}
                  placeholder="/path/to/acp-state"
                />
                <ChoosePathButton />
              </div>
            </Field>
          )}
          <Field configSection="runPolicy"
            label={tf("auto.4d464a532c7fafdb")}
            hint="Defaults to 0, which closes the ACP process after each run while retaining persistent session state."
          >
            {isCreate ? (
              <input
                type="number"
                className={inputClass}
                value={values!.geminiAcpWarmHandleIdleMs ?? 0}
                onChange={(e) => set!({ geminiAcpWarmHandleIdleMs: Number(e.target.value) })}
              />
            ) : (
              <DraftNumberInput
                value={eff(
                  "adapterConfig",
                  "warmHandleIdleMs",
                  Number(config.warmHandleIdleMs ?? 0),
                )}
                onCommit={(v) => mark("adapterConfig", "warmHandleIdleMs", v || 0)}
                immediate
                className={inputClass}
              />
            )}
          </Field>
        </>
      )}
      {!hideInstructionsFile && (
        <Field label={tf("auto.ce46e7f310ea3f64")} hint={instructionsFileHint}>
          <div className="flex items-center gap-2">
            <DraftInput
              value={
                isCreate
                  ? values!.instructionsFilePath ?? ""
                  : eff(
                      "adapterConfig",
                      "instructionsFilePath",
                      String(config.instructionsFilePath ?? ""),
                    )
              }
              onCommit={(v) =>
                isCreate
                  ? set!({ instructionsFilePath: v })
                  : mark("adapterConfig", "instructionsFilePath", v || undefined)
              }
              immediate
              className={inputClass}
              placeholder="/absolute/path/to/AGENTS.md"
            />
            <ChoosePathButton />
          </div>
        </Field>
      )}
    </>
  ));
}
