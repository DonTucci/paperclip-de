import { tf } from "@/i18n/fork";
import { AlertTriangle } from "lucide-react";
export function EmailSafetyNotice() {
  return (
    <div
      role="note"
      className="space-y-3 rounded-lg border border-border bg-muted/30 p-4"
    >
      <div className="flex items-start gap-2">
        <AlertTriangle className="size-4 shrink-0 text-(--status-agent-paused)" />
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {tf("auto.850d77abd7ec6462")}
          </p>
          <p className="text-sm text-muted-foreground">
            Incoming email can create tasks and trigger agent work. Set up an
            allowlist in AgentMail to limit who can contact this inbox.
          </p>
          <p className="text-xs text-muted-foreground">
            Paperclip does not verify sender restrictions. AgentMail controls
            new messages and replies separately; check both lists.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <a
          href="https://console.agentmail.to"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          {tf("auto.1d9d67d1ac149a40")}
        </a>
        <a
          href="https://docs.agentmail.to/knowledge-base/allowlists-blocklists"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground underline underline-offset-4"
        >
          {tf("auto.0bf5ad9e26216bfc")}
        </a>
      </div>
    </div>
  );
}
