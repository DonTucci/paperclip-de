import { tf } from "@/i18n/fork";
// token-extraction: allowlisted — intentional one-off decoration (DECISION-SHEET.md B1
// user ruling). The bg-[...gradient...] / shadow-[...] literals in this demo/UX-lab page
// are deliberate one-off decoration, reverted from --gradient-extract-*/--shadow-extract-*
// tokens; the file is on the check-token-gates allowlist in ui/src/index.css.
import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SystemNotice } from "@/components/SystemNotice";
import { systemNoticeFixtures } from "@/fixtures/systemNoticeFixtures";
import { cn } from "@/lib/utils";
import {
  CircleDashed,
  FlaskConical,
  Layers,
  ListChecks,
  Sparkles,
} from "lucide-react";

function LabSection({
  id,
  eyebrow,
  title,
  description,
  accentClassName,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  accentClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "rounded-(--rad-28) border border-border/70 bg-background/85 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-5",
        accentClassName,
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-(length:--text-micro) font-semibold uppercase tracking-(--tracking-caps) text-muted-foreground">
            {eyebrow}
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function FixtureFrame({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-(length:--text-micro) font-semibold uppercase tracking-(--tracking-eyebrow) text-muted-foreground">
        <CircleDashed className="h-3.5 w-3.5" />
        {caption}
      </div>
      {children}
    </div>
  );
}

function MockUserBubble({
  authorName,
  body,
  alignEnd,
}: {
  authorName: string;
  body: string;
  alignEnd?: boolean;
}) {
  return (
    <div className={cn("flex items-start gap-2.5", alignEnd && "justify-end")}>
      {!alignEnd ? (
        <Avatar size="sm" className="shrink-0">
          <AvatarFallback>{authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ) : null}
      <div className={cn("flex min-w-0 max-w-(--pct-85) flex-col", alignEnd && "items-end")}>
        <div
          className={cn(
            "mb-1 px-1 text-sm font-medium text-foreground",
            alignEnd ? "text-right" : "text-left",
          )}
        >
          {authorName}
        </div>
        <div className="min-w-0 max-w-full rounded-2xl bg-muted px-4 py-2.5 text-sm leading-6 text-foreground">
          {body}
        </div>
      </div>
      {alignEnd ? (
        <Avatar size="sm" className="shrink-0">
          <AvatarFallback>{authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ) : null}
    </div>
  );
}

function MockAgentBubble({ agentName, body }: { agentName: string; body: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Avatar size="sm" className="shrink-0">
        <AvatarFallback>{agentName.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 max-w-(--pct-85) flex-col">
        <div className="mb-1 px-1 text-sm font-medium text-foreground">{agentName}</div>
        <div className="min-w-0 max-w-full rounded-2xl border border-border/70 bg-background px-4 py-2.5 text-sm leading-6 text-foreground">
          {body}
        </div>
      </div>
    </div>
  );
}

const checklist = [
  "One container per system notice — no nested chat bubble",
  "Tone communicated by icon + label, never color alone",
  "Operational evidence hidden behind Details, expanded only on demand",
  "Issue, agent, and run metadata render as typed link rows, not raw markdown",
  "Hierarchy visibly distinct from user (right-aligned) and agent (left-aligned) bubbles",
];

export function SystemNoticeUxLab() {
  const fixtureById = new Map(systemNoticeFixtures.map((f) => [f.id, f] as const));

  const warningCollapsed = fixtureById.get("warning-collapsed")!;
  const warningExpanded = fixtureById.get("warning-expanded")!;
  const dangerCollapsed = fixtureById.get("danger-collapsed")!;
  const dangerExpanded = fixtureById.get("danger-expanded")!;
  const neutralCollapsed = fixtureById.get("neutral-collapsed")!;
  const neutralExpanded = fixtureById.get("neutral-expanded")!;
  const warningNoDetails = fixtureById.get("warning-no-details")!;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-(--rad-32) border border-border/70 bg-[linear-gradient(135deg,rgba(245,158,11,0.10),transparent_28%),linear-gradient(180deg,rgba(8,145,178,0.08),transparent_44%),var(--background)] shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
        <div className="grid gap-6 lg:grid-cols-(--gtc-39)">
          <div className="p-6 sm:p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/[0.08] px-3 py-1 text-(length:--text-nano) font-semibold uppercase tracking-(--tracking-caps) text-amber-700 dark:text-amber-300">
              <FlaskConical className="h-3.5 w-3.5" />
              {tf("auto.5d7cd015976ce03c")}
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {tf("auto.cd72c6b9f785bed4")}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Replaces the current pattern where a Paperclip-authored warning renders inside a user-style
              chat bubble. The notice is one container, system-styled, with hidden-by-default operational
              metadata. Tone is conveyed by icon, label, and color together so it stays accessible.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-(length:--text-nano) uppercase tracking-(--tracking-caps)">
                {tf("auto.5761270252592cf0")}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-(length:--text-nano) uppercase tracking-(--tracking-caps)">
                {tf("auto.b918e383e1f7e544")}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-(length:--text-nano) uppercase tracking-(--tracking-caps)">
                {tf("auto.2752da2061913d6f")}
              </Badge>
            </div>
          </div>

          <aside className="border-t border-border/60 bg-background/70 p-6 lg:border-l lg:border-t-0">
            <div className="mb-4 flex items-center gap-2 text-(length:--text-micro) font-semibold uppercase tracking-(--tracking-caps) text-muted-foreground">
              <ListChecks className="h-4 w-4 text-amber-700 dark:text-amber-300" />
              {tf("auto.61894cfc27906433")}
            </div>
            <div className="space-y-3">
              {checklist.map((line) => (
                <div
                  key={line}
                  className="rounded-2xl border border-border/70 bg-background/85 px-4 py-3 text-sm text-muted-foreground"
                >
                  {line}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <LabSection
        id="tones"
        eyebrow="Tone matrix"
        title={tf("auto.3a3b08ac8810be1b")}
        description={tf("auto.e23307caac8db5ba")}
        accentClassName="bg-[linear-gradient(180deg,rgba(245,158,11,0.05),transparent_28%),var(--background)]"
      >
        <div className="space-y-5">
          <FixtureFrame caption={warningCollapsed.caption}>
            <SystemNotice {...warningCollapsed} />
          </FixtureFrame>
          <FixtureFrame caption={warningExpanded.caption}>
            <SystemNotice {...warningExpanded} />
          </FixtureFrame>
          <FixtureFrame caption={dangerCollapsed.caption}>
            <SystemNotice {...dangerCollapsed} />
          </FixtureFrame>
          <FixtureFrame caption={dangerExpanded.caption}>
            <SystemNotice {...dangerExpanded} />
          </FixtureFrame>
          <FixtureFrame caption={neutralCollapsed.caption}>
            <SystemNotice {...neutralCollapsed} />
          </FixtureFrame>
          <FixtureFrame caption={neutralExpanded.caption}>
            <SystemNotice {...neutralExpanded} />
          </FixtureFrame>
          <FixtureFrame caption={warningNoDetails.caption}>
            <SystemNotice {...warningNoDetails} />
          </FixtureFrame>
        </div>
      </LabSection>

      <LabSection
        id="hierarchy"
        eyebrow="Hierarchy in thread"
        title={tf("auto.0b63fb91d05f2754")}
        description={tf("auto.3522305c7fbdd881")}
        accentClassName="bg-[linear-gradient(180deg,rgba(8,145,178,0.05),transparent_28%),var(--background)]"
      >
        <div className="space-y-4 rounded-2xl border border-border/70 bg-background/70 p-4">
          <MockUserBubble
            authorName="Riley Board"
            body="Why does this issue keep waking back up without a clear next step?"
            alignEnd
          />
          <MockAgentBubble
            agentName="CodexCoder"
            body="The previous run completed without picking a disposition. I'll wait for the new system notice to surface so the recovery owner is unambiguous."
          />
          <SystemNotice
            tone="danger"
            label={tf("auto.2b1c663ea2e661f4")}
            source={{ label: tf("auto.c34c3f7368649659"), href: "/PAP/agents" }}
            timestamp="2026-05-04T16:48:00.000Z"
            body="Paperclip could not resolve this issue's missing disposition automatically. The source assignment is unchanged and a board decision is required."
            metadata={[
              {
                title: tf("auto.27c6c04ca0373d41"),
                rows: [
                  {
                    kind: "issue",
                    label: tf("auto.52e3934387e3259f"),
                    identifier: "PAP-3440",
                    href: "/PAP/issues/PAP-3440",
                    title: tf("auto.4531b97c990fd41c"),
                  },
                  {
                    kind: "agent",
                    label: tf("text.Owner"),
                    name: "CTO",
                    href: "/PAP/agents/cto",
                  },
                ],
              },
              {
                title: tf("auto.96767cbe73673706"),
                rows: [
                  {
                    kind: "run",
                    label: tf("auto.bb84312ee41d3ebc"),
                    runId: "9cdba892-c7ca-4d93-8604-4843873b127c",
                    href: "/PAP/agents/codexcoder/runs/9cdba892-c7ca-4d93-8604-4843873b127c",
                    status: "succeeded",
                  },
                ],
              },
            ]}
          />
          <MockUserBubble
            authorName="Riley Board"
            body="Thanks — assigning the recovery owner now."
            alignEnd
          />
        </div>
      </LabSection>

      <div className="grid gap-5 xl:grid-cols-2">
        <LabSection
          eyebrow="Before"
          title={tf("auto.bc7b7e9b131b2a84")}
          description={tf("auto.16e2fcb5c39cc0c5")}
          accentClassName="bg-[linear-gradient(180deg,rgba(244,63,94,0.05),transparent_28%),var(--background)]"
        >
          <div className="space-y-3 rounded-2xl border border-border/70 bg-background/70 p-4">
            <div className="flex items-start gap-2.5">
              <Avatar size="sm" className="shrink-0">
                <AvatarFallback>{tf("auto.b29e5ad5fc481927")}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 max-w-(--pct-85) flex-col">
                <div className="mb-1 px-1 text-sm font-medium text-foreground">{tf("auto.08b041935798fbf6")}</div>
                <div className="min-w-0 max-w-full rounded-2xl bg-muted px-4 py-2.5 text-sm leading-6 text-foreground">
                  <div className="rounded-md border border-red-500/35 bg-red-500/10 px-3 py-2.5 text-sm text-red-950 dark:text-red-100">
                    <div className="flex items-start gap-2">
                      <Sparkles className="mt-1 h-4 w-4 shrink-0 text-red-600 dark:text-red-300" />
                      <div className="min-w-0">
                        <p className="m-0 font-semibold">{tf("auto.95f02cf431b4f380")}</p>
                        <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-(length:--text-compact) leading-5">
                          <li>{tf("auto.18be769da4b6e313")}</li>
                          <li>{tf("auto.6df60a080e6e7df5")}</li>
                          <li>{tf("auto.76de5a04109f84c9")}</li>
                          <li>{tf("auto.1d9d9ecb90b5adc1")}</li>
                          <li>{tf("auto.a8f9afd5dc89ddf7")}</li>
                          <li>{tf("auto.4dd4c6bd8e916e89")}</li>
                          <li>{tf("auto.04182b15548d970e")}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="px-1 text-xs text-muted-foreground">
              Author reads as <span className="font-medium text-foreground">{tf("auto.08b041935798fbf6")}</span> even though the
              author is the Paperclip system. Two containers stack the warning inside a user-style
              bubble, and operational evidence is always visible.
            </p>
          </div>
        </LabSection>

        <LabSection
          eyebrow="After"
          title={tf("auto.3eae843c6cc22fe5")}
          description={tf("auto.75815629609d028f")}
          accentClassName="bg-[linear-gradient(180deg,rgba(16,185,129,0.05),transparent_28%),var(--background)]"
        >
          <div className="space-y-3 rounded-2xl border border-border/70 bg-background/70 p-4">
            <SystemNotice {...dangerCollapsed} />
            <p className="px-1 text-xs text-muted-foreground">
              Same content. The visible body is one short system sentence; reviewers expand{" "}
              <span className="font-medium text-foreground">{tf("text.Details")}</span> only when they need run
              evidence. Tone is reinforced by the octagon icon and the &quot;System alert&quot; label,
              not just red.
            </p>
          </div>
        </LabSection>
      </div>

      <Card className="gap-4 border-border/70 bg-background/85 py-0">
        <CardHeader className="px-5 pt-5 pb-0">
          <div className="flex items-center gap-2 text-(length:--text-micro) font-semibold uppercase tracking-(--tracking-caps) text-muted-foreground">
            <Layers className="h-4 w-4 text-amber-700 dark:text-amber-300" />
            {tf("auto.e853f3780cad3f3d")}
          </div>
          <CardTitle className="text-lg">{tf("auto.c294c924b5c41639")}</CardTitle>
          <CardDescription>
            {tf("auto.4ae5dc226f98f532")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 px-5 pb-5 pt-0 text-sm text-muted-foreground">
          <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
            <div className="mb-1 font-medium text-foreground">{tf("auto.ce54f0e22dbb39de")}</div>
            Use <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{`<SystemNotice />`}</code>{" "}
            from <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">@/components/SystemNotice</code>.
            It accepts <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{tf("auto.00cf4ce3935c8a60")}</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{tf("auto.1aca80e8b55c802f")}</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{tf("auto.230d8358dc8e8890")}</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{tf("auto.45447b7afbd5e544")}</code>, and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{tf("auto.97b1b0c95a7ed313")}</code>.
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
            <div className="mb-1 font-medium text-foreground">{tf("auto.cce8033811a53299")}</div>
            Comments where{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">authorType === &quot;system&quot;</code>{" "}
            or{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">presentation.kind === &quot;system_notice&quot;</code>{" "}
            should render as a SystemNotice row at full content width — never inside an{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{tf("auto.3208ea5871af14e3")}</code>{" "}
            or assistant bubble.
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
            <div className="mb-1 font-medium text-foreground">{tf("auto.d3368cbffe23c98d")}</div>
            The Details button has{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{tf("auto.3e9cf9b3cf3ee226")}</code>{" "}
            and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{tf("auto.65f93da8a16160c6")}</code>{" "}
            wired to the panel id. The container exposes{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{tf("auto.5eb5ce93f3546513")}</code>{" "}
            and an{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{tf("auto.66ba2129a90d4a58")}</code>{" "}
            equal to the visible tone label so screen readers announce tone with text.
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
            <div className="mb-1 font-medium text-foreground">{tf("auto.51f2b6ea2e4ddef4")}</div>
            Existing comments without{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{tf("auto.bfac314fefdc0745")}</code>{" "}
            keep rendering through the current{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{tf("auto.3ebbccee0d8353b1")}</code>{" "}
            string-detector. The new contract is opt-in for the system generators in Phase 5.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SystemNoticeUxLab;
