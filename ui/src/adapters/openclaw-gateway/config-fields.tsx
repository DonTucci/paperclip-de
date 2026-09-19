import { tf } from "@/i18n/fork";
import { configFieldsForSection } from "../config-sections";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { AdapterConfigFieldsProps } from "../types";
import {
  Field,
  DraftInput,
  help,
} from "../../components/agent-config-primitives";
import {
  PayloadTemplateJsonField,
  RuntimeServicesJsonField,
} from "../runtime-json-fields";

const inputClass =
  "w-full rounded-md border border-border px-2.5 py-1.5 bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/40";

function HeadersJsonTextarea({
  isCreate,
  createDraft,
  onCreateDraftChange,
  editStringified,
  onEditCommit,
  inputClass,
}: {
  isCreate: boolean;
  createDraft: string;
  onCreateDraftChange: (next: string) => void;
  editStringified: string;
  onEditCommit: (next: string) => void;
  inputClass: string;
}) {
  const [editDraft, setEditDraft] = useState<string>(editStringified);
  const [lastSyncedFromConfig, setLastSyncedFromConfig] = useState<string>(editStringified);
  useEffect(() => {
    if (isCreate) return;
    if (editStringified !== lastSyncedFromConfig) {
      setEditDraft(editStringified);
      setLastSyncedFromConfig(editStringified);
    }
  }, [editStringified, isCreate, lastSyncedFromConfig]);
  const value = isCreate ? createDraft : editDraft;
  return (
    <textarea
      value={value}
      onChange={(e) => {
        const next = e.target.value;
        if (isCreate) {
          onCreateDraftChange(next);
        } else {
          setEditDraft(next);
          onEditCommit(next);
        }
      }}
      rows={3}
      className={inputClass}
      placeholder='{"x-custom-header": "value"}'
    />
  );
}

function SecretField({
  label,
  value,
  onCommit,
  placeholder,
}: {
  label: string;
  value: string;
  onCommit: (v: string) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <Field label={label}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>
        <DraftInput
          value={value}
          onCommit={onCommit}
          immediate
          type={visible ? "text" : "password"}
          className={inputClass + " pl-8"}
          placeholder={placeholder}
        />
      </div>
    </Field>
  );
}

function parseScopes(value: unknown): string {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string").join(", ");
  }
  return typeof value === "string" ? value : "";
}

