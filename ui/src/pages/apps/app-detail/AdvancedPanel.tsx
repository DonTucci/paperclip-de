import { tf } from "@/i18n/fork";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpRight, ChevronRight, Loader2, Lock } from "lucide-react";
import type {
  AppDefinition,
  ConnectionGrant,
  ToolConnection,
  ToolConnectionCredentialPolicy,
} from "@paperclipai/shared";
import { credentialConfigPath, getAvailableConnectionMethod, humanizeConnectionDisplayName } from "@paperclipai/shared";
import { toolsApi } from "@/api/tools";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { useToast } from "@/context/ToastContext";
import { redactUrlSecrets } from "@/lib/redact-url-secrets";
import { navigateTopLevel } from "@/lib/browserNavigation";
import { prepareOAuthNavigation, savePendingCloudHandoff } from "@/lib/oauthHandoff";
import { cn } from "@/lib/utils";
import { Link } from "@/lib/router";
import type { AppDetailSectionProps } from "./types";
import { RevokeGrantDialog } from "./IdentitiesSection";

export function AdvancedPanel({
  connection,
  appName,
  galleryEntry,
  childConnectionCount,
  removing,
  onRemove,
  onReplaced,
  canReplaceCredential = true,
  credentialUnavailableMessage = "You don't have permission to replace this identity's credential.",
  appToggleDisabled,
  onToggleApp,
  identityGrant = null,
  identityCurrentUserId = null,
  identityProviderName,
  credentialPolicy,
  identityActionPending = false,
  onReconnectIdentity,
  onRevokeIdentity,
}: Pick<AppDetailSectionProps, "connection" | "appName" | "galleryEntry"> & {
  removing: boolean;
  childConnectionCount?: number;
  onRemove: () => void;
  onReplaced: () => void;
  canReplaceCredential?: boolean;
  credentialUnavailableMessage?: string;
  appToggleDisabled: boolean;
  onToggleApp: () => void;
  identityGrant?: ConnectionGrant | null;
  identityCurrentUserId?: string | null;
  identityProviderName?: string;
  credentialPolicy?: ToolConnectionCredentialPolicy;
  identityActionPending?: boolean;
  onReconnectIdentity?: () => void;
  onRevokeIdentity?: (grant: ConnectionGrant) => void;
}) {
  return (
    <div className="space-y-4 border-t border-border pt-8">
      <TechnicalDetails connection={connection} />
      <DangerZone
        appName={appName}
        connection={connection}
        galleryEntry={galleryEntry}
        childConnectionCount={childConnectionCount}
        removing={removing}
        onRemove={onRemove}
        onReplaced={onReplaced}
        canReplaceCredential={canReplaceCredential}
        credentialUnavailableMessage={credentialUnavailableMessage}
        toggleDisabled={appToggleDisabled}
        onToggleConnection={onToggleApp}
        identityGrant={identityGrant}
        identityCurrentUserId={identityCurrentUserId}
        identityProviderName={identityProviderName ?? appName}
        credentialPolicy={credentialPolicy}
        identityActionPending={identityActionPending}
        onReconnectIdentity={onReconnectIdentity}
        onRevokeIdentity={onRevokeIdentity}
      />
    </div>
  );
}

function connectionMethodUnavailable(connection: ToolConnection, galleryEntry: AppDefinition | null): boolean {
  const methodKey = connection.config?.connectionMethodKey;
  return typeof methodKey === "string"
    && methodKey.length > 0
    && !!galleryEntry
    && Array.isArray(galleryEntry.methods)
    && !getAvailableConnectionMethod(galleryEntry, methodKey);
}

function KeySection({
  connection,
  galleryEntry,
  onReplaced,
  canReplace,
  unavailableMessage,
}: {
  connection: ToolConnection;
  galleryEntry: AppDefinition | null;
  onReplaced: () => void;
  canReplace: boolean;
  unavailableMessage: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <h2 className="text-sm font-medium text-foreground">{tf("auto.bf8a9eab9e7e141b")}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {canReplace ? "Replace the stored credential." : unavailableMessage}
            </p>
          </div>
        </div>
        {canReplace && !open && (
          <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
            {tf("auto.bf8a9eab9e7e141b")}
          </Button>
        )}
      </div>
      {open && (
        <div className="pt-4">
          <ReconnectForm
            connection={connection}
            galleryEntry={galleryEntry}
            onCancel={() => setOpen(false)}
            onReconnected={() => {
              setOpen(false);
              onReplaced();
            }}
          />
        </div>
      )}
    </section>
  );
}

