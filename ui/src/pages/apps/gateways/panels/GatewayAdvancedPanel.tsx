import { tf } from "@/i18n/fork";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import type { ToolMcpGatewayWithTokens } from "@paperclipai/shared";
import { useNavigate } from "@/lib/router";
import { toolsApi } from "@/api/tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/context/ToastContext";
import { copyTextToClipboard } from "@/lib/clipboard";
import { gatewaysQueryKey } from "../NewGatewayDialog";

/**
 * Advanced tab — raw protocol/transport details, config JSON and the archive
 * (destructive) action live here, out of the default prosumer view per the
 * PAP-11174 contract's default-vs-Advanced split.
 */
export function GatewayAdvancedPanel({
  companyId,
  gateway,
}: {
  companyId: string;
  gateway: ToolMcpGatewayWithTokens;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [confirmName, setConfirmName] = useState("");

  const endpoint = `${typeof window !== "undefined" ? window.location.origin : ""}${gateway.endpointPath}`;
  const rawConfig = JSON.stringify(
    {
      gatewayPublicId: gateway.gatewayPublicId,
      displaySlug: gateway.displaySlug,
      status: gateway.status,
      profileId: gateway.profileId,
      defaultProfileMode: gateway.defaultProfileMode,
      contextScopeType: gateway.contextScopeType,
      contextScopeId: gateway.contextScopeId,
      endpointPath: gateway.endpointPath,
      authConfig: gateway.authConfig,
      headerPolicy: gateway.headerPolicy,
      metadataPolicy: gateway.metadataPolicy,
      onDemandToolsConfig: gateway.onDemandToolsConfig,
    },
    null,
    2,
  );

  const archiveMutation = useMutation({
    mutationFn: () => toolsApi.updateGateway(companyId, gateway.id, { status: "archived" }),
    onSuccess: async () => {
      pushToast({ title: tf("auto.b6b73fd72ea20131"), body: `${gateway.name} is no longer reachable.`, tone: "success" });
      await queryClient.invalidateQueries({ queryKey: gatewaysQueryKey(companyId) });
      navigate("/apps/gateways");
    },
    onError: (error) =>
      pushToast({
        title: tf("auto.ab9a7739f34eaec4"),
        body: error instanceof Error ? error.message : String(error),
        tone: "error",
      }),
  });

  async function copy(value: string, label: string) {
    try {
      await copyTextToClipboard(value);
      pushToast({ title: tf("text.Copied"), body: label, tone: "success" });
    } catch {
      pushToast({ title: tf("auto.5b50e7a693fee952"), body: "Clipboard access is unavailable.", tone: "error" });
    }
  }

  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">{tf("auto.aaead4abf5d0fd5e")}</h3>
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <Row label={tf("auto.aaead4abf5d0fd5e")} value="streamable_http" />
          <Row label={tf("text.Authentication")} value="bearer" />
          <Row label={tf("auto.cdd7356ea3acbf2f")} value="2025-03-26" />
          <Row label={tf("auto.3705b64fd5cc026a")} value={gateway.gatewayPublicId} mono />
        </dl>
        <div className="flex items-center gap-2">
          <code className="min-w-0 flex-1 truncate rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
            {endpoint}
          </code>
          <Button variant="outline" size="sm" onClick={() => void copy(endpoint, "Endpoint URL")}>
            <Copy className="mr-1 h-3.5 w-3.5" />
            {tf("text.Copy")}
          </Button>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{tf("auto.493d4f2717d68c39")}</h3>
          <Button variant="outline" size="sm" onClick={() => void copy(rawConfig, "Gateway config JSON")}>
            <Copy className="mr-1 h-3.5 w-3.5" />
            {tf("auto.7708c6e2ae9c0a35")}
          </Button>
        </div>
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted p-3 font-mono text-xs text-muted-foreground">
          {rawConfig}
        </pre>
      </section>

      <section className="space-y-2 rounded-lg border border-destructive/40 p-4">
        <h3 className="text-sm font-semibold text-destructive">{tf("auto.fd8b8dae44216610")}</h3>
        <p className="text-sm text-muted-foreground">
          Archiving takes the gateway offline for every client. Existing tokens stop working. Type the
          gateway name to confirm.
        </p>
        {confirming ? (
          <div className="space-y-2">
            <Input
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={gateway.name}
              aria-label={tf("auto.7add56c9ba3e3a93")}
            />
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                disabled={confirmName.trim() !== gateway.name || archiveMutation.isPending}
                onClick={() => archiveMutation.mutate()}
              >
                {archiveMutation.isPending ? "Archiving…" : "Archive gateway"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setConfirming(false); setConfirmName(""); }}>
                {tf("text.Cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="text-destructive" onClick={() => setConfirming(true)}>
            {tf("auto.62da42a3ae2609cd")}
          </Button>
        )}
      </section>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className={mono ? "mt-0.5 font-mono text-foreground" : "mt-0.5 text-foreground"}>{value}</dd>
    </div>
  );
}
