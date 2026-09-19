import { tf } from "@/i18n/fork";
import { useState } from "react";
import type { Agent } from "@paperclipai/shared";
import { AgentIcon } from "@/components/AgentIconPicker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

export interface AgentChatPickerProps {
  agents: Agent[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (agent: Agent) => void;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function AgentChatPicker({ open, onOpenChange, ...props }: AgentChatPickerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <div className="px-4 pt-4 pb-3">
          <DialogTitle>{tf("auto.73adffe32a9a861c")}</DialogTitle>
        </div>
        {/* The dialog unmounts its content on close, so each search starts empty. */}
        <AgentChatPickerResults {...props} onSelect={(agent) => {
          onOpenChange(false);
          props.onSelect(agent);
        }} />
      </DialogContent>
    </Dialog>
  );
}

function AgentChatPickerResults({ agents, onSelect, loading, error, onRetry }: Omit<AgentChatPickerProps, "open" | "onOpenChange">) {
  const [search, setSearch] = useState("");
  return (
    <Command>
      <CommandInput
        aria-label={tf("auto.e5d13d38a2502fd4")}
        placeholder={tf("auto.ada757655c29db18")}
        value={search}
        onValueChange={setSearch}
      />
      {error ? (
        <div role="alert" className="flex flex-col items-start gap-2 p-4 text-sm">
          <p>{tf("auto.3ca8c8512207be54")}</p>
          {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>{tf("text.Retry")}</Button>}
        </div>
      ) : loading ? (
        <p role="status" className="p-4 text-sm text-muted-foreground">{tf("auto.ae0c1414f42139ce")}</p>
      ) : (
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 px-4">
              <span>{agents.length ? `No agents match “${search}”` : "No agents yet."}</span>
              {agents.length ? <>
                <span className="text-xs text-muted-foreground">{tf("auto.ec1f4d9dde9c1c2c")}</span>
                <Button variant="ghost" size="sm" onClick={() => setSearch("")}>{tf("auto.3b7ea51793e9d906")}</Button>
              </> : <span className="text-xs text-muted-foreground">{tf("auto.8f52c09515e8fc3c")}</span>}
            </div>
          </CommandEmpty>
          <CommandGroup>
            {agents.map((agent) => (
              <CommandItem
                key={agent.id}
                value={agent.id}
                keywords={[agent.name, agent.title ?? "", agent.role]}
                onSelect={() => onSelect(agent)}
                className="gap-3 px-3 py-3"
              >
                <AgentIcon icon={agent.icon} className="size-4 shrink-0" />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-medium">{agent.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{agent.title ?? agent.role}</span>
                </span>
                {agent.status === "paused" && <span className="text-xs text-(--status-agent-paused)">{tf("text.Paused")}</span>}
                {agent.status === "terminated" && <span className="text-xs text-muted-foreground">{tf("status.terminated")}</span>}
                {agent.status === "pending_approval" && <span className="text-xs text-muted-foreground">{tf("auto.ae25c9b1d366d159")}</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
}
