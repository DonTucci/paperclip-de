import { tf } from "@/i18n/fork";
import type { ReactNode } from "react";
import { ResponsibleUserDenialNotice } from "@/components/ResponsibleUserDenialNotice";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

/**
 * UX lab for PAP-12462 (P7): run "on behalf of {user}" surfacing + responsible-user
 * denial copy. Renders before/after of both surfaces with real design tokens so the
 * states can be captured for UX review. Route: /ux-lab/responsible-user-denial
 */

function LabSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-background/85 p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">{children}</div>
    </section>
  );
}

function BeforeAfter({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-(length:--text-micro) font-semibold uppercase tracking-(--tracking-caps) text-muted-foreground">
        {label}
      </div>
      <Card className="block border-border/60 p-3">{children}</Card>
    </div>
  );
}

/** A faithful copy of a run ledger row header (see IssueRunLedger.tsx). */
function RunLedgerRow({
  onBehalfOf,
  denial,
}: {
  onBehalfOf?: string | null;
  denial?: ReactNode;
}) {
  return (
    <article className="space-y-1.5 rounded-lg border border-border/60 px-3 py-2 text-xs text-muted-foreground">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-medium text-foreground">{tf("text.Run")}</span>
        <span className="min-w-0 max-w-full truncate font-mono text-foreground">a1b2c3d4</span>
        <span>{tf("auto.94596b0a87d85c58")}</span>
        {onBehalfOf ? (
          <span className="min-w-0 max-w-full truncate text-muted-foreground">
            on behalf of <span className="text-foreground">{onBehalfOf}</span>
          </span>
        ) : null}
        <span className="rounded-md border border-border px-1.5 py-0.5 text-(length:--text-micro) capitalize text-muted-foreground">
          {denial ? "Failed" : "Succeeded"}
        </span>
        <span className="ml-auto shrink-0">{tf("auto.35abf1daadea72e6")}</span>
      </div>
      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
        <div className="min-w-0">
          <span className="text-foreground">{tf("auto.a194a68a45d32cab")}</span> 1m 4s
        </div>
        <div className="min-w-0">
          <span className="text-foreground">{tf("auto.72876fff40e86f64")}</span> {tf("auto.35abf1daadea72e6")}
        </div>
        <div className="min-w-0">
          <span className="text-foreground">{tf("text.Stop")}</span> {denial ? "Denied" : "Completed"}
        </div>
      </div>
      {denial}
    </article>
  );
}

/** A faithful copy of the run-detail header identity block (see AgentDetail.tsx RunDetail). */
function RunDetailHeader({ onBehalfOf, denial }: { onBehalfOf?: string | null; denial?: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-foreground">{tf("auto.3ae9d7b10f6c99b4")}</span>
        <span className="rounded-md border border-border px-1.5 py-0.5 text-(length:--text-micro) capitalize text-muted-foreground">
          {denial ? "failed" : "succeeded"}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 font-mono text-(length:--text-micro) text-muted-foreground">
        <span className="rounded bg-muted px-1.5 py-0.5 text-(length:--text-nano) font-medium uppercase tracking-wide">
          {tf("auto.6dde627ef293ca12")}
        </span>
        <span>anthropic/claude-opus-4-8</span>
      </div>
      {onBehalfOf ? (
        <div className="text-xs text-muted-foreground">
          On behalf of <span className="text-foreground">{onBehalfOf}</span>
        </div>
      ) : null}
      {denial}
    </div>
  );
}

