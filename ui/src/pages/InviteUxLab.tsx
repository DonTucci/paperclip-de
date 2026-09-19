import { tf } from "@/i18n/fork";
// token-extraction: allowlisted — intentional one-off decoration (DECISION-SHEET.md B1
// user ruling). The bg-[...gradient...] / shadow-[...] literals in this demo/UX-lab page
// are deliberate one-off decoration, reverted from --gradient-extract-*/--shadow-extract-*
// tokens; the file is on the check-token-gates allowlist in ui/src/index.css.
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyPatternIcon } from "@/components/CompanyPatternIcon";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Check,
  Clock3,
  ExternalLink,
  FlaskConical,
  KeyRound,
  Link2,
  Loader2,
  MailPlus,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

const inviteRoleOptions = [
  {
    value: "viewer",
    label: tf("auto.678bfa6af48b17cd"),
    description: tf("auto.c0074ebb95a9e2a0"),
    gets: "View-only organization membership.",
  },
  {
    value: "operator",
    label: tf("auto.291101a07fe980e9"),
    description: tf("auto.2090f335caf02911"),
    gets: "Can assign tasks.",
  },
  {
    value: "admin",
    label: tf("auto.c1c224b03cd9bc7b"),
    description: tf("auto.508b27fb468c1743"),
    gets: "Can create agents, invite users, assign tasks, and approve join requests.",
  },
  {
    value: "owner",
    label: tf("text.Owner"),
    description: tf("auto.050eacd9817fac07"),
    gets: "Everything in Admin, plus managing members.",
  },
] as const;

const inviteHistory = [
  {
    id: "invite-active",
    state: "Active",
    humanRole: "operator",
    invitedBy: "Board User 25",
    email: "board25@paperclip.local",
    createdAt: "Apr 25, 2026, 9:00 AM",
    action: "Revoke",
    relatedLabel: "Review request",
  },
  {
    id: "invite-accepted",
    state: "Accepted",
    humanRole: "viewer",
    invitedBy: "Board User 24",
    email: "board24@paperclip.local",
    createdAt: "Apr 24, 2026, 8:15 AM",
    action: "Inactive",
    relatedLabel: "—",
  },
  {
    id: "invite-revoked",
    state: "Revoked",
    humanRole: "admin",
    invitedBy: "Board User 20",
    email: "board20@paperclip.local",
    createdAt: "Apr 20, 2026, 2:45 PM",
    action: "Inactive",
    relatedLabel: "—",
  },
  {
    id: "invite-expired",
    state: "Expired",
    humanRole: "owner",
    invitedBy: "Board User 19",
    email: "board19@paperclip.local",
    createdAt: "Apr 19, 2026, 7:10 PM",
    action: "Inactive",
    relatedLabel: "—",
  },
] as const;

const fieldClassName =
  "w-full border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500";
const panelClassName = "border border-zinc-800 bg-zinc-950/95 p-6";

