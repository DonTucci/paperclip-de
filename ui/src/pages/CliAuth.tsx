import { tf } from "@/i18n/fork";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams, useSearchParams } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { accessApi } from "../api/access";
import { authApi } from "../api/auth";
import { queryKeys } from "../lib/queryKeys";

export function CliAuthPage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const challengeId = (params.id ?? "").trim();
  const token = (searchParams.get("token") ?? "").trim();
  const currentPath = useMemo(
    () => `/cli-auth/${encodeURIComponent(challengeId)}${token ? `?token=${encodeURIComponent(token)}` : ""}`,
    [challengeId, token],
  );

  const sessionQuery = useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: () => authApi.getSession(),
    retry: false,
  });
  const challengeQuery = useQuery({
    queryKey: ["cli-auth-challenge", challengeId, token],
    queryFn: () => accessApi.getCliAuthChallenge(challengeId, token),
    enabled: challengeId.length > 0 && token.length > 0,
    retry: false,
  });

  const approveMutation = useMutation({
    mutationFn: () => accessApi.approveCliAuthChallenge(challengeId, token),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
      await challengeQuery.refetch();
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => accessApi.cancelCliAuthChallenge(challengeId, token),
    onSuccess: async () => {
      await challengeQuery.refetch();
    },
  });

  if (!challengeId || !token) {
    return <div className="mx-auto max-w-xl py-10 text-sm text-destructive">{tf("auto.528646e315519886")}</div>;
  }

  if (sessionQuery.isLoading || challengeQuery.isLoading) {
    return <div className="mx-auto max-w-xl py-10 text-sm text-muted-foreground">{tf("auto.c2b409b8fd4afdce")}</div>;
  }

  if (challengeQuery.error) {
    return (
      <div className="mx-auto max-w-xl py-10">
        <Card className="block p-6">
          <h1 className="text-lg font-semibold">{tf("auto.0c42ba6c8d9839ff")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {challengeQuery.error instanceof Error ? challengeQuery.error.message: tf("auto.ef7f2fbfba3af9a4")}
          </p>
        </Card>
      </div>
    );
  }

  const challenge = challengeQuery.data;
  if (!challenge) {
    return <div className="mx-auto max-w-xl py-10 text-sm text-destructive">{tf("auto.14e6eaba3bf496c2")}</div>;
  }

  if (challenge.status === "approved") {
    return (
      <div className="mx-auto max-w-xl py-10">
        <Card className="block p-6">
          <h1 className="text-xl font-semibold">{tf("auto.e272a242b66810aa")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {tf("auto.c62ea5b24db4f657")}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Command: <span className="font-mono text-foreground">{challenge.command}</span>
          </p>
        </Card>
      </div>
    );
  }

  if (challenge.status === "cancelled" || challenge.status === "expired") {
    return (
      <div className="mx-auto max-w-xl py-10">
        <Card className="block p-6">
          <h1 className="text-xl font-semibold">
            {challenge.status === "expired" ? "CLI auth challenge expired" : "CLI auth challenge cancelled"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {tf("auto.c79509c42d65a402")}
          </p>
        </Card>
      </div>
    );
  }

  if (challenge.requiresSignIn || !sessionQuery.data) {
    return (
      <div className="mx-auto max-w-xl py-10">
        <Card className="block p-6">
          <h1 className="text-xl font-semibold">{tf("auto.255346f25669fce1")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {tf("auto.da2e72ba2d43d92b")}
          </p>
          <Button asChild className="mt-4">
            <Link to={`/auth?next=${encodeURIComponent(currentPath)}`}>{tf("auto.5d4f5eb117173ca0")}</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl py-10">
      <Card className="block p-6">
        <h1 className="text-xl font-semibold">{tf("auto.4b83de726cedf85d")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {tf("auto.dc7992bf86e79007")}
        </p>

        <div className="mt-5 space-y-3 text-sm">
          <div>
            <div className="text-muted-foreground">{tf("auto.713166971d730f81")}</div>
            <div className="font-mono text-foreground">{challenge.command}</div>
          </div>
          <div>
            <div className="text-muted-foreground">{tf("auto.0c77fe09ab336a3e")}</div>
            <div className="text-foreground">{challenge.clientName ?? "paperclipai cli"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">{tf("auto.823034752058e97b")}</div>
            <div className="text-foreground">
              {challenge.requestedAccess === "instance_admin_required" ? "Instance admin" : "Board"}
            </div>
          </div>
          {challenge.requestedCompanyName && (
            <div>
              <div className="text-muted-foreground">{tf("auto.fd802f754897ff0e")}</div>
              <div className="text-foreground">{challenge.requestedCompanyName}</div>
            </div>
          )}
        </div>

        {(approveMutation.error || cancelMutation.error) && (
          <p className="mt-4 text-sm text-destructive">
            {(approveMutation.error ?? cancelMutation.error) instanceof Error
              ? ((approveMutation.error ?? cancelMutation.error) as Error).message: tf("auto.77e4aece0005efc4")}
          </p>
        )}

        {!challenge.canApprove && (
          <p className="mt-4 text-sm text-destructive">
            {tf("auto.c18f2ad88f41bfe6")}
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <Button
            onClick={() => approveMutation.mutate()}
            disabled={!challenge.canApprove || approveMutation.isPending || cancelMutation.isPending}
          >
            {approveMutation.isPending ? "Approving..." : "Approve CLI access"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => cancelMutation.mutate()}
            disabled={approveMutation.isPending || cancelMutation.isPending}
          >
            {cancelMutation.isPending ? "Cancelling..." : "Cancel"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
