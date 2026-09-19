import { tf } from "@/i18n/fork";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, MessageSquarePlus } from "lucide-react";
import { chatEndpointsApi, type ChatProvider } from "@/api/chatEndpoints";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { queryKeys } from "@/lib/queryKeys";
import { Link } from "@/lib/router";
import { useChatConnectorsEnabled } from "@/hooks/useChatConnectorsEnabled";

const providerNames: Record<ChatProvider, string> = {
  slack: "Slack",
  github: "GitHub",
  discord: "Discord",
  "microsoft-teams": "Microsoft Teams",
  telegram: "Telegram",
  "imessage-photon": "iMessage Photon",
  agentmail: "AgentMail",
};

export function AgentChannelsPanel({
  companyId,
  agentId,
}: {
  companyId: string;
  agentId: string;
}) {
  const { enabled } = useChatConnectorsEnabled();
  const query = useQuery({
    queryKey: queryKeys.chatEndpoints.list(companyId),
    queryFn: () => chatEndpointsApi.list(companyId),
    enabled,
  });
  if (!enabled) return null;
  const endpoints = (query.data ?? []).filter(
    (endpoint) =>
      endpoint.assignedAgentId === agentId && endpoint.status !== "archived",
  );
  return (
    <section className="max-w-3xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{tf("auto.4c8906cf76f5740a")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {tf("auto.1a1a7a34710f87cb")}
          </p>
        </div>
        <Button asChild size="sm">
          <Link to={`/apps?chatAgentId=${encodeURIComponent(agentId)}`}>
            <MessageSquarePlus />
            {tf("auto.283fa1a6131eb1eb")}
          </Link>
        </Button>
      </div>
      {query.isLoading ? (
        <p className="text-sm text-muted-foreground">{tf("auto.b09d106b3f777e53")}</p>
      ) : endpoints.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-5">
          <p className="text-sm font-medium">{tf("auto.ce30a0411e96165e")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect AgentMail, Slack, GitHub, Discord, Microsoft Teams, or Telegram from
            Connectors.
          </p>
          <Button asChild className="mt-3" variant="outline" size="sm">
            <Link to="/apps">{tf("auto.d985974b1d0546ec")}</Link>
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-border border-y border-border">
          {endpoints.map((endpoint) => (
            <div
              key={endpoint.id}
              className="flex flex-wrap items-center gap-3 py-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  {providerNames[endpoint.provider]}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {endpoint.botLabel ??
                    endpoint.providerAccountLabel ??
                    "Provider identity"}
                </p>
              </div>
              <StatusBadge status={endpoint.status} />
              <Button asChild size="sm" variant="outline">
                <Link to={`/apps/chat/${endpoint.id}/settings`}>
                  Open connection <ExternalLink />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
