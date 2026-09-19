import { tf } from "@/i18n/fork";
import { AgentChatPicker } from "@/components/AgentChatPicker";
import { TaskChatProjectCreatedCard } from "@/components/task-chat/TaskChatProjectCreatedCard";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { announcementPreview, announcementAnimationPreview, announcementAnimationPreviewSrc } from "@/lib/announcement-preview";
import { TaskDetailTasksPanel } from "@/components/task-detail/TaskDetailTasksPanel";
import { AiConnectionDesignExamples } from "@/components/ai-connections/AiConnectionDesignExamples";
import { SavedProviderKeySelect } from "../components/onboarding/SavedProviderKeySelect";
import { RepositoryEditor } from "@/components/RepositoryEditor";
import { TaskChatRunnerActivityGroup } from "@/components/task-chat/TaskChatRunnerActivityGroup";
import { TaskChatMarker } from "@/components/task-chat/TaskChatMarker";
import { TaskChatComposer } from "@/components/task-chat/TaskChatComposer";
import { TaskTreeControlDialog, TaskTreeControlMenuItems } from "@/components/TaskTreeControls";
import { useState } from "react";
import { ServicesList } from "./apps/app-detail/ServicesPanel";
import { ComposioProvenanceChip } from "./apps/ComposioProvenanceChip";
import type { ComposioServiceRow } from "./apps/composio-services";
import {
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  CircleDot,
  Command as CommandIcon,
  DollarSign,
  Hexagon,
  History,
  Inbox,
  LayoutDashboard,
  ListTodo,
  Mail,
  Plus,
  Search,
  Settings,
  Target,
  Trash2,
  Upload,
  User,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { InlineBanner } from "@/components/InlineBanner";
import { BuiltInLifecycleChip } from "@/components/BuiltInAgentBadges";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable-panels";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { AgentCapsule, AGENT_GRADIENT_COUNT } from "@/components/AgentCapsule";
import { AgentRunCard } from "@/components/ActiveAgentsPanel";
import { StatusBadge, IssueStatusBadge } from "@/components/StatusBadge";
import { StatusIcon } from "@/components/StatusIcon";
import { EnforcementBanner } from "@/components/EnforcementBanner";
import { ActionCard, ActionCardMobile, BindingsTable } from "@/components/actions/ActionCard";
import { PriorityIcon } from "@/components/PriorityIcon";
import { SHOW_TASK_PRIORITY_UI } from "@/lib/ui-flags";
import { agentStatusDot, agentStatusDotDefault } from "@/lib/status-colors";
import { EntityRow } from "@/components/EntityRow";
import { EmptyState } from "@/components/EmptyState";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar, type FilterValue } from "@/components/FilterBar";
import { InlineEditor } from "@/components/InlineEditor";
import { PageSkeleton } from "@/components/PageSkeleton";
import { Identity } from "@/components/Identity";
import { AppLogo } from "@/pages/apps/AppLogo";
import { IssueReferencePill } from "@/components/IssueReferencePill";
import { MembershipAction } from "@/components/MembershipAction";
import { IssueOutputSection } from "@/components/issue-output/IssueOutputSection";
import { EnvironmentVariablesEditor } from "@/components/environment-variables-editor";
import { IssueThreadInteractionCard } from "@/components/IssueThreadInteractionCard";
import {
  connectedConnectionIntentInteraction,
  issueThreadInteractionFixtureMeta,
  pendingConnectionIntentInteraction,
  retryConnectionIntentInteraction,
} from "@/fixtures/issueThreadInteractionFixtures";
import type { CompanySecret, EnvBinding, Issue } from "@paperclipai/shared";
import { CollectionToolbar } from "@/components/CollectionToolbar";
import { IssueRow } from "@/components/IssueRow";
import {
  EnvInputsList,
  ExternalSourcesList,
  RequiredSkillsList,
  StepSkillPlan,
  StepSourcePolicy,
  TeamCard,
  TeamHierarchyPreview,
  TeamRow,
} from "@/pages/TeamCatalog";
import {
  currentInstalledState,
  onboardingTeams,
  optionalTeam,
  outOfDateInstalledState,
  sampleSkillPreparations,
  sampleTeam,
  warnTeam,
} from "@/pages/TeamCatalog.fixtures";
import type { IssueWorkProduct } from "@paperclipai/shared";

/* ------------------------------------------------------------------ */
/*  Sample data for the Issue Output surface showcase                  */
/* ------------------------------------------------------------------ */

function sampleOutput(
  id: string,
  attachmentId: string,
  contentType: string,
  filename: string,
  opts: { byteSize: number; isPrimary?: boolean; createdAt: string },
): IssueWorkProduct {
  const contentPath = `/api/attachments/${attachmentId}/content`;
  return {
    id,
    companyId: "demo-company",
    projectId: null,
    issueId: "demo-issue",
    executionWorkspaceId: null,
    runtimeServiceId: null,
    type: "artifact",
    provider: "paperclip",
    externalId: null,
    title: filename,
    url: null,
    status: "active",
    reviewState: "none",
    isPrimary: Boolean(opts.isPrimary),
    healthStatus: "unknown",
    summary: null,
    createdByRunId: null,
    createdAt: new Date(opts.createdAt),
    updatedAt: new Date(opts.createdAt),
    metadata: {
      attachmentId,
      contentType,
      byteSize: opts.byteSize,
      contentPath,
      openPath: contentPath,
      downloadPath: `${contentPath}?download=1`,
      originalFilename: filename,
    },
  } as IssueWorkProduct;
}

const DESIGN_GUIDE_OUTPUTS: IssueWorkProduct[] = [
  sampleOutput("wp-vid", "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", "video/mp4", "q3-summary.mp4", {
    byteSize: 19_293_798,
    isPrimary: true,
    createdAt: "2026-05-30T12:00:00Z",
  }),
  sampleOutput("wp-pdf", "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", "application/pdf", "talking-points.pdf", {
    byteSize: 421_888,
    createdAt: "2026-05-30T11:52:00Z",
  }),
];

const DESIGN_GUIDE_DEGRADED_OUTPUTS: IssueWorkProduct[] = [
  {
    ...sampleOutput("wp-broken", "cccccccc-cccc-4ccc-8ccc-cccccccccccc", "video/mp4", "corrupt-output.mp4", {
      byteSize: 0,
      isPrimary: true,
      createdAt: "2026-05-30T12:01:00Z",
    }),
    // Strip the path metadata so it fails the shared artifact schema.
    metadata: { attachmentId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc", contentType: "video/mp4" },
  } as IssueWorkProduct,
];

const DESIGN_GUIDE_TASK = {
  id: "design-guide-task",
  identifier: "PAP-427",
  title: tf("auto.8172a52d8c2f75be"),
  status: "in_progress",
  priority: "medium",
  blockerAttention: false,
} as unknown as Issue;

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

/**
 * Composio service rows for the design guide (PAP-17865). One row per state, so
 * a reader can compare all four side by side rather than connecting a real
 * Composio project to see them.
 */
const DESIGN_GUIDE_COMPOSIO_ROWS: ComposioServiceRow[] = [
  {
    toolkitSlug: "github",
    name: "GitHub",
    description: tf("auto.f711a56ac322f851"),
    logoUrl: null,
    state: "connected",
    connectedAccountStatus: "ACTIVE",
    childConnectionId: "design-guide-child",
    toolCount: 42,
    noAuth: false,
  },
  {
    toolkitSlug: "hubspot",
    name: "HubSpot",
    description: tf("auto.9101916adeb1b0a8"),
    logoUrl: null,
    state: "attention",
    connectedAccountStatus: "EXPIRED",
    childConnectionId: "design-guide-child-2",
    toolCount: 18,
    noAuth: false,
  },
  {
    toolkitSlug: "slack",
    name: "Slack",
    description: tf("auto.a019c936e5e5e8dc"),
    logoUrl: null,
    state: "pending",
    connectedAccountStatus: "INITIALIZING",
    childConnectionId: null,
    toolCount: 12,
    noAuth: false,
  },
  {
    toolkitSlug: "gmail",
    name: "Gmail",
    description: tf("auto.42c7ea669863524b"),
    logoUrl: null,
    state: "not_connected",
    connectedAccountStatus: null,
    childConnectionId: null,
    toolCount: 9,
    noAuth: false,
  },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      <Separator />
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">{title}</h4>
      {children}
    </div>
  );
}

// Onboarding seam (design §6 + §12.5): the TeamCard tile in its "Pick a starter
// team" 3-col grid, with the first defaultInstall tile selected.
function TeamCardShowcase() {
  const [selectedId, setSelectedId] = useState(onboardingTeams[0]?.id ?? null);
  return (
    <div className="grid max-w-2xl gap-4 md:grid-cols-2 lg:grid-cols-3">
      {onboardingTeams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          selected={team.id === selectedId}
          onSelect={() => setSelectedId(team.id)}
        />
      ))}
    </div>
  );
}

// Reusable environment-variables editor: one shared grid, in-field source
// switch, fuzzy secret picker, sensitive-value detection, inline health.
const DESIGN_GUIDE_SECRETS: CompanySecret[] = [
  {
    id: "dg-github",
    companyId: "dg",
    scope: "company",
    ownerUserId: null,
    userSecretDefinitionId: null,
    key: "github_token",
    name: "GITHUB_TOKEN",
    provider: "local_encrypted",
    status: "active",
    managedMode: "paperclip_managed",
    externalRef: null,
    providerConfigId: null,
    providerMetadata: null,
    latestVersion: 3,
    description: null,
    lastResolvedAt: null,
    lastRotatedAt: null,
    deletedAt: null,
    createdByAgentId: null,
    createdByUserId: null,
    createdAt: new Date("2026-03-01T10:00:00.000Z"),
    updatedAt: new Date("2026-03-01T10:00:00.000Z"),
  },
  {
    id: "dg-db",
    companyId: "dg",
    scope: "company",
    ownerUserId: null,
    userSecretDefinitionId: null,
    key: "db_connection",
    name: "DB_CONNECTION",
    provider: "local_encrypted",
    status: "active",
    managedMode: "paperclip_managed",
    externalRef: null,
    providerConfigId: null,
    providerMetadata: null,
    latestVersion: 3,
    description: null,
    lastResolvedAt: null,
    lastRotatedAt: null,
    deletedAt: null,
    createdByAgentId: null,
    createdByUserId: null,
    createdAt: new Date("2026-03-01T10:00:00.000Z"),
    updatedAt: new Date("2026-03-01T10:00:00.000Z"),
  },
];

