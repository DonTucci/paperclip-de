import { tf } from "@/i18n/fork";
import { useEffect, useId, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ConfigureRailwaySsh, ConnectionGrantsResponse, RailwaySshSetup, ToolConnection } from "@paperclipai/shared";
import { toolsApi } from "@/api/tools";
import { queryKeys } from "@/lib/queryKeys";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function RailwayAccessPanel({ connection, grants }: { connection: ToolConnection; grants?: ConnectionGrantsResponse }) {
  const queryClient = useQueryClient();
  const id = useId();
  const setup = connection.config?.railwaySsh as RailwaySshSetup | null | undefined;
  const owned = (grants?.grants ?? []).filter((grant) => grant.kind !== "user" || grant.subjectUserId === grants?.currentUserId);
  const eligible = owned.filter((grant) => grant.status === "active");
  const [selectedGrant, setSelectedGrant] = useState("");
  const [knownHosts, setKnownHosts] = useState(setup?.knownHosts ?? "");
  useEffect(() => { setKnownHosts(setup?.knownHosts ?? ""); }, [setup?.knownHosts]);
  const grantId = setup?.grantId ?? (selectedGrant || eligible[0]?.id);
  const canConfigure = grants?.capabilities.canConfigure && connection.status === "active" && eligible.some((grant) => grant.id === grantId);
  const canRemove = grants?.capabilities.canConfigure && owned.some((grant) => grant.id === setup?.grantId);
  const mutation = useMutation({
    mutationFn: (input: ConfigureRailwaySsh) => toolsApi.configureRailwaySsh(connection.id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tools.connection(connection.id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.tools.connectionGrants(connection.id) });
    },
  });
  return <section className="space-y-4" aria-labelledby={`${id}-title`}>
    <div className="space-y-2">
      <h2 id={`${id}-title`} className="text-lg font-semibold">{tf("auto.b60e1bb15d4f7b00")}</h2>
      <p className="text-sm text-muted-foreground">
        {typeof connection.config?.railwayApiMessage === "string" ? connection.config?.railwayApiMessage : "Refresh actions after connecting to check service, log, and deployment access."}
      </p>
    </div>
    <div className="space-y-2">
      <h3 className="font-medium">{tf("auto.c77387d45b51b793")}</h3>
      <p className="text-sm text-muted-foreground">To allow Paperclip direct SSH access to Railway containers, you can optionally generate an SSH key pair. <a className="underline" href="https://docs.railway.com/cli/ssh" target="_blank" rel="noreferrer">{tf("auto.b6144c820c19d638")}</a></p>
    </div>
    {!canConfigure && <p className="text-sm text-muted-foreground">{tf("auto.cd2c32b454f794e4")}</p>}
    {(canConfigure || canRemove) && grantId && <>
      {!setup && eligible.length > 1 && <div className="space-y-2">
        <Label htmlFor={`${id}-grant`}>{tf("auto.ca5839e38a15433e")}</Label>
        <select id={`${id}-grant`} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={grantId} onChange={(event) => setSelectedGrant(event.target.value)}>
          {eligible.map((grant) => <option key={grant.id} value={grant.id}>{grant.kind === "organization" ? "Shared account" : grant.kind === "user" ? "My account" : "Agent account"}</option>)}
        </select>
      </div>}
      {!setup && <Button variant="outline" disabled={mutation.isPending} onClick={() => mutation.mutate({ action: "prepare", grantId })}>Generate SSH key pair</Button>}
      {setup && <>
        <div className="space-y-2">
          <Label htmlFor={`${id}-public`}>{tf("auto.4ee252fb736effa2")}</Label>
          <Textarea id={`${id}-public`} readOnly value={setup.publicKey} className="font-mono text-xs" />
          <p className="text-sm text-muted-foreground">Register this public key in the Railway account used by this authorization. The private key stays in Paperclip’s vault. <a className="underline" href="https://docs.railway.com/cli/ssh#manage-ssh-keys" target="_blank" rel="noreferrer">{tf("auto.c078b6c2bf475409")}</a></p>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id}-host`}>{tf("auto.74d7e1c06134e969")}</Label>
          <Textarea id={`${id}-host`} value={knownHosts} onChange={(event) => setKnownHosts(event.target.value)} placeholder={tf("auto.38c969c4ae4d6d9a")} className="font-mono text-xs" />
          <p className="text-sm text-muted-foreground">{tf("auto.f6c5671367f881ab")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button disabled={!canConfigure || mutation.isPending || !knownHosts.trim()} onClick={() => mutation.mutate({ action: "enable", grantId, knownHosts })}>{setup.enabled ? "Update trusted host key" : "Enable container access"}</Button>
          <Button variant="outline" disabled={mutation.isPending} onClick={() => mutation.mutate({ action: "remove", grantId })}>Remove container key</Button>
        </div>
        <p className="text-sm text-muted-foreground">{setup.enabled ? "Container access is enabled for this authorization." : "Register the public key and verify the host key before enabling access."} Removing the key stops new Paperclip connections. Also remove its public key from Railway.</p>
      </>}
    </>}
    {mutation.isError && <p role="alert" className="text-sm text-destructive">{mutation.error instanceof Error ? mutation.error.message: tf("auto.a8d256f59d5e7201")}</p>}
  </section>;
}
