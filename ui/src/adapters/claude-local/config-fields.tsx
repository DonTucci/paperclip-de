import { tf } from "@/i18n/fork";
import { configFieldsForSection } from "../config-sections";
import type { AdapterConfigFieldsProps } from "../types";
import {
  Field,
  ToggleField,
  DraftInput,
  DraftNumberInput,
  help,
} from "../../components/agent-config-primitives";
import { ChoosePathButton } from "../../components/PathInstructionsModal";
import { LocalWorkspaceRuntimeFields } from "../local-workspace-runtime-fields";

const inputClass =
  "w-full rounded-md border border-border px-2.5 py-1.5 bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/40";

const instructionsFileHint =
  "Absolute path to a markdown file (e.g. AGENTS.md) that defines this agent's behavior. Injected into the system prompt at runtime.";

export function ClaudeLocalConfigFields({
  section,
  mode,
  isCreate,
  adapterType,
  values,
  set,
  config,
  eff,
  mark,
  models,
  hideInstructionsFile,
}: AdapterConfigFieldsProps) {
  return configFieldsForSection(section, (
    <>
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
      <LocalWorkspaceRuntimeFields
        isCreate={isCreate}
        values={values}
        set={set}
        config={config}
        mark={mark}
        eff={eff}
        mode={mode}
        adapterType={adapterType}
        models={models}
      />
    </>
  ));
}

export function ClaudeLocalAdvancedFields({
  section,
  isCreate,
  values,
  set,
  config,
  eff,
  mark,
  managedSandboxOnly,
}: AdapterConfigFieldsProps) {
  const rawEngine = isCreate
    ? values!.claudeEngine ?? "auto"
    : eff("adapterConfig", "engine", String(config.engine ?? "auto"));
  const engine = rawEngine === "acp" || rawEngine === "cli" ? rawEngine : "auto";
  const acpSelected = engine === "acp";

  return configFieldsForSection(section, (
    <>
      {/*
        The execution engine picks which binary runs on the execution host, and
        the ACP sub-fields below name host paths. The platform-managed
        environment owns both, so the managed-sandbox-only policy hides them,
        the same way `runnerManaged` hides them for the Paperclip Runner.
      */}
      {!managedSandboxOnly && <Field label={tf("auto.da96ed44c9414cb4")} hint="Default uses ACP. If ACP is unavailable, the run fails with a setup error. Choose CLI explicitly to use it.">
        <select
          className={inputClass}
          value={engine}
          onChange={(e) => {
            const value = e.target.value === "acp" ? "acp" : e.target.value === "cli" ? "cli" : "auto";
            isCreate
              ? set!({ claudeEngine: value })
              : mark("adapterConfig", "engine", value === "auto" ? undefined : value);
          }}
        >
          <option value="auto">{tf("auto.db3da2a98fda28e7")}</option>
          <option value="cli">{tf("auto.1ea01a214117fe22")}</option>
          <option value="acp">{tf("auto.75ad69d7586c3d7e")}</option>
        </select>
      </Field>}
      {acpSelected && (
        <>
          {!managedSandboxOnly && (
            <Field configSection="advanced"
              label={tf("auto.3a0d4f5f95706435")}
              hint="Optional override for the Claude ACP server command. Defaults to the package-local claude-agent-acp binary."
            >
              <DraftInput
                value={
                  isCreate
                    ? values!.claudeAcpAgentCommand ?? ""
                    : eff("adapterConfig", "agentCommand", String(config.agentCommand ?? ""))
                }
                onCommit={(v) =>
                  isCreate
                    ? set!({ claudeAcpAgentCommand: v })
                    : mark("adapterConfig", "agentCommand", v || undefined)
                }
                immediate
                className={inputClass}
                placeholder={tf("auto.fdb4b34aa7425362")}
              />
            </Field>
          )}
          <Field configSection="runPolicy" label={tf("auto.6b7415b4b77c69fc")} hint="Persistent keeps ACP session state between runs. One-shot starts fresh each run.">
            <select
              className={inputClass}
              value={
                isCreate
                  ? values!.claudeAcpMode ?? "persistent"
                  : eff("adapterConfig", "mode", String(config.mode ?? "persistent"))
              }
              onChange={(e) => {
                const value = e.target.value === "oneshot" ? "oneshot" : "persistent";
                isCreate
                  ? set!({ claudeAcpMode: value })
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
                  ? values!.claudeAcpNonInteractivePermissions ?? "deny"
                  : eff("adapterConfig", "nonInteractivePermissions", String(config.nonInteractivePermissions ?? "deny"))
              }
              onChange={(e) => {
                const value = e.target.value === "fail" ? "fail" : "deny";
                isCreate
                  ? set!({ claudeAcpNonInteractivePermissions: value })
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
                      ? values!.claudeAcpStateDir ?? ""
                      : eff("adapterConfig", "stateDir", String(config.stateDir ?? ""))
                  }
                  onCommit={(v) =>
                    isCreate
                      ? set!({ claudeAcpStateDir: v })
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
                value={values!.claudeAcpWarmHandleIdleMs ?? 0}
                onChange={(e) => set!({ claudeAcpWarmHandleIdleMs: Number(e.target.value) })}
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
      <ToggleField
        label={tf("auto.bccd54aea4c5cc0c")}
        hint={help.chrome}
        checked={
          isCreate
            ? values!.chrome
            : eff("adapterConfig", "chrome", config.chrome === true)
        }
        onChange={(v) =>
          isCreate
            ? set!({ chrome: v })
            : mark("adapterConfig", "chrome", v)
        }
      />
      <ToggleField
        label={tf("auto.77c4c0c6d19bf9b4")}
        hint={help.dangerouslySkipPermissions}
        checked={
          isCreate
            ? values!.dangerouslySkipPermissions
            : eff(
                "adapterConfig",
                "dangerouslySkipPermissions",
                config.dangerouslySkipPermissions !== false,
              )
        }
        onChange={(v) =>
          isCreate
            ? set!({ dangerouslySkipPermissions: v })
            : mark("adapterConfig", "dangerouslySkipPermissions", v)
        }
      />
      <Field label={tf("auto.25c125e0557d5091")} hint={help.maxTurnsPerRun}>
        {isCreate ? (
          <input
            type="number"
            className={inputClass}
            value={values!.maxTurnsPerRun}
            onChange={(e) => set!({ maxTurnsPerRun: Number(e.target.value) })}
          />
        ) : (
          <DraftNumberInput
            value={eff(
              "adapterConfig",
              "maxTurnsPerRun",
              Number(config.maxTurnsPerRun ?? 1000),
            )}
            onCommit={(v) => mark("adapterConfig", "maxTurnsPerRun", v || 1000)}
            immediate
            className={inputClass}
          />
        )}
      </Field>
    </>
  ));
}