function EnvironmentVariablesEditorShowcase() {
  const [env, setEnv] = useState<Record<string, EnvBinding>>({
    NODE_ENV: { type: "plain", value: "production" },
    GH_TOKEN: { type: "secret_ref", secretId: "dg-github", version: "latest" },
    DB_URL: { type: "secret_ref", secretId: "dg-db", version: 3 },
    STRIPE_API_KEY: { type: "plain", value: "sk-live-51H8xL0aBcDeFgHiJkLmNoPq" },
  });
  return (
    <div className="max-w-(--sz-640px) rounded-md border border-border p-4">
      <EnvironmentVariablesEditor
        value={env}
        secrets={DESIGN_GUIDE_SECRETS}
        onChange={(next) => setEnv(next ?? {})}
        onCreateSecret={async (name) => ({
          ...DESIGN_GUIDE_SECRETS[0]!,
          id: `dg-${name}`,
          key: name,
          name: name.toUpperCase(),
          latestVersion: 1,
        })}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Color swatch                                                       */
/* ------------------------------------------------------------------ */

function Swatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-8 w-8 rounded-md border border-border shrink-0"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div>
        <p className="text-xs font-mono">{cssVar}</p>
        <p className="text-xs text-muted-foreground">{name}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function TaskExecutionControlsExample() {
  const [running, setRunning] = useState(true);
  const [dialogMode, setDialogMode] = useState<"resume" | "cancel" | "restore" | null>(null);
  const [wake, setWake] = useState(true);
  return <div className="max-w-xl space-y-4">
    <div className="w-52 rounded-md border border-border p-1">
      <TaskTreeControlMenuItems scope="subtree" canPause={running} canResume={!running} canCancel canRestore={!running}
        onPause={() => setRunning(false)} onResume={() => setDialogMode("resume")}
        onCancel={() => setDialogMode("cancel")} onRestore={() => setDialogMode("restore")} />
    </div>
    <p className="text-sm text-muted-foreground">{running ? "Running: type to switch Stop to Send." : "Paused: resume from the menu."}</p>
    <TaskChatProjectCreatedCard item={{ id: "design-project", kind: "project_created", projectId: "example-project", name: "Onboarding improvements", description: tf("auto.dc595637ac4a436d"), timestamp: "2026-09-11T00:00:00Z", repositories: [{ id: "1", name: "paperclipai/paperclip", url: "https://github.com/paperclipai/paperclip" }] }} />
    {!running ? <TaskChatMarker item={{ id: "design-cancelled", kind: "marker", variant: "interrupted", tone: "neutral", label: tf("auto.2d34c9f19f5402b3"), detail: "The run was cancelled before returning an answer.", collapsible: true }} /> : null}
    <TaskChatComposer pause={!running ? { scope: "subtree", onResume: () => setDialogMode("resume") } : null} onAdd={async () => {}} workMode="standard" stopScope="subtree" onStop={running ? async () => setRunning(false) : undefined} />
    <TaskTreeControlDialog open={dialogMode !== null} onOpenChange={(open) => { if (!open) setDialogMode(null); }}
      mode={dialogMode ?? "cancel"} scope="subtree" affectedCount={3} affectedAgentCount={2} loading={false} pending={false} valid
      wakeAgents={wake} onWakeAgentsChange={setWake} onRetry={() => {}}
      onApply={() => { setRunning(dialogMode !== "cancel" && wake); setDialogMode(null); }} />
  </div>;
}

function AgentChatPickerExample() {
  const [state, setState] = useState<"closed" | "empty" | "loading" | "error">("closed");
  return <div className="flex flex-wrap gap-2">
    <Button variant="outline" onClick={() => setState("empty")}>Empty picker</Button>
    <Button variant="outline" onClick={() => setState("loading")}>Loading picker</Button>
    <Button variant="outline" onClick={() => setState("error")}>Failed picker</Button>
    <AgentChatPicker agents={[]} open={state !== "closed"} onOpenChange={(open) => { if (!open) setState("closed"); }} onSelect={() => {}}
      loading={state === "loading"} error={state === "error" ? new Error("Unavailable") : null} onRetry={() => setState("empty")} />
  </div>;
}

export function DesignGuide() {
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [selectValue, setSelectValue] = useState("in_progress");
  const [menuChecked, setMenuChecked] = useState(true);
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [inlineText, setInlineText] = useState("Click to edit this text");
  const [inlineTitle, setInlineTitle] = useState("Editable Title");
  const [inlineDesc, setInlineDesc] = useState(
    "This is an editable description. Click to edit it — the textarea auto-sizes to fit the content without layout shift."
  );
  const [filters, setFilters] = useState<FilterValue[]>([
    { key: "status", label: tf("text.Status"), value: "Active" },
    // PAP-411: priority filter demo row suppressed while SHOW_TASK_PRIORITY_UI is off.
    ...(SHOW_TASK_PRIORITY_UI
      ? [{ key: "priority", label: tf("text.Priority"), value: "High" } as FilterValue]
      : []),
  ]);
  const [allowExternal, setAllowExternal] = useState(false);
  const [allowUnpinned, setAllowUnpinned] = useState(false);
  const [allowLocalPath, setAllowLocalPath] = useState(false);

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold">{tf("auto.fb85946778ba8b3e")}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {tf("auto.11b92d42c772a484")}
        </p>
      </div>

      {/* ============================================================ */}
      {/*  COVERAGE                                                     */}
      {/* ============================================================ */}
      <Section title={tf("auto.0ce7e43e9b66e6fc")}>
        <p className="text-sm text-muted-foreground">
          {tf("auto.87a2a492ec7c2c06")}
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <SubSection title={tf("auto.8d9de12fe1ebc864")}>
            <div className="flex flex-wrap gap-2">
              {[
                "avatar", "badge", "breadcrumb", "button", "card", "checkbox", "collapsible",
                "command", "dialog", "dropdown-menu", "input", "label", "popover", "resizable-panels",
                "scroll-area", "select", "separator", "sheet", "skeleton", "tabs", "textarea", "tooltip",
              ].map((name) => (
                <Badge key={name} variant="outline" className="font-mono text-(length:--text-nano)">
                  {name}
                </Badge>
              ))}
            </div>
          </SubSection>
          <SubSection title={tf("auto.3513abbd3ffdf8d9")}>
            <div className="flex flex-wrap gap-2">
              {[
                "StatusBadge", "StatusIcon", "PriorityIcon", "EntityRow", "EmptyState", "MetricCard",
                "FilterBar", "InlineEditor", "PageSkeleton", "Identity", "CommentThread", "MarkdownEditor",
                "PropertiesPanel", "Sidebar", "CommandPalette", "EnvironmentVariablesEditor",
                "InlineBanner", "BuiltInAgentGate", "BuiltInLifecycleChip", "CollectionToolbar",
                "IssueRow", "ContextualSidebarFrame",
              ].map((name) => (
                <Badge key={name} variant="ghost" className="font-mono text-(length:--text-nano)">
                  {name}
                </Badge>
              ))}
            </div>
          </SubSection>
        </div>
      </Section>

      <Section title={tf("auto.fe02680f247961a1")}>
        <div className="grid gap-4 md:grid-cols-2">
          <AnnouncementCard announcement={announcementAnimationPreview} imageSrc="/announcement-preview.svg" animationSrc={announcementAnimationPreviewSrc} onDismiss={() => {}} />
          <AnnouncementCard announcement={announcementPreview} imageSrc="/announcement-preview.svg" onDismiss={() => {}} />
          <AnnouncementCard announcement={{ ...announcementPreview, image: undefined, secondaryLink: undefined }} onDismiss={() => {}} />
        </div>
      </Section>

      <Section title={tf("auto.c914f18daf836c24")}>
        <TaskExecutionControlsExample />
      </Section>

      <Section title={tf("auto.dad6954248daa008")}>
        <p className="max-w-prose text-sm text-muted-foreground">
          CollectionToolbar owns shared geometry while each page owns its state and behavior.
          The canonical task row is opt-in during migration: status leads, unread work uses
          title emphasis, metadata remains stable, and the task identifier trails.
        </p>
        <CollectionToolbar
          context={<span className="text-sm font-medium">{tf("auto.7b940d847536b182")}</span>}
          search={<Input aria-label={tf("auto.386bdeb611f05b04")} placeholder={tf("auto.c1af8370c5f68986")} />}
          controls={<Button variant="outline" size="sm">{tf("text.Filter")}</Button>}
          actions={<Button size="sm">{tf("text.New task")}</Button>}
          feedback={<span className="text-xs text-muted-foreground">{tf("auto.2d381e3ed912161c")}</span>}
        />
        <div className="overflow-hidden rounded-lg border border-border">
          <IssueRow
            issue={DESIGN_GUIDE_TASK}
            presentation="task"
            unreadState="visible"
            metadata={<span className="text-xs text-muted-foreground">{tf("auto.6991a5b75f2f410a")}</span>}
            actions={<Button variant="ghost" size="xs">{tf("auto.d47d7cb0e4f8fd2b")}</Button>}
          />
        </div>
      </Section>

      <Section title={tf("auto.cafbda6ab5494a0c")}>
        <SubSection title={tf("auto.63d2643b059ee912")}>
          <div className="flex max-w-sm flex-col items-start gap-3">
            <ThemeToggle />
            <ThemeToggle variant="menu-action" />
            <ThemeToggle variant="compact-menu-action" />
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  COLORS                                                       */}
      {/* ============================================================ */}
      <Section title={tf("auto.88c45d9e526c08dd")}>
        <SubSection title={tf("auto.70ea1983c983deac")}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Swatch name="Background" cssVar="--background" />
            <Swatch name="Foreground" cssVar="--foreground" />
            <Swatch name="Card" cssVar="--card" />
            <Swatch name="Primary" cssVar="--primary" />
            <Swatch name="Primary foreground" cssVar="--primary-foreground" />
            <Swatch name="Secondary" cssVar="--secondary" />
            <Swatch name="Muted" cssVar="--muted" />
            <Swatch name="Muted foreground" cssVar="--muted-foreground" />
            <Swatch name="Accent" cssVar="--accent" />
            <Swatch name="Destructive" cssVar="--destructive" />
            <Swatch name="Border" cssVar="--border" />
            <Swatch name="Ring" cssVar="--ring" />
          </div>
        </SubSection>

        <SubSection title={tf("auto.f7efa7bc1fc535ab")}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Swatch name="Sidebar" cssVar="--sidebar" />
            <Swatch name="Sidebar border" cssVar="--sidebar-border" />
          </div>
        </SubSection>

        <SubSection title={tf("auto.3e5b90ae053ff3e7")}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Swatch name="Chart 1" cssVar="--chart-1" />
            <Swatch name="Chart 2" cssVar="--chart-2" />
            <Swatch name="Chart 3" cssVar="--chart-3" />
            <Swatch name="Chart 4" cssVar="--chart-4" />
            <Swatch name="Chart 5" cssVar="--chart-5" />
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  TYPOGRAPHY                                                   */}
      {/* ============================================================ */}
      <Section title={tf("auto.4da41ca2c54f9911")}>
        <TaskChatRunnerActivityGroup item={{ id: "design-runner-activity", kind: "activity_phase", active: true, summary: "", interstitial: { id: "design-runner-commentary", kind: "message", author: "agent", text: "I’ll inspect the activity feed and check the layout.", interstitial: true }, items: [
          { id: "design-runner-read", kind: "tool", name: "read", target: "TaskChatRunnerTurn.tsx", status: "completed", detail: "Found the activity groups." },
          { id: "design-runner-check", kind: "tool", name: "exec_command", target: "pnpm check:token-gates", status: "in_progress" },
        ] }} />
        <TaskChatRunnerActivityGroup item={{ id: "design-runner-completed", kind: "activity_phase", active: false, summary: "", items: [
          { id: "design-completed-read", kind: "tool", name: "read", target: "TaskChatRunnerTurn.tsx", status: "completed", detail: "Read the activity groups." },
          { id: "design-completed-check", kind: "tool", name: "exec_command", target: "pnpm check:token-gates", status: "failed", detail: "A token check needs another pass." },
        ] }} />
      </Section>

      <Section title={tf("auto.cab94aba84f97f7f")}>
        <div className="space-y-3">
          <h2 className="text-xl font-bold">{tf("auto.330ad43ba422cf58")}</h2>
          <h2 className="text-lg font-semibold">{tf("auto.7ea638dc6fd93edc")}</h2>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {tf("auto.42b0aa5754c7aff7")}
          </h3>
          <p className="text-sm font-medium">{tf("auto.3791e01e57285cca")}</p>
          <p className="text-sm font-semibold">{tf("auto.893bc7d76711d4b7")}</p>
          <p className="text-sm">{tf("auto.dd4663cc6f27d0d7")}</p>
          <p className="text-sm text-muted-foreground">
            {tf("auto.258b5dfff1a3b8ad")}
          </p>
          <p className="text-xs text-muted-foreground">
            {tf("auto.96b05260cf611f07")}
          </p>
          <p className="text-sm font-mono text-muted-foreground">
            {tf("auto.49119ceec8d8f60d")}
          </p>
          <p className="text-2xl font-bold">{tf("auto.056eb9dda0bfbaed")}</p>
          <p className="font-mono text-xs">{tf("auto.92c7b7d0ef3754ac")}</p>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  SPACING & RADIUS                                             */}
      {/* ============================================================ */}
      <Section title={tf("auto.6fe0661c82d10d34")}>
        <div className="flex items-end gap-4 flex-wrap">
          {[
            ["sm", "var(--radius-sm)"],
            ["md", "var(--radius-md)"],
            ["lg", "var(--radius-lg)"],
            ["xl", "var(--radius-xl)"],
            ["full", "9999px"],
          ].map(([label, radius]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className="h-12 w-12 bg-primary"
                style={{ borderRadius: radius }}
              />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  BUTTONS                                                      */}
      {/* ============================================================ */}
      <Section title={tf("auto.d452583a74d0e772")}>
        <SubSection title={tf("auto.63d2643b059ee912")}>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="default">{tf("text.Default")}</Button>
            <Button variant="secondary">{tf("auto.62f2ccfffcc5103e")}</Button>
            <Button variant="outline">{tf("auto.eabbf3abaf8d98ab")}</Button>
            <Button variant="ghost">{tf("auto.df1bc4984a055e10")}</Button>
            <Button variant="destructive">{tf("auto.c3e58a73609d1094")}</Button>
            <Button variant="link">{tf("auto.a6a32dbc5618ea39")}</Button>
          </div>
        </SubSection>

        <SubSection title={tf("auto.74a3978d10045c73")}>
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="xs">{tf("auto.c7b3e43848e28867")}</Button>
            <Button size="sm">{tf("auto.5263293fc202649b")}</Button>
            <Button size="default">{tf("text.Default")}</Button>
            <Button size="lg">{tf("auto.ab80540d98d27456")}</Button>
          </div>
        </SubSection>

        <SubSection title={tf("auto.19cccce848ccb3a9")}>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="icon-xs"><Search /></Button>
            <Button variant="ghost" size="icon-sm"><Search /></Button>
            <Button variant="outline" size="icon"><Search /></Button>
            <Button variant="outline" size="icon-lg"><Search /></Button>
          </div>
        </SubSection>

        <SubSection title={tf("auto.1f71f4bc7203e22d")}>
          <div className="flex items-center gap-2 flex-wrap">
            <Button><Plus /> {tf("auto.03a81df699d65e22")}</Button>
            <Button variant="outline"><Upload /> {tf("text.Upload")}</Button>
            <Button variant="destructive"><Trash2 /> {tf("text.Delete")}</Button>
            <Button size="sm"><Plus /> {tf("text.Add")}</Button>
          </div>
        </SubSection>

        <SubSection title={tf("auto.2f6e9daec8e9b3b3")}>
          <div className="flex items-center gap-2 flex-wrap">
            <Button disabled>{tf("text.Disabled")}</Button>
            <Button variant="outline" disabled>{tf("auto.bbf6b43dcd5536e8")}</Button>
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  BADGES                                                       */}
      {/* ============================================================ */}
      <Section title={tf("auto.185d8ef0ae5ea9b8")}>
        <SubSection title={tf("auto.63d2643b059ee912")}>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default">{tf("text.Default")}</Badge>
            <Badge variant="secondary">{tf("auto.62f2ccfffcc5103e")}</Badge>
            <Badge variant="outline">{tf("auto.eabbf3abaf8d98ab")}</Badge>
            <Badge variant="destructive">{tf("auto.c3e58a73609d1094")}</Badge>
            <Badge variant="ghost">{tf("auto.df1bc4984a055e10")}</Badge>
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  STATUS BADGES & ICONS                                        */}
      {/* ============================================================ */}
      <Section title={tf("auto.4805331bace6a93c")}>
        <SubSection title={tf("auto.7640ba1e93309f72")}>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              "active", "running", "paused", "idle", "archived", "planned",
              "achieved", "completed", "failed", "timed_out", "succeeded", "error",
              "pending_approval", "backlog", "todo", "in_progress", "in_review", "blocked",
              "done", "terminated", "cancelled", "pending", "revision_requested",
              "approved", "rejected",
            ].map((s) => (
              <StatusBadge key={s} status={s} />
            ))}
          </div>
        </SubSection>

        <SubSection title={tf("auto.4f561819fd6f1039")}>
          <div className="flex items-center gap-2 flex-wrap">
            {["backlog", "todo", "in_progress", "in_review", "done", "blocked", "cancelled"].map(
              (s) => (
                <IssueStatusBadge key={s} status={s} />
              )
            )}
          </div>
        </SubSection>

        <SubSection title={tf("auto.f24d0f6de5e70c13")}>
          <div className="flex items-center gap-3 flex-wrap">
            {["backlog", "todo", "in_progress", "in_review", "done", "cancelled", "blocked"].map(
              (s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <StatusIcon status={s} />
                  <span className="text-xs text-muted-foreground">{s}</span>
                </div>
              )
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <StatusIcon status={status} onChange={setStatus} />
            <span className="text-sm">Click the icon to change status (current: {status})</span>
          </div>
        </SubSection>

        {/* PAP-411: PriorityIcon showcase gated behind SHOW_TASK_PRIORITY_UI per board decision. */}
        {SHOW_TASK_PRIORITY_UI && (
        <SubSection title={tf("auto.7effddf508b2aa4a")}>
          <div className="flex items-center gap-3 flex-wrap">
            {["critical", "high", "medium", "low"].map((p) => (
              <div key={p} className="flex items-center gap-1.5">
                <PriorityIcon priority={p} />
                <span className="text-xs text-muted-foreground">{p}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <PriorityIcon priority={priority} onChange={setPriority} />
            <span className="text-sm">Click the icon to change (current: {priority})</span>
          </div>
        </SubSection>
        )}

        <SubSection title={tf("auto.5c9ee51cc3eeb084")}>
          <div className="flex items-center gap-4 flex-wrap">
            {(["running", "active", "paused", "error", "archived"] as const).map((label) => (
              <div key={label} className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`inline-flex h-full w-full rounded-full ${agentStatusDot[label] ?? agentStatusDotDefault}`} />
                </span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection title={tf("auto.2b04ef6c4916e132")}>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              ["timer", "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"],
              ["assignment", "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300"],
              ["on_demand", "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300"],
              ["automation", "bg-muted text-muted-foreground"],
            ].map(([label, cls]) => (
              <Badge variant="ghost" key={label} className={`px-1.5 text-(length:--text-nano) ${cls}`}>
                {label}
              </Badge>
            ))}
          </div>
        </SubSection>

        <SubSection title={tf("auto.88d5a36ca55d4817")}>
          <p className="text-xs text-muted-foreground">
            Used wherever a task is referenced — in markdown, the Related Work tab, and activity summaries.
            Pass <code className="font-mono">{tf("auto.073c1634c496cdb6")}</code> to show the target issue&apos;s state at a glance.
            Use <code className="font-mono">{tf("auto.208e32e5b387eb4e")}</code> for compact badges with direct navigation.
            Pass <code className="font-mono">{tf("auto.05c1bb8c62c4c737")}</code> for a separate blocker removal control with reserved space.
            Use <code className="font-mono">{tf("auto.5c88563291c7da6a")}</code> for &quot;removed&quot; contexts.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <IssueReferencePill issue={{ id: "demo-1", identifier: "PAP-123", title: tf("auto.ceaa35d03a952280") }} />
            <IssueReferencePill issue={{ id: "demo-2", identifier: "PAP-456", title: tf("auto.b0a7b6dfa9f1596a"), status: "in_progress" }} />
            <IssueReferencePill issue={{ id: "demo-3", identifier: "PAP-789", title: tf("auto.a2c1d162e2e5af9c"), status: "done" }} />
            <IssueReferencePill issue={{ id: "demo-4", identifier: "PAP-101", title: tf("auto.31b37cb6b7a814b1"), status: "blocked" }} />
            <IssueReferencePill onRemove={() => window.alert(tf("auto.e7925435ba2c2aef"))} issue={{ id: "demo-blocker", identifier: "PAP-303", title: tf("auto.7407b822df2f2549"), status: "in_review" }} />
            <IssueReferencePill strikethrough issue={{ id: "demo-5", identifier: "PAP-202", title: tf("auto.009f6b18d38ce66b"), status: "todo" }} />
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  AGENT CAPSULE                                                */}
      {/* ============================================================ */}
      <Section title={tf("auto.4588fb04c37813c8")}>
        <p className="text-sm text-muted-foreground max-w-prose">
          The brand &quot;capsule is the agent&quot; motif. A single agent reads as a tall
          pill that moves through three states as it comes to life. The online fill uses
          the live brand agent-gradient tokens (<code className="font-mono">{tf("auto.c8c6138a51d30a82")}</code> →{" "}
          <code className="font-mono">{tf("auto.408dccb11ac4ae75")}</code>); <code className="font-mono">{tf("auto.9f005b166d57745e")}</code>{" "}
          skips the liquid rise and pulses and renders the final state.
        </p>
        <SubSection title={tf("auto.2f6e9daec8e9b3b3")}>
          <div className="flex items-end gap-10">
            <div className="flex flex-col items-center gap-2">
              <AgentCapsule state="slot" />
              <span className="text-xs text-muted-foreground">{tf("auto.6558838331b742a6")}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <AgentCapsule state="configured" />
              <span className="text-xs text-muted-foreground">{tf("auto.20158224750041d6")}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <AgentCapsule state="online" gradient={5} />
              <span className="text-xs text-muted-foreground">{tf("auto.f6fc84c9f21c2490")}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <AgentCapsule state="online" gradient={5} glow="blue" />
              <span className="text-xs text-muted-foreground">{tf("auto.4d1505f281f0d31e")}</span>
            </div>
          </div>
        </SubSection>
        <SubSection title={tf("auto.74a3978d10045c73")}>
          <div className="flex items-end gap-8">
            <div className="flex flex-col items-center gap-2">
              <AgentCapsule state="online" size="sm" gradient={1} />
              <span className="text-xs text-muted-foreground">{tf("auto.5af308bec132bd49")}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <AgentCapsule state="online" size="md" gradient={4} />
              <span className="text-xs text-muted-foreground">{tf("auto.21262a3cb5337627")}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <AgentCapsule state="online" size="lg" gradient={8} />
              <span className="text-xs text-muted-foreground">{tf("auto.0e6ba33f8bc8f415")}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <AgentCapsule state="online" size={{ width: 28, height: 96 }} gradient={6} />
              <span className="text-xs text-muted-foreground">{tf("auto.a051fd3454861a6f")}</span>
            </div>
          </div>
        </SubSection>
        <SubSection title={tf("auto.ab64614fdfe4f15b")}>
          <div className="flex items-end gap-3 flex-wrap">
            {Array.from({ length: AGENT_GRADIENT_COUNT }, (_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <AgentCapsule state="online" size="sm" gradient={i + 1} />
                <span className="text-(length:--text-nano) font-mono text-muted-foreground">{i + 1}</span>
              </div>
            ))}
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  FORM ELEMENTS                                                */}
      {/* ============================================================ */}
      <Section title={tf("auto.87340ea44c3d8e31")}>
        <div className="grid gap-6 md:grid-cols-2">
          <SubSection title={tf("text.Input")}>
            <Input placeholder={tf("auto.6364c7ae20cb3b83")} />
            <Input placeholder={tf("auto.4ba876c7aa2c93d1")} disabled className="mt-2" />
          </SubSection>

          <SubSection title={tf("auto.467065a16a2e9fc8")}>
            <Textarea placeholder={tf("auto.ff2fd355e960a31c")} />
          </SubSection>

          <SubSection title={tf("auto.cdc3eb592253857c")}>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox id="check1" defaultChecked />
                <Label htmlFor="check1">{tf("auto.81085a7f9027efcc")}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="check2" />
                <Label htmlFor="check2">{tf("auto.0b21710e717fd336")}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="check3" disabled />
                <Label htmlFor="check3">{tf("auto.40b3f9be22366117")}</Label>
              </div>
            </div>
          </SubSection>

          <SubSection title={tf("auto.3485cc646e1ea0c3")}>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{tf("auto.03d397b729e3e303")}</p>
                <InlineEditor
                  value={inlineTitle}
                  onSave={setInlineTitle}
                  as="h2"
                  className="text-xl font-bold"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{tf("auto.fc872109e5fd64e5")}</p>
                <InlineEditor
                  value={inlineText}
                  onSave={setInlineText}
                  as="p"
                  className="text-sm"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{tf("auto.5926a0e426e01c76")}</p>
                <InlineEditor
                  value={inlineDesc}
                  onSave={setInlineDesc}
                  as="p"
                  className="text-sm text-muted-foreground"
                  placeholder={tf("auto.eed0f05bd942078d")}
                  multiline
                />
              </div>
            </div>
          </SubSection>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  SELECT                                                       */}
      {/* ============================================================ */}
      <Section title={tf("auto.2a78025de6aae5e7")}>
        <div className="grid gap-6 md:grid-cols-2">
          <SubSection title={tf("auto.5cbce0f8801347fc")}>
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={tf("auto.f4d3c2a2e248dc55")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="backlog">{tf("status.backlog")}</SelectItem>
                <SelectItem value="todo">{tf("auto.4ff402d768211082")}</SelectItem>
                <SelectItem value="in_progress">{tf("auto.b4cc4b07c300103a")}</SelectItem>
                <SelectItem value="in_review">{tf("auto.2677214a9268a547")}</SelectItem>
                <SelectItem value="done">{tf("text.Done")}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Current value: {selectValue}</p>
          </SubSection>
          <SubSection title={tf("auto.bf7c66283dfd81f5")}>
            <Select defaultValue="high">
              <SelectTrigger size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">{tf("auto.427dd2969bd140be")}</SelectItem>
                <SelectItem value="high">{tf("auto.c4ebc6d4a5832cd9")}</SelectItem>
                <SelectItem value="medium">{tf("auto.8e588cd187741f1c")}</SelectItem>
                <SelectItem value="low">{tf("auto.f793de205ead5ac3")}</SelectItem>
              </SelectContent>
            </Select>
          </SubSection>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  DROPDOWN MENU                                                */}
      {/* ============================================================ */}
      <Section title={tf("auto.d5c53c6369be5029")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {tf("auto.2cc2b6f7f200e65c")}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>
              <Check className="h-4 w-4" />
              {tf("auto.62aa4b87cc523455")}
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookOpen className="h-4 w-4" />
              {tf("auto.76deaf7d26b92ba0")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={menuChecked}
              onCheckedChange={(value) => setMenuChecked(value === true)}
            >
              {tf("auto.3e773f12bbf4f598")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuItem variant="destructive">
              <Trash2 className="h-4 w-4" />
              {tf("auto.085be85d203ebab4")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      {/* ============================================================ */}
      {/*  POPOVER                                                      */}
      {/* ============================================================ */}
      <Section title={tf("auto.064f6ac1a7897842")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">{tf("auto.6d22c4c60d3b783a")}</Button>
          </PopoverTrigger>
          <PopoverContent className="space-y-2">
            <p className="text-sm font-medium">{tf("auto.ed550be0a33790dd")}</p>
            <p className="text-xs text-muted-foreground">
              {tf("auto.d3a181a128e87378")}
            </p>
            <Button size="xs">{tf("auto.b14d667b45ef586d")}</Button>
          </PopoverContent>
        </Popover>
      </Section>

      {/* ============================================================ */}
      {/*  COLLAPSIBLE                                                  */}
      {/* ============================================================ */}
      <Section title={tf("auto.d4a5d5f8fd9b6852")}>
        <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen} className="space-y-2">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              {collapsibleOpen ? "Hide" : "Show"} advanced filters
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="rounded-md border border-border p-3">
            <div className="space-y-2">
              <Label htmlFor="owner-filter">{tf("text.Owner")}</Label>
              <Input id="owner-filter" placeholder={tf("auto.0f60d859d663d733")} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Section>

      {/* ============================================================ */}
      {/*  SHEET                                                        */}
      {/* ============================================================ */}
      <Section title={tf("auto.54bf0ebbfb3e0e37")}>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">{tf("auto.6451992b207c2dd8")}</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{tf("auto.851c108249a26294")}</SheetTitle>
              <SheetDescription>{tf("auto.16dc84b3666f1c6c")}</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 px-4">
              <div className="space-y-1">
                <Label htmlFor="sheet-title">{tf("text.Title")}</Label>
                <Input id="sheet-title" defaultValue="Improve onboarding docs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sheet-description">{tf("text.Description")}</Label>
                <Textarea id="sheet-description" defaultValue="Capture setup pitfalls and screenshots." />
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline">{tf("text.Cancel")}</Button>
              <Button>{tf("text.Save")}</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Section>

      {/* ============================================================ */}
      {/*  SCROLL AREA                                                  */}
      {/* ============================================================ */}
      <Section title={tf("auto.9b26d240abb6918e")}>
        <ScrollArea className="h-36 rounded-md border border-border">
          <div className="space-y-2 p-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-md border border-border p-2 text-sm">
                Heartbeat run #{i + 1}: completed successfully
              </div>
            ))}
          </div>
        </ScrollArea>
      </Section>

      {/* ============================================================ */}
      {/*  COMMAND                                                      */}
      {/* ============================================================ */}
      <Section title={tf("auto.b42efd2f38e43986")}>
        <div className="rounded-md border border-border">
          <Command>
            <CommandInput placeholder={tf("auto.14d048ecc3bd0384")} />
            <CommandList>
              <CommandEmpty>{tf("text.No results found.")}</CommandEmpty>
              <CommandGroup heading="Pages">
                <CommandItem>
                  <LayoutDashboard className="h-4 w-4" />
                  {tf("text.Dashboard")}
                </CommandItem>
                <CommandItem>
                  <CircleDot className="h-4 w-4" />
                  {tf("auto.666067dd376e5d45")}
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Actions">
                <CommandItem>
                  <CommandIcon className="h-4 w-4" />
                  {tf("auto.c022b19a38a632d9")}
                </CommandItem>
                <CommandItem>
                  <Plus className="h-4 w-4" />
                  {tf("auto.f27a451c16eaf14c")}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  BREADCRUMB                                                   */}
      {/* ============================================================ */}
      <Section title={tf("auto.2bd873d6c734e63e")}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{tf("text.Projects")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{tf("auto.a2afee2c12319c20")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tf("auto.b8a227c7fc41bc78")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Section>

      {/* ============================================================ */}
      {/*  CARDS                                                        */}
      {/* ============================================================ */}
      <Section title={tf("auto.a52fcbbc33644d31")}>
        <SubSection title={tf("auto.0aaef70331351062")}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {["running", "queued", "succeeded", "failed", "timed_out", "cancelled", "interrupted"].map((status) => (
              <AgentRunCard
                key={status}
                companyId="design-guide"
                run={{
                  id: `design-guide-${status}`, agentId: "design-guide-agent", agentName: "CodexCoder",
                  status, adapterType: "codex_local", invocationSource: "on_demand", triggerDetail: "manual",
                  startedAt: null, finishedAt: null, createdAt: "2026-09-11T12:00:00Z", issueId: "design-guide-task",
                }}
                issue={{ identifier: "PAP-559", title: tf("auto.d70afc1d3c4aa824"), status: status === "succeeded" ? "done" : "in_progress" }}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{tf("auto.27b8dd399bd33a21")}</p>
        </SubSection>
        <SubSection title={tf("auto.e00864532bc47255")}>
          <Card>
            <CardHeader>
              <CardTitle>{tf("auto.1441a2959af749da")}</CardTitle>
              <CardDescription>{tf("auto.d94e320eeedd0562")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{tf("auto.86e31a710d6c4645")}</p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm">{tf("auto.64cff1319d2fd2cb")}</Button>
              <Button variant="outline" size="sm">{tf("text.Cancel")}</Button>
            </CardFooter>
          </Card>
        </SubSection>

        <SubSection title={tf("auto.b0916fef0db094a0")}>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard icon={Bot} value={12} label={tf("auto.86622a874660b466")} description={tf("auto.6f7320b6f6a028cd")} />
            <MetricCard icon={CircleDot} value={48} label={tf("auto.4e2912a774ef86f8")} />
            <MetricCard icon={DollarSign} value="$1,234" label={tf("auto.7294a203a4350828")} description={tf("auto.fffd741228ea2d63")} />
            <MetricCard icon={Zap} value="99.9%" label={tf("auto.d63ab4711473b039")} />
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  TABS                                                         */}
      {/* ============================================================ */}
      <Section title={tf("auto.8e5ea509893e6dfd")}>
        <SubSection title={tf("auto.ec1cb396b05090d1")}>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">{tf("text.Overview")}</TabsTrigger>
              <TabsTrigger value="runs">{tf("text.Runs")}</TabsTrigger>
              <TabsTrigger value="config">{tf("auto.87e89abb4c1c551f")}</TabsTrigger>
              <TabsTrigger value="costs">{tf("text.Costs")}</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="text-sm text-muted-foreground py-4">{tf("auto.b2cef641163c0b36")}</p>
            </TabsContent>
            <TabsContent value="runs">
              <p className="text-sm text-muted-foreground py-4">{tf("auto.6ca368f49f1e4faa")}</p>
            </TabsContent>
            <TabsContent value="config">
              <p className="text-sm text-muted-foreground py-4">{tf("auto.64f6f1ee3ea1ed14")}</p>
            </TabsContent>
            <TabsContent value="costs">
              <p className="text-sm text-muted-foreground py-4">{tf("auto.f1e79d4d0dd77f5f")}</p>
            </TabsContent>
          </Tabs>
        </SubSection>

        <SubSection title={tf("auto.aa51396438b5f528")}>
          <Tabs defaultValue="summary">
            <TabsList variant="line">
              <TabsTrigger value="summary">{tf("text.Summary")}</TabsTrigger>
              <TabsTrigger value="details">{tf("text.Details")}</TabsTrigger>
              <TabsTrigger value="comments">{tf("text.Comments")}</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <p className="text-sm text-muted-foreground py-4">{tf("auto.ba0d2125e463b571")}</p>
            </TabsContent>
            <TabsContent value="details">
              <p className="text-sm text-muted-foreground py-4">{tf("auto.255afa723eaba21f")}</p>
            </TabsContent>
            <TabsContent value="comments">
              <p className="text-sm text-muted-foreground py-4">{tf("auto.e0def86bb69f5775")}</p>
            </TabsContent>
          </Tabs>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  ENTITY ROWS                                                  */}
      {/* ============================================================ */}
      <Section title={tf("auto.6d199ef5141308ed")}>
        <div className="border border-border rounded-md">
          <EntityRow
            leading={
              <>
                <StatusIcon status="in_progress" />
                {/* PAP-411: PriorityIcon hidden behind SHOW_TASK_PRIORITY_UI. */}
                {SHOW_TASK_PRIORITY_UI && <PriorityIcon priority="high" />}
              </>
            }
            identifier="PAP-001"
            title={tf("auto.8b4c3fedf954a051")}
            subtitle={tf("auto.00fdc4441096031e")}
            trailing={<IssueStatusBadge status="in_progress" />}
            onClick={() => {}}
          />
          <EntityRow
            leading={
              <>
                <StatusIcon status="done" />
                {SHOW_TASK_PRIORITY_UI && <PriorityIcon priority="medium" />}
              </>
            }
            identifier="PAP-002"
            title={tf("auto.bbae449675484c25")}
            subtitle={tf("auto.2b00e1ecb757c504")}
            trailing={<IssueStatusBadge status="done" />}
            onClick={() => {}}
          />
          <EntityRow
            leading={
              <>
                <StatusIcon status="todo" />
                {SHOW_TASK_PRIORITY_UI && <PriorityIcon priority="low" />}
              </>
            }
            identifier="PAP-003"
            title={tf("auto.7ffde9f0129f0b9b")}
            trailing={<IssueStatusBadge status="todo" />}
            onClick={() => {}}
          />
          <EntityRow
            leading={
              <>
                <StatusIcon status="blocked" />
                {SHOW_TASK_PRIORITY_UI && <PriorityIcon priority="critical" />}
              </>
            }
            identifier="PAP-004"
            title={tf("auto.edc8c3dc0e695ade")}
            subtitle={tf("auto.c8d7dcd82d29b320")}
            trailing={<IssueStatusBadge status="blocked" />}
            selected
          />
        </div>
        <SubSection title={tf("auto.3ac5eb84ef7ff76b")}>
          <div className="border border-border rounded-md">
            <EntityRow
              title={tf("auto.33c4f605af1e1377")}
              subtitle={tf("auto.232477a5f80bb939")}
              className="group"
              trailing={
                <MembershipAction
                  state="joined"
                  resourceName="Joined resource"
                  onJoin={() => {}}
                  onLeave={() => {}}
                />
              }
            />
            <EntityRow
              title={tf("auto.cdd43bd9e0fec441")}
              subtitle={tf("auto.792ff7ccc7e315b5")}
              className="group text-foreground/55"
              trailing={
                <MembershipAction
                  state="left"
                  resourceName="Left resource"
                  onJoin={() => {}}
                  onLeave={() => {}}
                />
              }
            />
            <EntityRow
              title={tf("auto.64205cc843d51ae4")}
              subtitle={tf("auto.1d2ed02511b09bd7")}
              className="group text-foreground/55"
              trailing={
                <MembershipAction
                  state="left"
                  pending
                  pendingState="left"
                  resourceName="Leaving resource"
                  onJoin={() => {}}
                  onLeave={() => {}}
                />
              }
            />
            <EntityRow
              title={tf("auto.6dcaccef0dd427c0")}
              subtitle={tf("auto.81c33361157a142e")}
              className="group"
              trailing={
                <MembershipAction
                  state="joined"
                  pending
                  pendingState="joined"
                  resourceName="Joining resource"
                  onJoin={() => {}}
                  onLeave={() => {}}
                />
              }
            />
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  FILTER BAR                                                   */}
      {/* ============================================================ */}
      <Section title={tf("auto.75d3ce3739283a7b")}>
        <FilterBar
          filters={filters}
          onRemove={(key) => setFilters((f) => f.filter((x) => x.key !== key))}
          onClear={() => setFilters([])}
        />
        {filters.length === 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFilters([
                { key: "status", label: tf("text.Status"), value: "Active" },
                // PAP-411: priority filter demo row suppressed while SHOW_TASK_PRIORITY_UI is off.
                ...(SHOW_TASK_PRIORITY_UI
                  ? [{ key: "priority", label: tf("text.Priority"), value: "High" } as FilterValue]
                  : []),
              ])
            }
          >
            {tf("auto.10afa98480f2d06c")}
          </Button>
        )}
      </Section>

      {/* ============================================================ */}
      {/*  AVATARS                                                      */}
      {/* ============================================================ */}
      <Section title={tf("auto.fedfdc14d4f7bbb0")}>
        <SubSection title={tf("auto.74a3978d10045c73")}>
          <div className="flex items-center gap-3">
            <Avatar size="sm"><AvatarFallback>{tf("auto.6ff9250a7351ff2f")}</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>{tf("auto.4a3161bbf086290c")}</AvatarFallback></Avatar>
            <Avatar size="lg"><AvatarFallback>{tf("auto.b870b7809747623d")}</AvatarFallback></Avatar>
          </div>
        </SubSection>

        <SubSection title={tf("auto.34ca0e76608842ff")}>
          <AvatarGroup>
            <Avatar><AvatarFallback>A1</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>A2</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>A3</AvatarFallback></Avatar>
            <AvatarGroupCount>+5</AvatarGroupCount>
          </AvatarGroup>
        </SubSection>
      </Section>

      <Section title={tf("auto.b9810433a0411a94")}>
        <SubSection title={tf("auto.ebbfad89e338f3ab")}>
          <div className="flex items-center gap-3">
            <AppLogo
              name="Notion"
              logoUrl="/brands/apps/notion.svg"
              darkLogoUrl="/brands/apps/notion-dark.svg"
              size={36}
            />
            <AppLogo name="Jira" logoUrl="/brands/apps/jira.svg" darkLogoUrl="/brands/apps/jira-dark.svg" size={44} />
            <AppLogo name="Fallback" logoUrl="/brands/apps/does-not-exist.svg" size={36} />
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  IDENTITY                                                     */}
      {/* ============================================================ */}
      <Section title={tf("auto.999f23fcd7bec707")}>
        <SubSection title={tf("auto.74a3978d10045c73")}>
          <div className="flex items-center gap-6">
            <Identity name="Agent Alpha" size="sm" />
            <Identity name="Agent Alpha" />
            <Identity name="Agent Alpha" size="lg" />
          </div>
        </SubSection>

        <SubSection title={tf("auto.9cec7db78edf46ed")}>
          <div className="flex flex-col gap-2">
            <Identity name="CEO Agent" size="sm" />
            <Identity name="Alpha" size="sm" />
            <Identity name="Quality Assurance Lead" size="sm" />
          </div>
        </SubSection>

        <SubSection title={tf("auto.dba050820f8b6600")}>
          <Identity name="Backend Service" initials="BS" size="sm" />
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  TOOLTIPS                                                     */}
      {/* ============================================================ */}
      <Section title={tf("auto.1cfb0bd9a2d1c43a")}>
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">{tf("auto.1d8fb154c6f5adfd")}</Button>
            </TooltipTrigger>
            <TooltipContent>{tf("auto.cf6a28c0c440b506")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm"><Settings /></Button>
            </TooltipTrigger>
            <TooltipContent>{tf("text.Settings")}</TooltipContent>
          </Tooltip>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  DIALOG                                                       */}
      {/* ============================================================ */}
      <Section title={tf("auto.69b51517d04bcfed")}>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">{tf("auto.7482430eea717fab")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{tf("auto.f40917a70065210e")}</DialogTitle>
              <DialogDescription>
                {tf("auto.146d0c0db9e13c11")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>{tf("text.Name")}</Label>
                <Input placeholder={tf("auto.c13b0e0858d5b81b")} className="mt-1.5" />
              </div>
              <div>
                <Label>{tf("text.Description")}</Label>
                <Textarea placeholder={tf("auto.682fdb6b17e54acb")} className="mt-1.5" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">{tf("text.Cancel")}</Button>
              <Button>{tf("text.Save")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      {/* ============================================================ */}
      {/*  EMPTY STATE                                                  */}
      {/* ============================================================ */}
      <Section title={tf("auto.1a9692274dcc6b1f")}>
        <div className="border border-border rounded-md">
          <EmptyState
            icon={Inbox}
            message={tf("auto.93e06ed50fa472a5")}
            action={tf("auto.79d3f1d08f0cfc58")}
            onAction={() => {}}
          />
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  PROGRESS BARS                                                */}
      {/* ============================================================ */}
      <Section title={tf("auto.2faeb28cccd56f15")}>
        <div className="space-y-3">
          {[
            { label: tf("auto.2867ec0792afc0e9"), pct: 40, color: "bg-green-400" },
            { label: tf("auto.92ca76cb48d6b452"), pct: 75, color: "bg-yellow-400" },
            { label: tf("auto.afc09c0882546278"), pct: 95, color: "bg-red-400" },
          ].map(({ label, pct, color }) => (
            <div key={label} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-mono">{pct}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-(--tp-width-background-color) duration-150 ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  LOG VIEWER                                                   */}
      {/* ============================================================ */}
      <Section title={tf("auto.b26528cf21f8b605")}>
        <div className="bg-neutral-950 rounded-lg p-3 font-mono text-xs max-h-80 overflow-y-auto">
          <div className="text-foreground">{tf("auto.d3a5d13f33523eb3")}</div>
          <div className="text-foreground">{tf("auto.a88e2f216a3b00e6")}</div>
          <div className="text-yellow-400">{tf("auto.b5573bcb8304d4f2")}</div>
          <div className="text-foreground">{tf("auto.91e5c5f5f08a46dc")}</div>
          <div className="text-red-400">{tf("auto.65dcd74cdd0ddc86")}</div>
          <div className="text-blue-300">{tf("auto.e1d8a89afe8f0cd3")}</div>
          <div className="text-foreground">{tf("auto.8c3e2f64ade62135")}</div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 animate-pulse" />
              <span className="inline-flex h-full w-full rounded-full bg-blue-500" />
            </span>
            <span className="text-blue-600 dark:text-blue-400">{tf("auto.b64ac05f17e64d03")}</span>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  PROPERTY ROW PATTERN                                         */}
      {/* ============================================================ */}
      <Section title={tf("auto.f7883e78ba05f24c")}>
        <div className="border border-border rounded-md p-4 space-y-1 max-w-sm">
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-muted-foreground">{tf("text.Status")}</span>
            <StatusBadge status="active" />
          </div>
          {/* PAP-411: priority metadata row hidden behind SHOW_TASK_PRIORITY_UI. */}
          {SHOW_TASK_PRIORITY_UI && (
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs text-muted-foreground">{tf("text.Priority")}</span>
              <PriorityIcon priority="high" />
            </div>
          )}
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-muted-foreground">{tf("auto.bc110a6d0722098a")}</span>
            <div className="flex items-center gap-1.5">
              <Avatar size="sm"><AvatarFallback>A</AvatarFallback></Avatar>
              <span className="text-xs">{tf("auto.d47b013c22ecd4b7")}</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-muted-foreground">{tf("text.Created")}</span>
            <span className="text-xs">{tf("auto.618176e8e31f7945")}</span>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  NAVIGATION PATTERNS                                          */}
      {/* ============================================================ */}
      <Section title={tf("auto.423846c4e3edbcaa")}>
        <SubSection title={tf("auto.25f7f290585c8c64")}>
          <AgentChatPickerExample />
        </SubSection>
        <SubSection title={tf("auto.51d712dbf5fa3728")}>
          <p className="text-sm text-muted-foreground">
            Layout accepts sidebarSections to compose additional SidebarSection groups inside the shared sidebar.
            Use SidebarNavItem for each row, with sibling action buttons for starring or menus.
            The Chats section shows starred agents, the earliest-created agent when unstarred, then four recent agents without duplicates. Compose and star controls share a vertical column. Compose appears on hover or keyboard focus and remains visible on touch; starred icons remain visible. The picker searches all company agents by name or role without a subtitle, count, continuation labels, or footer. Task breadcrumbs support leading identity and trailing actions beside the label, including single-item task headers; see the Agent chat Storybook.
          </p>
          <Card className="block w-60 p-3 space-y-0.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-accent text-accent-foreground">
              <LayoutDashboard className="h-4 w-4" />
              {tf("text.Dashboard")}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground cursor-pointer">
              <CircleDot className="h-4 w-4" />
              {tf("auto.666067dd376e5d45")}
              <Badge variant="ghost" className="ml-auto bg-primary text-primary-foreground px-1.5">
                12
              </Badge>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground cursor-pointer">
              <Bot className="h-4 w-4" />
              {tf("text.Agents")}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground cursor-pointer">
              <Hexagon className="h-4 w-4" />
              {tf("text.Projects")}
            </div>
          </Card>
        </SubSection>

        <SubSection title={tf("auto.3f2f0df8a6c314c5")}>
          <div className="flex items-center border border-border rounded-md w-fit">
            <button className="px-3 py-1.5 text-xs font-medium bg-accent text-foreground rounded-l-md">
              <ListTodo className="h-3.5 w-3.5 inline mr-1" />
              {tf("auto.6f202f54a7b2d8fe")}
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent/50 rounded-r-md">
              <Target className="h-3.5 w-3.5 inline mr-1" />
              {tf("nav.org")}
            </button>
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  GROUPED LIST (Issues pattern)                                */}
      {/* ============================================================ */}
      <Section title={tf("auto.b43e0a874c2e129c")}>
        <div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-t-md">
            <StatusIcon status="in_progress" />
            <span className="text-sm font-medium">{tf("auto.b4cc4b07c300103a")}</span>
            <span className="text-xs text-muted-foreground ml-1">2</span>
          </div>
          <div className="border border-border rounded-b-md">
            {/* PAP-411: leading PriorityIcon hidden behind SHOW_TASK_PRIORITY_UI. */}
            <EntityRow
              leading={SHOW_TASK_PRIORITY_UI ? <PriorityIcon priority="high" /> : undefined}
              identifier="PAP-101"
              title={tf("auto.d355e8ac90cba300")}
              onClick={() => {}}
            />
            <EntityRow
              leading={SHOW_TASK_PRIORITY_UI ? <PriorityIcon priority="medium" /> : undefined}
              identifier="PAP-102"
              title={tf("auto.abd57cbb8de0a8d2")}
              onClick={() => {}}
            />
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  COMMENT THREAD PATTERN                                       */}
      {/* ============================================================ */}
      <Section title={tf("auto.9e84ba5b991155c5")}>
        <div className="space-y-3 max-w-2xl">
          <h3 className="text-sm font-semibold">{tf("auto.88e500512f4fed24")}</h3>
          <div className="space-y-3">
            <div className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">{tf("text.Agent")}</span>
                <span className="text-xs text-muted-foreground">{tf("auto.618176e8e31f7945")}</span>
              </div>
              <p className="text-sm">{tf("auto.6a5b34f345f6fcb9")}</p>
            </div>
            <div className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">{tf("auto.9ffa865f2bc6e850")}</span>
                <span className="text-xs text-muted-foreground">{tf("auto.68db3dbe2bd559b0")}</span>
              </div>
              <p className="text-sm">{tf("auto.ad6210e97b69fc1e")}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Textarea placeholder={tf("auto.4dff58ab6888329d")} rows={3} />
            <Button size="sm">{tf("text.Comment")}</Button>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  COST TABLE PATTERN                                           */}
      {/* ============================================================ */}
      <Section title={tf("auto.48212c43111b7717")}>
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead className="border-b border-border bg-accent/20">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">{tf("text.Model")}</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">{tf("text.Tokens")}</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">{tf("text.Cost")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-3 py-2">{tf("auto.8cb50e5cf14a42a3")}</td>
                <td className="px-3 py-2 font-mono">1.2M</td>
                <td className="px-3 py-2 font-mono">$18.00</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-3 py-2">{tf("auto.e7f937c50f7c473c")}</td>
                <td className="px-3 py-2 font-mono">500k</td>
                <td className="px-3 py-2 font-mono">$1.25</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium">{tf("text.Total")}</td>
                <td className="px-3 py-2 font-mono">1.7M</td>
                <td className="px-3 py-2 font-mono font-medium">$19.25</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  SKELETONS                                                    */}
      {/* ============================================================ */}
      <Section title={tf("auto.f6fb698c6074f81c")}>
        <SubSection title={tf("auto.010dd7b94f5f3d31")}>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-8 w-full max-w-sm" />
            <Skeleton className="h-20 w-full" />
          </div>
        </SubSection>

        <SubSection title={tf("auto.39ecd32d5578bae1")}>
          <div className="border border-border rounded-md p-4">
            <PageSkeleton variant="list" />
          </div>
        </SubSection>

        <SubSection title={tf("auto.0a8ae9fd12855918")}>
          <div className="border border-border rounded-md p-4">
            <PageSkeleton variant="detail" />
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  SEPARATOR                                                    */}
      {/* ============================================================ */}
      <Section title={tf("auto.be237eda7fff4fd3")}>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{tf("auto.0abba441f16eff90")}</p>
          <Separator />
          <div className="flex items-center gap-4 h-8">
            <span className="text-sm">{tf("auto.58eb9032e3bb83f0")}</span>
            <Separator orientation="vertical" />
            <span className="text-sm">{tf("auto.883361d5d682a157")}</span>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  ICON REFERENCE                                               */}
      {/* ============================================================ */}
      {/*  TEAM CATALOG                                                 */}
      {/* ============================================================ */}
      <Section title={tf("auto.d2fa1c21f5de6041")}>
        <p className="text-sm text-muted-foreground">
          Components from the Team Catalog browse/install surface (<code className="font-mono text-xs">/teams-catalog</code>).
          Fixtures are shared with the Storybook stories.
        </p>

        <SubSection title={tf("auto.ae39d7cf2e420451")}>
          <div className="w-(--sz-28rem) rounded-md border border-border">
            <div className="px-3 py-2 text-(length:--text-micro) font-semibold uppercase tracking-wide text-muted-foreground">
              {tf("auto.f2ee24d4b86a3b90")}
            </div>
            <TeamRow team={sampleTeam} selected onSelect={() => {}} />
            <div className="px-3 py-2 text-(length:--text-micro) font-semibold uppercase tracking-wide text-muted-foreground">
              {tf("auto.934c00b04ec97585")}
            </div>
            <TeamRow team={optionalTeam} selected={false} onSelect={() => {}} />
            <div className="px-3 py-2 text-(length:--text-micro) font-semibold uppercase tracking-wide text-muted-foreground">
              {tf("auto.a893f422953ef8d2")}
            </div>
            <TeamRow team={sampleTeam} selected={false} onSelect={() => {}} installed={outOfDateInstalledState} />
            <TeamRow team={warnTeam} selected={false} onSelect={() => {}} installed={currentInstalledState} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Installed teams collapse under <code className="font-mono">{tf("auto.4d29db5a2b3fe8fa")}</code>; an out-of-date
            install (server <code className="font-mono">{tf("auto.18dcaefc7047b6e2")}</code> ≠ catalog <code className="font-mono">{tf("auto.3a84b2f508f5b930")}</code>)
            shows the amber <code className="font-mono">↑</code> badge (PAP-10256).
          </p>
        </SubSection>

        <SubSection title={tf("auto.74466b3f53185959")}>
          <p className="text-xs text-muted-foreground">
            Square tile for the onboarding &ldquo;Pick a starter team&rdquo; grid. Selected tile gets{" "}
            <code className="font-mono">{tf("auto.6b97ab5288dc8024")}</code>. Drives the{" "}
            <code className="font-mono">{tf("auto.d3aa53d1750dcff8")}</code> simplified flow.
          </p>
          <TeamCardShowcase />
        </SubSection>

        <SubSection title={tf("auto.49f0bc9751dc2f53")}>
          <div className="max-w-md">
            <TeamHierarchyPreview team={sampleTeam} />
          </div>
        </SubSection>

        <SubSection title={tf("auto.eebc853548c83844")}>
          <div className="max-w-xl">
            <RequiredSkillsList skills={sampleTeam.requiredSkills} />
          </div>
        </SubSection>

        <SubSection title={tf("auto.e0e1d2ba122f776d")}>
          <div className="max-w-xl">
            <EnvInputsList inputs={sampleTeam.envInputs} />
          </div>
        </SubSection>

        <SubSection title={tf("auto.f3b51cdfc294672b")}>
          <div className="max-w-xl">
            <ExternalSourcesList sources={sampleTeam.sourceRefs} />
          </div>
        </SubSection>

        <SubSection title={tf("auto.3c591dbb928e2dfc")}>
          <div className="max-w-xl rounded-md border border-border p-4">
            <StepSourcePolicy
              team={warnTeam}
              allowExternalSources={allowExternal}
              allowUnpinnedOptionalSources={allowUnpinned}
              allowLocalPathSources={allowLocalPath}
              onChange={(key, value) => {
                if (key === "external") setAllowExternal(value);
                if (key === "unpinned") setAllowUnpinned(value);
                if (key === "localPath") setAllowLocalPath(value);
              }}
            />
          </div>
        </SubSection>

        <SubSection title={tf("auto.29edcbc5c321b75c")}>
          <div className="max-w-xl rounded-md border border-border p-4">
            <StepSkillPlan team={sampleTeam} preparations={sampleSkillPreparations} />
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section title={tf("auto.fcdd09a5007f83d7")}>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {[
            ["Inbox", Inbox],
            ["ListTodo", ListTodo],
            ["CircleDot", CircleDot],
            ["Hexagon", Hexagon],
            ["Target", Target],
            ["LayoutDashboard", LayoutDashboard],
            ["Bot", Bot],
            ["DollarSign", DollarSign],
            ["History", History],
            ["Search", Search],
            ["Plus", Plus],
            ["Trash2", Trash2],
            ["Settings", Settings],
            ["User", User],
            ["Mail", Mail],
            ["Upload", Upload],
            ["Zap", Zap],
          ].map(([name, Icon]) => {
            const LucideIcon = Icon as React.FC<{ className?: string }>;
            return (
              <div key={name as string} className="flex flex-col items-center gap-1.5 p-2">
                <LucideIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-(length:--text-nano) text-muted-foreground font-mono">{name as string}</span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  KEYBOARD SHORTCUTS                                           */}
      {/* ============================================================ */}
      <Section title={tf("auto.59cdaa26dd9dcd4c")}>
        <div className="border border-border rounded-md divide-y divide-border text-sm">
          {[
            ["Cmd+K / Ctrl+K", "Open Command Palette"],
            ["C", "New Issue (outside inputs)"],
            ["[", "Toggle Sidebar"],
            ["]", "Toggle Properties Panel"],

            ["Cmd+Enter / Ctrl+Enter", "Submit markdown comment"],
          ].map(([key, desc]) => (
            <div key={key} className="flex items-center justify-between px-4 py-2">
              <span className="text-muted-foreground">{desc}</span>
              <kbd className="px-2 py-0.5 text-xs font-mono bg-muted rounded border border-border">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </Section>

      <Section title={tf("auto.3ae7b4b1d349bc1a")}>
        <SubSection title={tf("auto.0cf1290bdfbc3041")}>
          <IssueOutputSection workProducts={DESIGN_GUIDE_OUTPUTS} />
        </SubSection>
        <SubSection title={tf("auto.21e539925495ff97")}>
          <IssueOutputSection workProducts={DESIGN_GUIDE_DEGRADED_OUTPUTS} />
        </SubSection>
        <SubSection title={tf("auto.b725568f17565cd9")}>
          <p className="text-xs text-muted-foreground">
            When an issue has produced no artifact work products, the Output section renders nothing
            at all (no placeholder card).
          </p>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      {/*  TOOLS & ACCESS (PAP-10389)                                   */}
      {/* ============================================================ */}
      <Section title={tf("auto.168341ff2207b6b8")}>
        <SubSection title={tf("auto.4957fe676d3ebac0")}>
          <div className="space-y-3">
            <EnforcementBanner companyId="" forceVariant="default" recentDenialCount={0} />
            <EnforcementBanner companyId="" forceVariant="denied-detected" recentDenialCount={3} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Persistent at the top of the Tools &amp; Access surface. Tints to <code>{tf("auto.01d5fda3a801adf5")}</code> when
            governed tool calls were denied or failed in the last hour. Observability only — enforcement lives
            in the tool gateway.
          </p>
        </SubSection>

        <SubSection title={tf("auto.ecfa53bbd55956d5")}>
          <div className="space-y-3">
            <EnforcementBanner
              tone="info"
              title={tf("auto.62affc02b3698062")}
              body="This is exactly what the tool gateway will accept. Profile and policy edits reflect within ~5s; the prompt cannot expand it."
            />
            <EnforcementBanner
              tone="warning"
              title={tf("auto.ec72dcff658c803b")}
              body="A local-stdio slot runs with the orchestrator's privileges. Only bind trusted commands; quarantine anything you would not run yourself."
            />
            <EnforcementBanner
              tone="error"
              title={tf("auto.182c306e62c1d803")}
              body="The supervisor is restarting (attempt 2/3). The gateway returns runtime-error and the agent does not see partial output."
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Static governance copy with a tone. Used for the PAP-10400 trust-tier banner on Runtime and the
            effective-access banner on Agent → Tools. Pass <code>{tf("auto.aaf2320646108059")}</code>/<code>{tf("auto.230d8358dc8e8890")}</code> and an optional{" "}
            <code>{tf("auto.c2d4b446a44ce54f")}</code>.
          </p>
        </SubSection>

        <SubSection title={tf("auto.f3f8dba90e704468")}>
          <div className="grid gap-4 lg:grid-cols-2">
            <ActionCard
              toolName="slack.post_message"
              risk="medium"
              isWrite
              binding={{
                application: "Slack",
                manifestVersion: "2.4.1",
                connection: "https://slack.com/api · acme-workspace",
                catalogSha256: "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
                payloadSha256: "sha256:2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
              }}
              input={{ channel: "#launch", text: "Deploy v2 is live 🎉", unfurl_links: false }}
              reason="This tool can write to your workspace, so a human signs off before the agent posts."
              policyNumber={7}
              expiresInLabel="expires in 23h 51m"
            />
            <ActionCard
              variant="stale"
              toolName="slack.post_message"
              risk="medium"
              isWrite
              binding={{
                application: "Slack",
                manifestVersion: "2.4.1",
                connection: "https://slack.com/api · acme-workspace",
                catalogSha256: "sha256:7d793037a0760186574b0282f2f435e7a4b1b2b0b822cd15d6c15b0f00a0e3f1",
                previousCatalogSha256: "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
                payloadSha256: "sha256:2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
              }}
              input={{ channel: "#launch", text: "Deploy v2 is live 🎉", unfurl_links: false }}
              reason="This tool can write to your workspace, so a human signs off before the agent posts."
              policyNumber={7}
              expiresInLabel="expires in 18h 02m"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Signed payload sha256 + expiry surface on every variant (PAP-10400). The{" "}
            <code>{tf("auto.a03f2386ae06b211")}</code> variant tints the border amber, banners the catalog-hash mismatch, strikes through
            the previous hash next to the current one, and renders <code>{tf("text.Approve")}</code> disabled until the request
            is re-issued.
          </p>
        </SubSection>

        <SubSection title={tf("auto.22124d879bdf28bc")}>
          <div className="w-(--sz-390px) max-w-full rounded-xl border border-border bg-background p-3">
            <ActionCardMobile
              toolName="slack.post_message"
              risk="medium"
              isWrite
              binding={{
                application: "Slack",
                manifestVersion: "2.4.1",
                connection: "https://slack.com/api · acme-workspace",
                catalogSha256: "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
                payloadSha256: "sha256:2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
              }}
              input={{ channel: "#launch", text: "Deploy v2 is live 🎉" }}
              reason="This tool can write to your workspace, so a human signs off before the agent posts."
              policyNumber={7}
              expiresInLabel="expires in 23h 51m"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Identical content; the three buttons stack full-width in the order Approve / Deny / Edit &amp; re-sign,
            and the bindings table uses a 70px label column.
          </p>
        </SubSection>

        <SubSection title={tf("auto.412f4ae6c2f72bb2")}>
          <BindingsTable
            rows={[
              { label: tf("auto.e7ad522ea327e5ba"), value: "Slack · manifest v2.4.1" },
              { label: tf("auto.639a40e82b9a96f0"), value: "https://slack.com/api · acme-workspace", mono: true },
              { label: tf("auto.3877d14889a9909b"), value: "sha256:9f86d081…f00a08", mono: true },
              { label: tf("auto.99733344956dde48"), value: "sha256:2c26b46b…66e7ae", mono: true },
            ]}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Two-column key/value block with mono values. Lives inside <code>{tf("auto.c498ca0bf348b20a")}</code> and is reused
            standalone in the audit row drilldown.
          </p>
        </SubSection>

        <SubSection title={tf("auto.6c64d2c42b88eadb")}>
          <div className="flex flex-wrap items-center gap-2">
            {[
              "allowed", "denied", "block", "require-approval", "redacted", "rate-limit",
              "deferred", "hidden", "quarantined", "healthy", "degraded", "runtime-error", "unchecked",
            ].map((s) => (
              <StatusBadge key={s} status={s} />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Policy decisions, connection/runtime health, and catalog quarantine all route through the canonical{" "}
            <code>{tf("auto.8ac888d3088bafbe")}</code> keys defined in <code>lib/status-colors</code>.
          </p>
        </SubSection>

        <SubSection title={tf("auto.b3132a7efcd3059b")}>
          <EmptyState
            icon={Inbox}
            message={tf("auto.8697571e96e71c3b")}
            description={tf("auto.99930f064a466438")}
            action={tf("auto.729bceeec8165d77")}
            onAction={() => {}}
          />
        </SubSection>
      </Section>

      <Section title={tf("auto.b3c50ea6be99b939")}>
        <p className="text-sm text-muted-foreground">
          A broker connection (Composio) fronts many services, so its detail page lists toolkits
          with per-service state instead of one credential. Row state comes from Composio's own
          account status, which is why there is a fourth <code>{tf("auto.e0787d272a439bb7")}</code> state alongside the
          three the design asks for: an expired credential is neither connected nor still settling.
        </p>
        <SubSection title={tf("auto.f4087360c028486b")}>
          <ServicesList
            rows={DESIGN_GUIDE_COMPOSIO_ROWS}
            busySlug={null}
            onConnect={() => {}}
            onRecheck={() => {}}
            onDisconnect={() => {}}
          />
        </SubSection>
        <SubSection title={tf("auto.bd82177544118ea2")}>
          <ServicesList
            rows={[DESIGN_GUIDE_COMPOSIO_ROWS[2]!]}
            busySlug={DESIGN_GUIDE_COMPOSIO_ROWS[2]!.toolkitSlug}
            onConnect={() => {}}
            onRecheck={() => {}}
            onDisconnect={() => {}}
          />
        </SubSection>
        <SubSection title={tf("auto.be0de511f93b8fb5")}>
          <p className="mb-2 text-xs text-muted-foreground">
            Shown wherever a brokered child connection appears, so the parent/child coupling is
            legible. Links to the broker's Services tab when the parent is known.
          </p>
          <div className="flex items-center gap-3">
            <ComposioProvenanceChip
              connection={{
                config: { provider: "composio", parentConnectionId: "parent-1", toolkitSlug: "github" },
              }}
            />
            <ComposioProvenanceChip
              connection={{ config: { provider: "composio", toolkitSlug: "gmail" } }}
            />
          </div>
        </SubSection>
      </Section>

      <Section title={tf("auto.e0eeae29ab3b67d8")}>
        <SubSection title={tf("auto.bbc2c7c5589e424f")}>
          <RepositoryEditor selected={[]} onChange={() => {}} state="disconnected" onConnect={() => {}} onRetry={() => {}} />
        </SubSection>
        <SubSection title={tf("auto.8cc1dc4e70aee51f")}>
          <RepositoryEditor selected={[{ id: "1", fullName: "paperclipai/paperclip", url: "https://github.com/paperclipai/paperclip", connections: ["Your GitHub"] }]}
            available={[{ id: "2", fullName: "paperclipai/docs", url: "https://github.com/paperclipai/docs", connections: ["Company GitHub"] }]}
            onChange={() => {}} onConnect={() => {}} onRetry={() => {}} />
        </SubSection>
        <p className="text-sm text-muted-foreground">{tf("auto.32c000752b55ce11")}</p>
      </Section>

      <Section title={tf("auto.069e0a9758ebb27f")}>
        <p className="text-sm text-muted-foreground">
          Reusable env-var editor (agents, projects, environments, routines). One shared grid, an
          in-field Text/Secret source switch, a fuzzy secret picker with a pinned “Create secret”
          item, automatic sensitive-value detection, and inline secret-health warnings. See the
          Storybook <span className="font-mono">{tf("auto.732eaa27f3846b52")}</span> stories
          for all 10 states.
        </p>
        <EnvironmentVariablesEditorShowcase />
      </Section>

      <Section title={tf("auto.74fdf58160e6990a")}>
        <SubSection title={tf("auto.7ba2ef0819d42345")}>
          <div className="max-w-xl">
            <TaskDetailTasksPanel
              subtasks={[DESIGN_GUIDE_TASK]}
              createdTasks={[
                { ...DESIGN_GUIDE_TASK, projectId: "design-board", project: { id: "design-board", name: "Board UI" } as Issue["project"] },
                { ...DESIGN_GUIDE_TASK, id: "design-followup", identifier: "PAP-428", title: tf("auto.36392fa802e586ea"), status: "todo", projectId: null },
              ]}
              projects={[]}
            />
          </div>
        </SubSection>
        <SubSection title={tf("auto.a89ee7969a825869")}>
          <TaskDetailTasksPanel subtasks={[]} createdTasks={[]} projects={[]} />
          <TaskDetailTasksPanel subtasks={[]} createdTasks={[]} projects={[]} isLoading />
          <TaskDetailTasksPanel subtasks={[]} createdTasks={[]} projects={[]} hasError onRetry={() => {}} />
        </SubSection>
      </Section>

      <Section title={tf("auto.ce899bed4548cc7b")}>
        <p className="text-sm text-muted-foreground">
          Recovery runs in the background. Task lists keep their ordinary status without
          execution badges. Active transcript headers keep saying Working during automatic
          recovery. Recovery decisions and attempts belong in the run log;
          there is no execution status card or reconciliation form.
        </p>
      </Section>

      <Section title={tf("auto.90ca15689b00fc63")}>
        <SavedProviderKeySelect options={[{ id: "example", label: tf("auto.fa51d00e7b5a0efb"), binding: { type: "user_secret_ref", key: "ANTHROPIC_API_KEY", version: "latest" } }]} value="example" onChange={() => {}} loading={false} error={false} />
        <SavedProviderKeySelect options={[]} value="" onChange={() => {}} loading error={false} />
        <SavedProviderKeySelect options={[]} value="" onChange={() => {}} loading={false} error />
      </Section>

      <Section title={tf("auto.7a2a4540aa01f2cd")}>
        <p className="text-sm text-muted-foreground">
          The task card is the dialog host for the shared connection setup flow. Provider forms,
          validation, OAuth, access selection, and completion come from the same feature module as
          the full-page Apps setup; this card owns only audience, dialog, and task refresh behavior.
          Pending connections stay in the timeline beside a usable composer. The independently
          addressable Connections/In-task connections stories cover access, OAuth recovery, narrow
          layouts, completion, and historical outcomes.
        </p>
        <div className="grid gap-4 xl:grid-cols-3">
          <IssueThreadInteractionCard
            interaction={pendingConnectionIntentInteraction}
            currentUserId={issueThreadInteractionFixtureMeta.currentUserId}
          />
          <IssueThreadInteractionCard
            interaction={retryConnectionIntentInteraction}
            currentUserId={issueThreadInteractionFixtureMeta.currentUserId}
          />
          <IssueThreadInteractionCard
            interaction={connectedConnectionIntentInteraction}
            currentUserId={issueThreadInteractionFixtureMeta.currentUserId}
          />
        </div>
      </Section>

      <Section title={tf("auto.4f98ed3771b82232")}>
        <p className="text-sm text-muted-foreground">
          Design-system wrapper over <span className="font-mono">{tf("auto.317449096a235105")}</span>{" "}
          (Skill Studio D2). Drag a handle to resize; panels accept percentage or pixel
          (<span className="font-mono">{tf("auto.0210b75ecfb31dc7")}</span>) constraints and the middle panel is
          collapsible. Use anywhere a split view is needed.
        </p>
        <div className="h-48 max-w-2xl overflow-hidden rounded-md border border-border">
          <ResizablePanelGroup>
            <ResizablePanel id="a" minSize="120px" className="bg-muted/30">
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                {tf("auto.e1010dcdb8e2fcbe")}
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel id="b" minSize="120px" collapsible collapsedSize="40px" className="bg-muted/10">
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                {tf("auto.9e3c09a5638be666")}
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel id="c" minSize="120px" className="bg-muted/30">
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                {tf("auto.8a631860e6e24118")}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  INLINE BANNER + BUILT-IN AGENTS                              */}
      {/* ============================================================ */}
      <Section title={tf("auto.15aba1d3e0ec11c2")}>
        <p className="text-sm text-muted-foreground">
          Token-backed full-width notice (<span className="font-mono">{tf("auto.0f38377798cd3d0e")}</span> tones). Use{" "}
          <span className="font-mono">{tf("auto.06271baf49532c87")}</span> for provenance/context and{" "}
          <span className="font-mono">{tf("auto.4bd9354bb6522334")}</span> for paused/attention. Supports an optional bold
          title and a trailing actions slot. Replaces hand-rolled{" "}
          <span className="font-mono">{tf("auto.40ebfdc4fddb62b2")}</span>/<span className="font-mono">{tf("auto.ccd9ef468c65f1dd")}</span>{" "}
          banners.
        </p>
        <div className="space-y-3">
          <InlineBanner
            tone="info"
            title={tf("auto.4bdd2857aa666efe")}
            actions={<Button variant="outline" size="sm">{tf("auto.e240e635ff6dce4f")}</Button>}
          >
            Ships with Paperclip and powers <strong>{tf("auto.997b201dacec1e25")}</strong>. It can be paused but not deleted.
          </InlineBanner>
          <InlineBanner
            tone="warning"
            title={tf("auto.2cea4b8c3fd3a644")}
            actions={
              <>
                <Button variant="ghost" size="sm">{tf("auto.7ce7832e35e85d35")}</Button>
                <Button size="sm">{tf("auto.0bb60c4501919e6a")}</Button>
              </>
            }
          >
            {tf("auto.1deb8deeb7fa4f45")}
          </InlineBanner>
          <InlineBanner
            tone="danger"
            title={tf("auto.6a0cb00af80d234a")}
            actions={<Button size="sm">{tf("text.Retry")}</Button>}
          >
            {tf("auto.ad3323b16b9d47b2")}
          </InlineBanner>
          <InlineBanner tone="info" compact>
            {tf("auto.aa514eb48295811a")}
          </InlineBanner>
        </div>
      </Section>

      <Section title={tf("auto.7d8087278dd6c3ae")}>
        <AiConnectionDesignExamples />
      </Section>

      <Section title={tf("auto.c6dd7903abd15a1f")}>
        <p className="text-sm text-muted-foreground">
          A derived lifecycle chip (amber) for attention states. The lifecycle chip is separate from
          the agent status vocabulary and only shows for{" "}
          <span className="font-mono">{tf("auto.a2989bf3b050aba4")}</span> / <span className="font-mono">{tf("auto.92950a08d178acc4")}</span>.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <BuiltInLifecycleChip status="needs_setup" />
          <BuiltInLifecycleChip status="pending_approval" />
          <BuiltInLifecycleChip status="needs_setup" compact />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="font-mono">&lt;BuiltInAgentGate agentKey&gt;</span> composes{" "}
          <span className="font-mono">{tf("auto.e86e1cc8ddac4e90")}</span> + <span className="font-mono">{tf("auto.a422df8c8b26372d")}</span>{" "}
          + <span className="font-mono">{tf("auto.5825a2ca81c8e03b")}</span> to render the loading / setup /
          pending-approval / paused / ready states of a feature that depends on a built-in agent.
        </p>
      </Section>
    </div>
  );
}