function LabSection({
  eyebrow,
  title,
  description,
  accentClassName,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accentClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-(--rad-28) border border-border/70 bg-background/80 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-5",
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

function StatusCard({
  icon,
  title,
  body,
  tone = "default",
}: {
  icon: ReactNode;
  title: string;
  body: string;
  tone?: "default" | "warn" | "success" | "error";
}) {
  const toneClassName = {
    default: "border-border/70 bg-background/85",
    warn: "border-amber-400/40 bg-amber-500/[0.08]",
    success: "border-emerald-400/40 bg-emerald-500/[0.08]",
    error: "border-rose-400/40 bg-rose-500/[0.08]",
  }[tone];

  return (
    <Card className={cn("rounded-(--rad-24) shadow-none", toneClassName)}>
      <CardHeader className="space-y-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-current/10 bg-background/70 text-muted-foreground">
          {icon}
        </div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="mt-2 text-sm leading-6">{body}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}

function InviteLandingShell({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-(--rad-28) border border-zinc-800 bg-zinc-950 shadow-[0_30px_80px_rgba(2,6,23,0.55)]">
      <div className="grid gap-px bg-zinc-800 lg:grid-cols-(--gtc-37)">
        <section className={cn(panelClassName, "space-y-6 bg-zinc-950")}>{left}</section>
        <section className={cn(panelClassName, "h-full bg-zinc-950")}>{right}</section>
      </div>
    </div>
  );
}

function InviteSummaryPanel({
  title,
  description,
  inviteMessage,
  requestedAccess,
  signedInLabel,
}: {
  title: string;
  description: string;
  inviteMessage?: string;
  requestedAccess: string;
  signedInLabel?: string;
}) {
  return (
    <>
      <div className="flex items-start gap-4">
        <CompanyPatternIcon
          companyName="Acme Robotics"
          logoUrl="/api/invites/pcp_invite_test/logo"
          className="h-16 w-16 rounded-none border border-zinc-800"
        />
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-(--tracking-caps) text-zinc-500">{tf("auto.4ec1c2d37128b0fb")}</p>
          <h3 className="mt-2 text-2xl font-semibold text-zinc-100">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">{description}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <MetaCard label={tf("text.Organization")} value="Acme Robotics" />
        <MetaCard label={tf("auto.c7a6f15607da6325")} value="Board User" />
        <MetaCard label={tf("auto.823034752058e97b")} value={requestedAccess} />
        <MetaCard label={tf("auto.2a91147eb97459bb")} value="Mar 7, 2027" />
      </div>

      {inviteMessage ? (
        <div className="border border-amber-500/40 bg-amber-500/10 p-4">
          <div className="text-xs uppercase tracking-(--tracking-caps) text-amber-200/80">{tf("auto.7a1ef6877a4c73a0")}</div>
          <p className="mt-2 text-sm leading-6 text-amber-50">{inviteMessage}</p>
        </div>
      ) : null}

      {signedInLabel ? (
        <div className="border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-50">
          Signed in as <span className="font-medium">{signedInLabel}</span>.
        </div>
      ) : null}
    </>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-zinc-800 p-3">
      <div className="text-xs uppercase tracking-(--tracking-caps) text-zinc-500">{label}</div>
      <div className="mt-1 text-sm text-zinc-100">{value}</div>
    </div>
  );
}

function InlineAuthPreview({
  mode,
  feedback,
  working,
}: {
  mode: "sign_up" | "sign_in";
  feedback?: { tone: "info" | "error"; text: string };
  working?: boolean;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100">
          {mode === "sign_up" ? "Create your account" : "Sign in to continue"}
        </h3>
        <p className="mt-1 text-sm text-zinc-400">
          {mode === "sign_up"
            ? "Start with a Paperclip account. After that, you'll come right back here to accept the invite for Acme Robotics."
            : "Use the Paperclip account that already matches this invite. If you do not have one yet, switch back to create account."}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className={cn(
            "flex-1 border px-3 py-2 text-sm transition-colors",
            mode === "sign_up"
              ? "border-zinc-100 bg-zinc-100 text-zinc-950"
              : "border-zinc-800 text-zinc-300 hover:border-zinc-600",
          )}
        >
          {tf("auto.798ca2ce18bf2038")}
        </button>
        <button
          type="button"
          className={cn(
            "flex-1 border px-3 py-2 text-sm transition-colors",
            mode === "sign_in"
              ? "border-zinc-100 bg-zinc-100 text-zinc-950"
              : "border-zinc-800 text-zinc-300 hover:border-zinc-600",
          )}
        >
          {tf("auto.869751325dc800ad")}
        </button>
      </div>

      <form className="space-y-4">
        {mode === "sign_up" ? (
          <label className="block text-sm">
            <span className="mb-1 block text-zinc-400">{tf("text.Name")}</span>
            <input name="name" className={fieldClassName} defaultValue="Jane Example" readOnly />
          </label>
        ) : null}
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">{tf("text.Email")}</span>
          <input name="email" type="email" className={fieldClassName} defaultValue="jane@example.com" readOnly />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">{tf("text.Password")}</span>
          <input name="password" type="password" className={fieldClassName} defaultValue="supersecret" readOnly />
        </label>
        {feedback ? (
          <p className={cn("text-xs", feedback.tone === "info" ? "text-amber-300" : "text-red-400")}>
            {feedback.text}
          </p>
        ) : null}
        <Button type="button" className="w-full rounded-none" disabled={working}>
          {working ? "Working..." : mode === "sign_in" ? "Sign in and continue" : "Create account and continue"}
        </Button>
      </form>

      <p className="text-xs leading-5 text-zinc-500">
        {mode === "sign_up"
          ? "Already signed up before? Use the existing-account option instead so the invite lands on the right Paperclip user."
          : "No account yet? Switch back to create account so you can accept the invite with a new login."}
      </p>
    </div>
  );
}

function AgentRequestPreview() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100">{tf("auto.aeeee10bc6c4cdf3")}</h3>
        <p className="mt-1 text-sm text-zinc-400">
          {tf("auto.5d33053d524c641b")}
        </p>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block text-zinc-400">{tf("auto.1cfb21871a035769")}</span>
        <input className={fieldClassName} defaultValue="Acme Ops Agent" readOnly />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-zinc-400">{tf("auto.03298f6641cee814")}</span>
        <select className={fieldClassName} defaultValue="codex_local" disabled>
          <option value="codex_local">{tf("auto.616efbe96852d8c9")}</option>
          <option value="claude_local">{tf("auto.246ef8c1130d56f5")}</option>
          <option value="cursor">{tf("auto.2c014f8f8986f1b2")}</option>
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-zinc-400">{tf("text.Capabilities")}</span>
        <textarea
          className={fieldClassName}
          rows={4}
          defaultValue="Reviews invites, triages requests, and keeps the board queue moving."
          readOnly
        />
      </label>
      <Button type="button" className="w-full rounded-none">
        {tf("auto.917e144e4bc3da89")}
      </Button>
    </div>
  );
}

function AcceptInvitePreview({
  autoAccept,
  isCurrentMember,
  error,
}: {
  autoAccept?: boolean;
  isCurrentMember?: boolean;
  error?: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100">{tf("auto.6bc71342194effd3")}</h3>
        <p className="mt-1 text-sm text-zinc-400">
          {autoAccept
            ? "Granting your access to Acme Robotics."
            : isCurrentMember
              ? "This account already belongs to Acme Robotics."
              : "This will grant or complete your access to Acme Robotics."}
        </p>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      {autoAccept ? (
        <div className="text-sm text-zinc-400">{tf("auto.20eef59e4d34bc2f")}</div>
      ) : (
        <Button type="button" className="w-full rounded-none" disabled={isCurrentMember}>
          {tf("auto.5e3f840e27ba77d8")}
        </Button>
      )}
    </div>
  );
}

function InviteResultPreview({
  title,
  description,
  claimSecret,
  onboardingTextUrl,
  joinedNow = false,
}: {
  title: string;
  description: string;
  claimSecret?: string;
  onboardingTextUrl?: string;
  joinedNow?: boolean;
}) {
  return (
    <div className="mx-auto max-w-md border border-zinc-800 bg-zinc-950 p-6 text-zinc-100">
      <div className="flex items-center gap-3">
        <CompanyPatternIcon
          companyName="Acme Robotics"
          logoUrl="/api/invites/pcp_invite_test/logo"
          className="h-12 w-12 rounded-none border border-zinc-800"
        />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        <p className="text-sm text-zinc-400">{description}</p>
        {joinedNow ? (
          <Button type="button" className="w-full rounded-none">
            {tf("auto.673ae8242de169d3")}
          </Button>
        ) : (
          <>
            <div className="border border-zinc-800 p-3">
              <p className="mb-1 text-xs text-zinc-500">{tf("auto.ea630b313366030a")}</p>
              <a className="text-sm text-zinc-200 underline underline-offset-2" href="/company/settings/members">
                {tf("auto.790e2ba9f13bc6a7")}
              </a>
            </div>
            <p className="text-xs text-zinc-500">
              {tf("auto.202163eb35319b8d")}
            </p>
          </>
        )}
        {claimSecret ? (
          <div className="space-y-1 border border-zinc-800 p-3 text-xs text-zinc-400">
            <div className="text-zinc-200">{tf("auto.97a5b1cdc7ff2e49")}</div>
            <div className="font-mono break-all">{claimSecret}</div>
            <div className="font-mono break-all">{tf("auto.a64f024f4a7085e9")}</div>
          </div>
        ) : null}
        {onboardingTextUrl ? (
          <div className="text-xs text-zinc-400">
            Onboarding: <span className="font-mono break-all">{onboardingTextUrl}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AuthScreenPreview({ mode, error }: { mode: "sign_in" | "sign_up"; error?: string }) {
  return (
    <div className="overflow-hidden rounded-(--rad-28) border border-border/70 bg-background shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="grid gap-px bg-border/60 md:grid-cols-2">
        <div className="flex min-h-(--sz-420px) flex-col justify-center bg-background px-8 py-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{tf("auto.c34c3f7368649659")}</span>
            </div>
            <h3 className="text-xl font-semibold">
              {mode === "sign_in" ? "Sign in to Paperclip" : "Create your Paperclip account"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "sign_in"
                ? "Use your email and password to access this instance."
                : "Create an account for this instance. Email confirmation is not required in v1."}
            </p>
            <div className="mt-6 space-y-4">
              {mode === "sign_up" ? (
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">{tf("text.Name")}</span>
                  <input
                    className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
                    defaultValue="Jane Example"
                    readOnly
                  />
                </label>
              ) : null}
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{tf("text.Email")}</span>
                <input
                  className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
                  defaultValue="jane@example.com"
                  readOnly
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{tf("text.Password")}</span>
                <input
                  className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
                  defaultValue="supersecret"
                  readOnly
                />
              </label>
              {error ? <p className="text-xs text-destructive">{error}</p> : null}
              <Button type="button" className="w-full">
                {mode === "sign_in" ? "Sign In" : "Create Account"}
              </Button>
            </div>
            <div className="mt-5 text-sm text-muted-foreground">
              {mode === "sign_in" ? "Need an account?" : "Already have an account?"}{" "}
              <span className="font-medium text-foreground underline underline-offset-2">
                {mode === "sign_in" ? "Create one" : "Sign in"}
              </span>
            </div>
          </div>
        </div>
        <div className="hidden min-h-(--sz-420px) items-center justify-center bg-[radial-gradient(circle_at_top,rgba(8,145,178,0.18),transparent_48%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,1))] px-8 py-10 md:flex">
          <div className="max-w-sm space-y-4 text-zinc-200">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/[0.08] px-3 py-1 text-(length:--text-nano) uppercase tracking-(--tracking-caps) text-cyan-200">
              {tf("auto.cd8d229e2b0c5256")}
            </div>
            <div className="text-2xl font-semibold">{tf("auto.452317dffe672c95")}</div>
            <p className="text-sm leading-6 text-zinc-400">
              {tf("auto.69b54ce9ed61c8ca")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanyInvitesPreview() {
  return (
    <div className="grid gap-5 xl:grid-cols-(--gtc-38)">
      <Card className="rounded-(--rad-28) shadow-none">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MailPlus className="h-4 w-4" />
            {tf("auto.9a3fb1f87b9eeb32")}
          </div>
          <div>
            <CardTitle>{tf("auto.9f395b8f6e6bac1c")}</CardTitle>
            <CardDescription className="mt-2">
              {tf("auto.dd31c56fa8afb739")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">{tf("auto.a49c49b04c4db041")}</legend>
            <div className="rounded-2xl border border-border">
              {inviteRoleOptions.map((option, index) => (
                <label
                  key={option.value}
                  className={cn("flex cursor-default gap-3 px-4 py-4", index > 0 && "border-t border-border")}
                >
                  <input
                    type="radio"
                    readOnly
                    checked={option.value === "operator"}
                    className="mt-1 h-4 w-4 border-border text-foreground"
                  />
                  <span className="min-w-0 space-y-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{option.label}</span>
                      {option.value === "operator" ? (
                        <Badge variant="outline" className="border-border text-muted-foreground">
                          {tf("text.Default")}
                        </Badge>
                      ) : null}
                    </span>
                    <span className="block max-w-2xl text-sm text-muted-foreground">{option.description}</span>
                    <span className="block text-sm text-foreground">{option.gets}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground">
            {tf("auto.879640378d52e078")}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button">{tf("auto.9f395b8f6e6bac1c")}</Button>
            <span className="text-sm text-muted-foreground">{tf("auto.030769230dd5036b")}</span>
          </div>

          <div className="space-y-3 rounded-2xl border border-border px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">{tf("auto.ee47fab1ca3c2865")}</div>
                <div className="text-sm text-muted-foreground">
                  {tf("auto.3bad0330adbc296f")}
                </div>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
                <Check className="h-3.5 w-3.5" />
                {tf("text.Copied")}
              </div>
            </div>
            <button
              type="button"
              className="w-full rounded-md border border-border bg-muted/60 px-3 py-2 text-left text-sm break-all"
            >
              https://paperclip.local/invite/new-token
            </button>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline">
                <ExternalLink className="h-4 w-4" />
                {tf("auto.f2018a34e6c375fd")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-(--rad-28) shadow-none">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>{tf("auto.0269fea65ff5e59e")}</CardTitle>
              <CardDescription className="mt-2">
                {tf("auto.5844b5dafc44b13c")}
              </CardDescription>
            </div>
            <a href="/inbox/requests" className="text-sm underline underline-offset-4">
              {tf("auto.3f3aa696e2b98cc0")}
            </a>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 font-medium text-muted-foreground">{tf("auto.a3b50c476732c740")}</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">{tf("text.Role")}</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">{tf("auto.c7a6f15607da6325")}</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">{tf("text.Created")}</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">{tf("auto.d7d9cd19632538b7")}</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">{tf("auto.64cff1319d2fd2cb")}</th>
                </tr>
              </thead>
              <tbody>
                {inviteHistory.map((invite) => (
                  <tr key={invite.id} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3 align-top">
                      <Badge variant="outline" className="border-border text-muted-foreground">
                        {invite.state}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 align-top">{invite.humanRole}</td>
                    <td className="px-5 py-3 align-top">
                      <div>{invite.invitedBy}</div>
                      <div className="text-xs text-muted-foreground">{invite.email}</div>
                    </td>
                    <td className="px-5 py-3 align-top text-muted-foreground">{invite.createdAt}</td>
                    <td className="px-5 py-3 align-top">
                      {invite.relatedLabel === "Review request" ? (
                        <a href="/inbox/requests" className="underline underline-offset-4">
                          {invite.relatedLabel}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">{invite.relatedLabel}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right align-top">
                      {invite.action === "Revoke" ? (
                        <Button type="button" size="sm" variant="outline">
                          {tf("auto.87e6d00bbf53ec5a")}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">{tf("auto.ac7c949f1211b781")}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-border p-4">
              <div className="text-sm font-medium">{tf("auto.4639af997ddb2a6d")}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                {tf("auto.c20447f4073b9b59")}
              </div>
            </div>
            <div className="rounded-2xl border border-rose-400/40 bg-rose-500/[0.07] p-4">
              <div className="text-sm font-medium text-foreground">{tf("auto.56ac4aeb57d5bf6c")}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                {tf("auto.e61b97198c4be1b2")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function InviteUxLab() {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-(--rad-32) border border-border/70 bg-[linear-gradient(135deg,rgba(8,145,178,0.10),transparent_28%),linear-gradient(180deg,rgba(245,158,11,0.10),transparent_44%),var(--background)] shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
        <div className="grid gap-6 lg:grid-cols-(--gtc-39)">
          <div className="p-6 sm:p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/[0.08] px-3 py-1 text-(length:--text-nano) font-semibold uppercase tracking-(--tracking-caps) text-cyan-700 dark:text-cyan-300">
              <FlaskConical className="h-3.5 w-3.5" />
              {tf("auto.0e9b88f6ea84affe")}
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">{tf("auto.13f14e40ad4524d5")}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              {tf("auto.dc4a122d21a948a1")}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-(length:--text-nano) uppercase tracking-(--tracking-caps)">
                /tests/ux/invites
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-(length:--text-nano) uppercase tracking-(--tracking-caps)">
                {tf("auto.bef464b78d1bfbbe")}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-(length:--text-nano) uppercase tracking-(--tracking-caps)">
                {tf("auto.b57c228849c38ac2")}
              </Badge>
            </div>
          </div>

          <aside className="border-t border-border/60 bg-background/70 p-6 lg:border-l lg:border-t-0">
            <div className="mb-4 text-(length:--text-micro) font-semibold uppercase tracking-(--tracking-caps) text-muted-foreground">
              {tf("auto.0e6b1d07913bc5d2")}
            </div>
            <div className="space-y-3">
              {[
                "Invite loading, access-check, missing-token, and unavailable states",
                "Inline account creation and sign-in variants, including feedback/error copy",
                "Human accept, agent request, and auto-accept transitions",
                "Pending approval, joined-now, claim secret, and onboarding result screens",
                "Organization invite creation, copied-link, history, empty, and permission-error states",
              ].map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-2xl border border-border/70 bg-background/85 px-4 py-3 text-sm text-muted-foreground"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <LabSection
        eyebrow="Top-level states"
        title={tf("auto.a1f8df69fdc2e4c3")}
        description={tf("auto.268cf5eede59057e")}
        accentClassName="bg-[linear-gradient(180deg,rgba(59,130,246,0.05),transparent_30%),var(--background)]"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatusCard
            icon={<Loader2 className="h-4 w-4 animate-spin" />}
            title={tf("auto.bf6ade8740bea8a0")}
            body="Shown while invite summary, deployment mode, or auth session data is still loading."
          />
          <StatusCard
            icon={<Clock3 className="h-4 w-4" />}
            title={tf("auto.d788caa307df5516")}
            body="Shown after sign-in while the app verifies whether the current user already belongs to the invited organization."
          />
          <StatusCard
            icon={<KeyRound className="h-4 w-4" />}
            title={tf("auto.1bc93e4d468e95f7")}
            body="The token is missing entirely, so the page short-circuits before any invite lookup."
            tone="error"
          />
          <StatusCard
            icon={<Link2 className="h-4 w-4" />}
            title={tf("auto.87b8d3c003f5155d")}
            body="Used for expired, revoked, already-consumed, or otherwise missing invites."
            tone="warn"
          />
          <StatusCard
            icon={<ShieldCheck className="h-4 w-4" />}
            title={tf("auto.51f233e323518596")}
            body="Result screen for bootstrap CEO invites after setup has been accepted successfully."
            tone="success"
          />
          <StatusCard
            icon={<ArrowRight className="h-4 w-4" />}
            title={tf("auto.3c5e9c76be708c1e")}
            body="Signed-in human users skip the extra button click and move straight into join submission."
          />
          <StatusCard
            icon={<Users className="h-4 w-4" />}
            title={tf("auto.1739ed7c922674c4")}
            body="Acceptance stays disabled and the page redirects into the organization once membership is confirmed."
          />
          <StatusCard
            icon={<UserPlus className="h-4 w-4" />}
            title={tf("auto.2e75b962c1d5f80c")}
            body="Both pending-approval and joined-now confirmations are included below with claim and onboarding extras."
            tone="success"
          />
        </div>
      </LabSection>

      <LabSection
        eyebrow="Invite landing"
        title={tf("auto.3d088c51734b747b")}
        description={tf("auto.a0ef3ab20aa1dbed")}
        accentClassName="bg-[linear-gradient(180deg,rgba(234,179,8,0.06),transparent_28%),var(--background)]"
      >
        <div className="space-y-5">
          <InviteLandingShell
            left={
              <InviteSummaryPanel
                title={tf("auto.c811b50d6bad4ebe")}
                description={tf("auto.9a84bdf60e5cad63")}
                inviteMessage="Welcome aboard."
                requestedAccess="Operator"
              />
            }
            right={<InlineAuthPreview mode="sign_up" />}
          />

          <InviteLandingShell
            left={
              <InviteSummaryPanel
                title={tf("auto.c811b50d6bad4ebe")}
                description={tf("auto.9a84bdf60e5cad63")}
                inviteMessage="Welcome aboard."
                requestedAccess="Operator"
              />
            }
            right={
              <InlineAuthPreview
                mode="sign_in"
                feedback={{
                  tone: "info",
                  text: "An account already exists for jane@example.com. Sign in below to continue with this invite.",
                }}
              />
            }
          />

          <InviteLandingShell
            left={
              <InviteSummaryPanel
                title={tf("auto.c811b50d6bad4ebe")}
                description={tf("auto.08185f115fa7f794")}
                inviteMessage="Welcome aboard."
                requestedAccess="Operator"
                signedInLabel="Jane Example"
              />
            }
            right={<AcceptInvitePreview autoAccept />}
          />

          <InviteLandingShell
            left={
              <InviteSummaryPanel
                title={tf("auto.c811b50d6bad4ebe")}
                description={tf("auto.98fb0b9bb4d8474a")}
                requestedAccess="Agent join request"
              />
            }
            right={<AgentRequestPreview />}
          />

          <InviteLandingShell
            left={
              <InviteSummaryPanel
                title={tf("auto.c811b50d6bad4ebe")}
                description={tf("auto.08185f115fa7f794")}
                requestedAccess="Operator"
                signedInLabel="Jane Example"
              />
            }
            right={<AcceptInvitePreview error="This account already belongs to the organization." isCurrentMember />}
          />
        </div>
      </LabSection>

      <LabSection
        eyebrow="Result states"
        title={tf("auto.fc337f8132c91bf9")}
        description={tf("auto.79b2fa7ddaa3d042")}
        accentClassName="bg-[linear-gradient(180deg,rgba(16,185,129,0.06),transparent_30%),var(--background)]"
      >
        <div className="grid gap-5 xl:grid-cols-3">
          <InviteResultPreview
            title={tf("auto.814dff9586524c03")}
            description={tf("auto.c0d4742888d0d5ef")}
            claimSecret="pcp_claim_secret_demo"
            onboardingTextUrl="/api/invites/pcp_invite_test/onboarding.txt"
          />
          <InviteResultPreview
            title={tf("auto.f7f8d22c132844b3")}
            description={tf("auto.45ec6ed1ba8d7a4c")}
            joinedNow
          />
          <InviteResultPreview
            title={tf("auto.814dff9586524c03")}
            description={tf("auto.cc6d6cd4ee273be4")}
          />
        </div>
      </LabSection>

      <LabSection
        eyebrow="Standalone auth"
        title={tf("auto.56ab5f04ab8a4af9")}
        description={tf("auto.1b78eebaf51d0092")}
        accentClassName="bg-[linear-gradient(180deg,rgba(168,85,247,0.06),transparent_28%),var(--background)]"
      >
        <div className="space-y-5">
          <AuthScreenPreview mode="sign_in" error="Invalid email or password" />
          <AuthScreenPreview mode="sign_up" />
        </div>
      </LabSection>

      <LabSection
        eyebrow="Settings"
        title={tf("auto.bfc76b3219605628")}
        description={tf("auto.9034f5badf6350ca")}
        accentClassName="bg-[linear-gradient(180deg,rgba(244,114,182,0.06),transparent_28%),var(--background)]"
      >
        <CompanyInvitesPreview />
      </LabSection>
    </div>
  );
}