export function ReconnectCard({
  connection,
  galleryEntry,
  onReconnected,
  onReconnect,
  canReconnect = true,
  reconnectUnavailableMessage,
}: {
  connection: ToolConnection;
  galleryEntry: AppDefinition | null;
  onReconnected: () => void;
  onReconnect?: () => void;
  canReconnect?: boolean;
  reconnectUnavailableMessage?: string;
}) {
  const { pushToast } = useToast();
  const reconnectOAuth = useMutation({
    // Reconnect is not a new identity choice. Personal-only connections must
    // put the replacement token back on the signed-in user's existing grant;
    // shared and legacy fallback connections keep using the organization slot.
    mutationFn: () => connection.credentialPolicy === "per_user"
      ? toolsApi.startOAuth(connection.id, { asCurrentUser: true })
      : toolsApi.startOAuth(connection.id),
    onSuccess: async (start) => {
      try {
        const target = await prepareOAuthNavigation(start);
        if (target.kind === "reauthentication" && start.handoff) {
          savePendingCloudHandoff(start.handoff.session);
        }
        navigateTopLevel(target.url);
      } catch (error) {
        pushToast({
          title: tf("auto.33d85fafdf4b2714"),
          body: error instanceof Error ? error.message: tf("auto.eea4fb33efd38283"),
          tone: "error",
        });
      }
    },
    onError: (error) =>
      pushToast({
        title: tf("auto.33d85fafdf4b2714"),
        body: error instanceof Error ? error.message: tf("auto.eea4fb33efd38283"),
        tone: "error",
      }),
  });
  const verifyVercel = useMutation({
    mutationFn: () => toolsApi.checkConnectionHealth(connection.id),
    onSuccess: () => {
      pushToast({
        title: tf("auto.48706ce3b76e9d05"),
        body: `${humanizeConnectionDisplayName(connection)} is back online.`,
        tone: "success",
      });
      onReconnected();
    },
    onError: (error) => pushToast({
      title: tf("auto.cf74236aea74055b"),
      body: error instanceof Error ? error.message: tf("auto.102132d27b88f7d6"),
      tone: "error",
    }),
  });
  const oauth = connection.authKind === "oauth";
  const managedByVercel = connection.credentialSource === "vercel_connect";
  const methodUnavailable = connectionMethodUnavailable(connection, galleryEntry);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
          {methodUnavailable ? "Connection no longer supported" : oauth ? "Reconnect required" : "This app needs reconnecting"}
        </h2>
        <p className="mt-0.5 text-sm text-amber-800 dark:text-amber-200">
          {methodUnavailable
            ? "Add a supported connection from Connectors, then remove this connection."
            : connection.healthMessage?.trim() || (oauth
            ? "Authorization expired or was revoked. Sign in again to restore access."
            : "The key stopped working. Paste a new one to get it back online.")}
        </p>
      </div>
      <div className="shrink-0">
        {!canReconnect ? (
          <p className="text-sm text-amber-800 dark:text-amber-200">
            {reconnectUnavailableMessage ?? "You don't have permission to reconnect this identity."}
          </p>
        ) : methodUnavailable ? (
          <Button size="sm" variant="outline" asChild>
            <Link to={`/apps/connect?source=${encodeURIComponent(galleryEntry!.slug)}`}>
              {tf("auto.fa83864532817b24")}
            </Link>
          </Button>
        ) : onReconnect ? (
          <Button size="sm" variant="outline" onClick={onReconnect}>{tf("auto.bf8a9eab9e7e141b")}</Button>
        ) : managedByVercel && !oauth ? (
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" variant="outline" asChild>
              <a href="https://vercel.com/connect" target="_blank" rel="noreferrer">
                Manage in Vercel <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </a>
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={verifyVercel.isPending}
              onClick={() => verifyVercel.mutate()}
            >
              {verifyVercel.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Check again
            </Button>
          </div>
        ) : oauth ? (
          <Button
            type="button"
            size="sm"
            disabled={reconnectOAuth.isPending}
            onClick={() => reconnectOAuth.mutate()}
          >
            {reconnectOAuth.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            {reconnectOAuth.isPending ? "Opening sign-in…" : "Reconnect"}
          </Button>
        ) : (
          <ReconnectForm connection={connection} galleryEntry={galleryEntry} onReconnected={onReconnected} />
        )}
      </div>
    </div>
  );
}

function ReconnectForm({
  connection,
  galleryEntry,
  onCancel,
  onReconnected,
}: {
  connection: ToolConnection;
  galleryEntry: AppDefinition | null;
  onCancel?: () => void;
  onReconnected: () => void;
}) {
  const { pushToast } = useToast();
  const methodKey = typeof connection.config?.connectionMethodKey === "string"
    ? connection.config.connectionMethodKey
    : null;
  const method = galleryEntry && Array.isArray(galleryEntry.methods)
    ? getAvailableConnectionMethod(galleryEntry, methodKey)
    : null;
  const fields = (method?.credentialFields ?? []).map((field) => ({
    ...field,
    configPath: credentialConfigPath(field),
    helpUrl: method?.consoleLinks?.keys ?? method?.consoleLinks?.docs ?? "",
  }));
  const [values, setValues] = useState<Record<string, string>>({});
  const [single, setSingle] = useState("");
  const usesGallery = fields.length > 0 && !!galleryEntry;

  const reconnect = useMutation({
    mutationFn: () => {
      const credentialValues = usesGallery
        ? values
        : { "credentials.authorization": single.trim() };
      return toolsApi.reconnectConnection(connection.id, credentialValues);
    },
    onSuccess: (result) => {
      const healthy =
        result.connection.healthStatus === "healthy" || result.connection.healthStatus === "unknown";
      if (healthy) {
        pushToast({
          title: tf("auto.20a447dbc60511a6"),
          body: `${humanizeConnectionDisplayName(connection)} is back online.`,
          tone: "success",
        });
        onReconnected();
      } else {
        pushToast({
          title: tf("auto.46d820c55ac73740"),
          body: result.connection.healthMessage?.trim() || "That key didn't check out. Try another.",
          tone: "error",
        });
      }
    },
    onError: (error) =>
      pushToast({
        title: tf("auto.5bf9a8b27f980ee4"),
        body: error instanceof Error ? error.message: tf("auto.7e751a81bfdcce67"),
        tone: "error",
      }),
  });

  const filled = usesGallery
    ? fields.every((f) => f.required === false || (values[f.configPath]?.trim().length ?? 0) > 0)
    : single.trim().length > 0;

  if (connection.credentialSource === "vercel_connect") {
    return (
      <p className="text-sm text-muted-foreground">
        {tf("auto.7352a3aada5fa7e3")}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {usesGallery ? (
        fields.map((field) => (
          <div key={field.configPath}>
            <label className="text-xs font-medium text-foreground">{field.label}</label>
            <Input
              type="password"
              autoComplete="off"
              value={values[field.configPath] ?? ""}
              onChange={(e) => setValues({ ...values, [field.configPath]: e.target.value })}
              placeholder="****************"
              className="mt-1 h-10 font-mono"
            />
            {field.helpUrl && (
              <a
                href={field.helpUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-foreground underline underline-offset-2"
              >
                Where do I find this? <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
          </div>
        ))
      ) : (
        <Input
          type="password"
          autoComplete="off"
          value={single}
          onChange={(e) => setSingle(e.target.value)}
          placeholder={tf("auto.0dbd3b63d1b73c08")}
          className="h-10 font-mono"
        />
      )}
      <div className="flex items-center gap-2">
        <Button size="sm" disabled={!filled || reconnect.isPending} onClick={() => reconnect.mutate()}>
          {reconnect.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
          {reconnect.isPending ? "Checking..." : "Check & reconnect"}
        </Button>
        {onCancel && (
          <Button size="sm" variant="ghost" onClick={onCancel} disabled={reconnect.isPending}>
            {tf("text.Cancel")}
          </Button>
        )}
      </div>
    </div>
  );
}

function TechnicalDetails({ connection }: { connection: ToolConnection }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <section>
        <CollapsibleTrigger asChild>
          <button type="button" className="flex w-full items-center gap-3 py-1 text-left">
            <span className="min-w-0 flex-1 text-sm font-medium text-foreground">{tf("auto.51bfffbcdbcfbc00")}</span>
            <ChevronRight
              className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-90")}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <dl className="mt-4 grid gap-2 pb-2 text-xs sm:grid-cols-(--gtc-59)">
            <dt className="text-muted-foreground">{tf("auto.56ef8f20955f2564")}</dt>
            <dd className="break-all font-mono text-foreground">{connectionAddress(connection)}</dd>
            <dt className="text-muted-foreground">{tf("text.Type")}</dt>
            <dd className="text-foreground">{connectionTransportLabel(connection.transport)}</dd>
          </dl>
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
}

export function DangerZone({
  appName,
  connection,
  galleryEntry = null,
  childConnectionCount = 0,
  removing,
  onRemove,
  onReplaced,
  canReplaceCredential = true,
  credentialUnavailableMessage = "You don't have permission to replace this identity's credential.",
  toggleDisabled = false,
  onToggleConnection,
  identityGrant = null,
  identityCurrentUserId = null,
  identityProviderName = appName,
  credentialPolicy,
  identityActionPending = false,
  onReconnectIdentity,
  onRevokeIdentity,
}: {
  appName: string;
  connection?: ToolConnection;
  galleryEntry?: AppDefinition | null;
  childConnectionCount?: number;
  removing: boolean;
  onRemove: () => void;
  onReplaced?: () => void;
  canReplaceCredential?: boolean;
  credentialUnavailableMessage?: string;
  toggleDisabled?: boolean;
  onToggleConnection?: () => void;
  identityGrant?: ConnectionGrant | null;
  identityCurrentUserId?: string | null;
  identityProviderName?: string;
  credentialPolicy?: ToolConnectionCredentialPolicy;
  identityActionPending?: boolean;
  onReconnectIdentity?: () => void;
  onRevokeIdentity?: (grant: ConnectionGrant) => void;
}) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<ConnectionGrant | null>(null);
  const paused = connection
    ? connection.enabled === false || connection.status === "disabled"
    : false;
  const methodUnavailable = connection ? connectionMethodUnavailable(connection, galleryEntry) : false;

  return (
    <Collapsible
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setConfirming(false);
      }}
      asChild
    >
      <section>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-3 py-1 text-left"
          >
            <span className="min-w-0 flex-1 text-sm font-medium text-destructive">{tf("auto.fd8b8dae44216610")}</span>
            <ChevronRight
              className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-90")}
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-3 divide-y divide-border border-t border-border">
            {connection && onToggleConnection ? (
              <div className="flex items-center justify-between gap-4 py-4">
                <h2 className="text-sm font-medium text-foreground">{tf("auto.722c186746f9e6ae")}</h2>
                <ToggleSwitch
                  aria-label={tf("auto.722c186746f9e6ae")}
                  checked={paused}
                  disabled={toggleDisabled}
                  onCheckedChange={onToggleConnection}
                  size="lg"
                />
              </div>
            ) : null}

            {connection && !methodUnavailable && connection.authKind !== "oauth" ? (
              <div className="py-4">
                <KeySection
                  connection={connection}
                  galleryEntry={galleryEntry}
                  onReplaced={onReplaced ?? (() => undefined)}
                  canReplace={canReplaceCredential}
                  unavailableMessage={credentialUnavailableMessage}
                />
              </div>
            ) : null}

            {connection?.authKind === "oauth" && !methodUnavailable && (onReconnectIdentity || !canReplaceCredential) ? (
              <div className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{tf("auto.bf8a9eab9e7e141b")}</p>
                  <p className="text-xs text-muted-foreground">
                    {canReplaceCredential
                      ? `Sign in to ${identityProviderName} again.`
                      : credentialUnavailableMessage}
                  </p>
                </div>
                {canReplaceCredential && onReconnectIdentity ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={identityActionPending}
                    onClick={onReconnectIdentity}
                  >
                    {identityActionPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
                    Reconnect
                  </Button>
                ) : null}
              </div>
            ) : null}

            {identityGrant?.capabilities?.canRevoke
              && identityGrant.status !== "revoked"
              && onRevokeIdentity ? (
                <div className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{tf("auto.c8534276405e474b")}</p>
                    <p className="text-xs text-muted-foreground">
                      {tf("auto.fa1ff4ff6cd56525")}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setRevokeTarget(identityGrant)}
                  >
                    {tf("auto.87e6d00bbf53ec5a")}
                  </Button>
                </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="text-sm font-medium text-foreground">{tf("auto.83be3901aaf06a04")}</p>
                <p className="text-xs text-muted-foreground">
                  {childConnectionCount > 0
                    ? `Deletes credentials for ${appName} and ${childConnectionCount} connected ${childConnectionCount === 1 ? "service" : "services"}.`
                    : `Deletes credentials for ${appName} and removes agent access. Reconnecting requires a new sign-in or key.`}
                </p>
              </div>
              {confirming ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setConfirming(false)} disabled={removing}>
                    {tf("text.Cancel")}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={onRemove} disabled={removing}>
                    {removing && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                    Yes, remove it
                  </Button>
                </div>
              ) : (
                <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>
                  {tf("auto.2ce428741dc4fbd9")}
                </Button>
              )}
            </div>
          </div>
        </CollapsibleContent>

        {revokeTarget && credentialPolicy ? (
          <RevokeGrantDialog
            grant={revokeTarget}
            providerName={identityProviderName}
            pending={identityActionPending}
            credentialPolicy={credentialPolicy}
            isOwnIdentity={revokeTarget.kind === "user" && revokeTarget.subjectUserId === identityCurrentUserId}
            onCancel={() => setRevokeTarget(null)}
            onConfirm={() => {
              onRevokeIdentity?.(revokeTarget);
              setRevokeTarget(null);
            }}
          />
        ) : null}
      </section>
    </Collapsible>
  );
}

export function connectionAddress(connection: ToolConnection): string {
  const config = connection.config ?? connection.transportConfig ?? {};
  const value = config.url ?? config.endpoint ?? config.remoteUrl;
  if (typeof value === "string" && value.trim().length > 0) return redactUrlSecrets(value);
  if (connection.transport === "local_stdio") return "Local command";
  return "Not set";
}

export function connectionTransportLabel(transport: ToolConnection["transport"]): string {
  if (transport === "mcp_remote") return "Remote HTTP";
  if (transport === "local_stdio") return "Local command";
  return "Unknown";
}