export function OpenClawGatewayConfigFields({
  section,
  isCreate,
  values,
  set,
  config,
  eff,
  mark,
}: AdapterConfigFieldsProps) {
  const configuredHeaders =
    config.headers && typeof config.headers === "object" && !Array.isArray(config.headers)
      ? (config.headers as Record<string, unknown>)
      : {};
  const effectiveHeaders =
    (eff("adapterConfig", "headers", configuredHeaders) as Record<string, unknown>) ?? {};

  const effectiveGatewayToken = typeof effectiveHeaders["x-openclaw-token"] === "string"
    ? String(effectiveHeaders["x-openclaw-token"])
    : typeof effectiveHeaders["x-openclaw-auth"] === "string"
      ? String(effectiveHeaders["x-openclaw-auth"])
      : "";

  const commitGatewayToken = (rawValue: string) => {
    const nextValue = rawValue.trim();
    const nextHeaders: Record<string, unknown> = { ...effectiveHeaders };
    if (nextValue) {
      nextHeaders["x-openclaw-token"] = nextValue;
      delete nextHeaders["x-openclaw-auth"];
    } else {
      delete nextHeaders["x-openclaw-token"];
      delete nextHeaders["x-openclaw-auth"];
    }
    mark("adapterConfig", "headers", Object.keys(nextHeaders).length > 0 ? nextHeaders : undefined);
  };

  const sessionStrategy = eff(
    "adapterConfig",
    "sessionKeyStrategy",
    String(config.sessionKeyStrategy ?? "fixed"),
  );

  return configFieldsForSection(section, (
    <>
      <Field label={tf("auto.3d06950825de7452")} hint={help.webhookUrl}>
        <DraftInput
          value={
            isCreate
              ? values!.url
              : eff("adapterConfig", "url", String(config.url ?? ""))
          }
          onCommit={(v) =>
            isCreate
              ? set!({ url: v })
              : mark("adapterConfig", "url", v || undefined)
          }
          immediate
          className={inputClass}
          placeholder="ws://127.0.0.1:18789"
        />
      </Field>

      <PayloadTemplateJsonField
        isCreate={isCreate}
        values={values}
        set={set}
        config={config}
        mark={mark}
      />

      {/* Auth and Identity - available in both create and edit modes */}
      <SecretField
        label={tf("auto.a31b5be38953f120")}
        value={
          isCreate
            ? values!.authToken ?? ""
            : effectiveGatewayToken
        }
        onCommit={(v) =>
          isCreate
            ? set!({ authToken: v })
            : commitGatewayToken(v)
        }
        placeholder={tf("auto.dbcf48feb1f1057e")}
      />

      <Field label={tf("auto.510bce732db77286")}>
        <DraftInput
          value={
            isCreate
              ? values!.agentId ?? ""
              : eff("adapterConfig", "agentId", String(config.agentId ?? ""))
          }
          onCommit={(v) =>
            isCreate
              ? set!({ agentId: v })
              : mark("adapterConfig", "agentId", v || undefined)
          }
          immediate
          className={inputClass}
          placeholder={tf("auto.0e9a8c1ba450d66e")}
        />
      </Field>

      <Field label={tf("auto.1747233af5908171")}>
        <select
          value={
            isCreate
              ? values!.sessionKeyStrategy ?? "fixed"
              : sessionStrategy
          }
          onChange={(e) =>
            isCreate
              ? set!({ sessionKeyStrategy: e.target.value })
              : mark("adapterConfig", "sessionKeyStrategy", e.target.value)
          }
          className={inputClass}
        >
          <option value="fixed">{tf("auto.1246fc93bca00b90")}</option>
          <option value="issue">{tf("auto.a1ce76ec4524c2c3")}</option>
          <option value="run">{tf("auto.97bc74ee5caf4a25")}</option>
        </select>
      </Field>

      {(isCreate ? values!.sessionKeyStrategy ?? "fixed" : sessionStrategy) === "fixed" && (
        <Field label={tf("auto.2319ec27475054a2")}>
          <DraftInput
            value={
              isCreate
                ? values!.sessionKey ?? ""
                : eff("adapterConfig", "sessionKey", String(config.sessionKey ?? "paperclip"))
            }
            onCommit={(v) =>
              isCreate
                ? set!({ sessionKey: v })
                : mark("adapterConfig", "sessionKey", v || undefined)
            }
            immediate
            className={inputClass}
            placeholder={tf("auto.670d47ccb9a6cdef")}
          />
        </Field>
      )}

      <SecretField
        label={tf("auto.a0623db13679ee2a")}
        value={
          isCreate
            ? values!.password ?? ""
            : eff("adapterConfig", "password", String(config.password ?? ""))
        }
        onCommit={(v) =>
          isCreate
            ? set!({ password: v })
            : mark("adapterConfig", "password", v || undefined)
        }
        placeholder={tf("auto.6a063dc23bfc8757")}
      />

      <Field label={tf("text.Role")}>
        <DraftInput
          value={
            isCreate
              ? values!.role ?? ""
              : eff("adapterConfig", "role", String(config.role ?? "operator"))
          }
          onCommit={(v) =>
            isCreate
              ? set!({ role: v })
              : mark("adapterConfig", "role", v || undefined)
          }
          immediate
          className={inputClass}
          placeholder={tf("auto.06e55b633481f7bb")}
        />
      </Field>

      <Field label={tf("auto.79d74bdb4faffb62")}>
        <DraftInput
          value={
            isCreate
              ? values!.scopes ?? ""
              : eff("adapterConfig", "scopes", parseScopes(config.scopes ?? ["operator.admin"]))
          }
          onCommit={(v) => {
            const parsed = v
              .split(",")
              .map((entry) => entry.trim())
              .filter(Boolean);
            if (isCreate) {
              set!({ scopes: v });
            } else {
              mark("adapterConfig", "scopes", parsed.length > 0 ? parsed : undefined);
            }
          }}
          immediate
          className={inputClass}
          placeholder="operator.admin"
        />
      </Field>

      <RuntimeServicesJsonField
        isCreate={isCreate}
        values={values}
        set={set}
        config={config}
        mark={mark}
      />

      <Field label={tf("auto.5462f7699e2ebea1")}>
        <DraftInput
          value={
            isCreate
              ? values!.paperclipApiUrl ?? ""
              : eff("adapterConfig", "paperclipApiUrl", String(config.paperclipApiUrl ?? ""))
          }
          onCommit={(v) =>
            isCreate
              ? set!({ paperclipApiUrl: v })
              : mark("adapterConfig", "paperclipApiUrl", v || undefined)
          }
          immediate
          className={inputClass}
          placeholder="https://paperclip.example"
        />
      </Field>

      <Field configSection="runPolicy" label={tf("auto.1f966032d11151c8")}>
        <DraftInput
          value={
            isCreate
              ? values!.timeoutSec != null ? String(values!.timeoutSec) : ""
              : eff("adapterConfig", "timeoutSec", String(config.timeoutSec ?? ""))
          }
          onCommit={(v) => {
            const parsed = Number.parseInt(v.trim(), 10);
            const val = Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
            if (isCreate) {
              set!({ timeoutSec: val });
            } else {
              mark("adapterConfig", "timeoutSec", val);
            }
          }}
          immediate
          className={inputClass}
          placeholder="120"
        />
      </Field>

      <Field label={tf("auto.2899a831dbe0b032")}>
        <HeadersJsonTextarea
          isCreate={isCreate}
          createDraft={isCreate ? values!.headersJson ?? "" : ""}
          onCreateDraftChange={(next) => set!({ headersJson: next })}
          editStringified={JSON.stringify(eff("adapterConfig", "headers", config.headers ?? {}), null, 2)}
          onEditCommit={(next) => {
            const trimmed = next.trim();
            if (!trimmed) {
              mark("adapterConfig", "headers", undefined);
              return;
            }
            try {
              const parsed = JSON.parse(trimmed);
              if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
                mark("adapterConfig", "headers", parsed);
              }
            } catch {
              // Keep local draft until JSON is valid
            }
          }}
          inputClass={inputClass}
        />
      </Field>

      {!isCreate && (
        <Field label={tf("auto.be223b29f7982acb")}>
          <DraftInput
            value={eff("adapterConfig", "claimedApiKeyPath", String(config.claimedApiKeyPath ?? ""))}
            onCommit={(v) => mark("adapterConfig", "claimedApiKeyPath", v || undefined)}
            immediate
            className={inputClass}
            placeholder={tf("auto.9776c09e32d4e88b")}
          />
        </Field>
      )}

      <Field configSection="runPolicy" label={tf("auto.9e6598176b0ed394")}>
        <DraftInput
          value={
            isCreate
              ? values!.waitTimeoutMs != null
                ? String(values!.waitTimeoutMs)
                : ""
              : eff("adapterConfig", "waitTimeoutMs", String(config.waitTimeoutMs ?? "120000"))
          }
          onCommit={(v) => {
            const parsed = Number.parseInt(v.trim(), 10);
            const next = Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
            if (isCreate) {
              set!({ waitTimeoutMs: next });
            } else {
              mark("adapterConfig", "waitTimeoutMs", next);
            }
          }}
          immediate
          className={inputClass}
          placeholder="120000"
        />
      </Field>

      <Field label={tf("auto.9ce197720896bf45")}>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={
              isCreate
                ? values!.disableDeviceAuth ?? false
                : eff("adapterConfig", "disableDeviceAuth", Boolean(config.disableDeviceAuth ?? false))
            }
            onChange={(e) =>
              isCreate
                ? set!({ disableDeviceAuth: e.target.checked })
                : mark("adapterConfig", "disableDeviceAuth", e.target.checked || undefined)
            }
          />
          {tf("auto.4ca952152e396180")}
        </label>
      </Field>

      <Field label={tf("auto.7d491d768fa4dc81")}>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={
              isCreate
                ? values!.autoPairOnFirstConnect ?? true
                : eff("adapterConfig", "autoPairOnFirstConnect", config.autoPairOnFirstConnect !== false)
            }
            onChange={(e) =>
              isCreate
                ? set!({ autoPairOnFirstConnect: e.target.checked })
                : mark("adapterConfig", "autoPairOnFirstConnect", e.target.checked)
            }
          />
          {tf("auto.55fd685aca22626f")}
        </label>
      </Field>

      <Field label={tf("auto.6fc25a19873431c0")}>
        <div className="text-xs text-muted-foreground leading-relaxed">
          When enabled, Paperclip persists a device key during onboarding so pairing approvals
          remain stable across runs.
        </div>
      </Field>
    </>
  ));
}