export function ResponsibleUserDenialUxLab() {
  return (
    <div className="min-h-screen bg-muted/20 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <div className="text-(length:--text-micro) font-semibold uppercase tracking-(--tracking-caps) text-muted-foreground">
            {tf("auto.a40f42aaa0e458ee")}
          </div>
          <h1 className="mt-1 text-xl font-semibold text-foreground">
            {tf("auto.7bb3b3a16e1bd0ce")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tf("auto.a788a2b563863843")}
          </p>
        </header>

        <LabSection
          title={tf("auto.1a747c3a675d48b0")}
          description={tf("auto.6fad7947202aa011")}
        >
          <BeforeAfter label={tf("auto.10bb7a39a8f3a6b2")}>
            <RunLedgerRow />
          </BeforeAfter>
          <BeforeAfter label={tf("auto.c6d2a4d4b2964150")}>
            <RunLedgerRow onBehalfOf="Ada Lovelace" />
          </BeforeAfter>
          <BeforeAfter label={tf("auto.5d8ed0df48d5f37d")}>
            <RunDetailHeader />
          </BeforeAfter>
          <BeforeAfter label={tf("auto.76680a86453bd4c3")}>
            <RunDetailHeader onBehalfOf="Ada Lovelace" />
          </BeforeAfter>
        </LabSection>

        <LabSection
          title={tf("auto.e4abd6e76fa22c4f")}
          description={tf("auto.cbbe6bd58f10d7d3")}
        >
          <BeforeAfter label={tf("auto.a50af9feb5a7261f")}>
            <div className="text-xs">
              <span className="text-red-600 dark:text-red-400">
                {tf("auto.0d61c3bcf38c8241")}
              </span>
              <span className="ml-1 text-muted-foreground">{tf("auto.fe7ff682d442f88e")}</span>
            </div>
          </BeforeAfter>
          <BeforeAfter label={tf("auto.c81f5479ce3c23d3")}>
            <ResponsibleUserDenialNotice
              code="RESPONSIBLE_USER_UNAUTHORIZED"
              userName="Ada Lovelace"
            />
          </BeforeAfter>
        </LabSection>

        <LabSection
          title={tf("auto.b7c68c5bc59f25aa")}
          description={tf("auto.93ecbf2550236d4f")}
        >
          <BeforeAfter label={tf("auto.051fbeb1d4df05b5")}>
            <div className="text-xs">
              <span className="text-red-600 dark:text-red-400">
                {tf("auto.b7cedffe763f76e0")}
              </span>
              <span className="ml-1 text-muted-foreground">{tf("auto.434198325201cd40")}</span>
            </div>
          </BeforeAfter>
          <BeforeAfter label={tf("auto.71693acbf8bb7e80")}>
            <div className="text-xs text-muted-foreground">
              {tf("auto.03c2f47e9613cc41")}
            </div>
          </BeforeAfter>
        </LabSection>

        <LabSection
          title={tf("auto.230d6a8f9dc96de2")}
          description={tf("auto.a51ed5d74508643e")}
        >
          <BeforeAfter label={tf("auto.a50af9feb5a7261f")}>
            <div className="text-xs">
              <span className="text-red-600 dark:text-red-400">
                {tf("auto.62fd54eb74698710")}
              </span>
              <span className="ml-1 text-muted-foreground">{tf("auto.1a03b80fafc5a3b3")}</span>
            </div>
          </BeforeAfter>
          <BeforeAfter label={tf("auto.c81f5479ce3c23d3")}>
            <ResponsibleUserDenialNotice
              code="RESPONSIBLE_USER_UNAVAILABLE"
              userName="Grace Hopper"
            />
          </BeforeAfter>
        </LabSection>

        <LabSection
          title={tf("auto.518c46bd3f1cfbef")}
          description={tf("auto.c38ac684d4cfcc11")}
        >
          <BeforeAfter label={tf("auto.d089c8a9fc28e4e5")}>
            <RunLedgerRow
              onBehalfOf="Ada Lovelace"
              denial={
                <ResponsibleUserDenialNotice
                  code="RESPONSIBLE_USER_UNAUTHORIZED"
                  userName="Ada Lovelace"
                />
              }
            />
          </BeforeAfter>
          <BeforeAfter label={tf("auto.ca184496974204a0")}>
            <RunLedgerRow
              onBehalfOf="Grace Hopper"
              denial={
                <ResponsibleUserDenialNotice
                  code="RESPONSIBLE_USER_UNAVAILABLE"
                  userName="Grace Hopper"
                />
              }
            />
          </BeforeAfter>
        </LabSection>

        <p className={cn("text-center text-(length:--text-micro) text-muted-foreground")}>
          Copy is sourced from the shared <code>{tf("auto.f7b72724fa9fa846")}</code> contract.
        </p>
      </div>
    </div>
  );
}
