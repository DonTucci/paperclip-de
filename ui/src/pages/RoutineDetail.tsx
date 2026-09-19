import { tf } from "@/i18n/fork";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "@/lib/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, History, Pencil, Repeat, Sparkles, X } from "lucide-react";
import { ApiError } from "../api/client";
import {
  routinesApi,
  type RoutineTriggerResponse,
  type RotateRoutineTriggerResponse,
  type RestoreRoutineRevisionResponse,
} from "../api/routines";
import { secretsApi } from "../api/secrets";
import { type RoutineHistoryDirtyFieldDescriptor } from "../components/RoutineHistoryTab";
import { heartbeatsApi } from "../api/heartbeats";
import { agentsApi } from "../api/agents";
import { projectsApi } from "../api/projects";
import { accessApi } from "../api/access";
import { useCompany } from "../context/CompanyContext";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { useToastActions } from "../context/ToastContext";
import { useStreamlinedUiEnabled } from "../hooks/useStreamlinedUiEnabled";
import { queryKeys } from "../lib/queryKeys";
import { copyTextToClipboard } from "../lib/clipboard";
import { buildMarkdownMentionOptions } from "../lib/company-members";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { EmptyState } from "../components/EmptyState";
import { PageSkeleton } from "../components/PageSkeleton";
import { type InlineEntityOption } from "../components/InlineEntitySelector";
import { type MarkdownEditorRef, type MentionOption } from "../components/MarkdownEditor";
import {
  RoutineRunVariablesDialog,
  type RoutineRunDialogSubmitData,
} from "../components/RoutineRunVariablesDialog";
import { RunButton } from "../components/AgentActionButtons";
import { getRecentAssigneeIds, sortAgentsByRecency, trackRecentAssignee } from "../lib/recent-assignees";
import { getRecentProjectIds, trackRecentProject } from "../lib/recent-projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoutineOverview } from "../components/RoutineOverview";
import { RoutineSectionPicker, RoutineSubSidebar } from "../components/RoutineSubSidebar";
import {
  isRoutineDetailView,
  resolveRoutineDetailDestination,
  routineDetailHref,
} from "../components/RoutineContextualSidebar";
import { RoutineSaveBar } from "../components/RoutineSaveBar";
import {
  EDITABLE_SECTIONS,
  SECTION_FIELD_KEYS,
  RoutineDetailContext,
  createDefaultNewTrigger,
  type RoutineDetailContextValue,
  type RoutineEditDraft,
  type RoutineSectionKey,
  type SecretMessage,
} from "../components/routine-sections/context";
import {
  OverviewSection,
  TriggersSection,
  VariablesSection,
  SecretsSection,
  DeliverySection,
} from "../components/routine-sections/editable-sections";
import {
  ActivitySection,
  HistorySection,
  RunsSection,
} from "../components/routine-sections/operate-sections";
import type {
  RoutineDetail as RoutineDetailType,
  RoutineEnvConfig,
  RoutineVariable,
} from "@paperclipai/shared";

export function buildRoutineProjectOptions(
  projects: ReadonlyArray<{ id: string; name: string; description?: string | null; archivedAt?: Date | string | null }>,
): InlineEntityOption[] {
  return projects
    .filter((project) => !project.archivedAt)
    .map((project) => ({
      id: project.id,
      label: project.name,
      searchText: project.description ?? "",
    }));
}

const SECTION_TITLES: Record<RoutineSectionKey, string> = {
  overview: "Overview",
  triggers: "Schedule",
  variables: "Variables",
  secrets: "Secrets",
  delivery: "Delivery",
  runs: "Runs",
  activity: "Activity",
  history: "Version history",
};

function autoResizeTextarea(element: HTMLTextAreaElement | null) {
  if (!element) return;
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
}

function getLocalTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

function buildRoutineMutationPayload(input: RoutineEditDraft) {
  return {
    ...input,
    description: input.description.trim() || null,
    projectId: input.projectId || null,
    assigneeAgentId: input.assigneeAgentId || null,
    env: input.env && Object.keys(input.env).length > 0 ? input.env : null,
  };
}

export function RoutineDetail() {
  const { routineId, section: sectionParam } = useParams<{ routineId: string; section?: string }>();
  const { selectedCompanyId } = useCompany();
  const { setBreadcrumbs } = useBreadcrumbs();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pushToast } = useToastActions();
  const { enabled: streamlinedUiEnabled } = useStreamlinedUiEnabled();
  const hydratedRoutineIdRef = useRef<string | null>(null);
  const titleInputRef = useRef<HTMLTextAreaElement | null>(null);
  const descriptionEditorRef = useRef<MarkdownEditorRef>(null);
  const assigneeSelectorRef = useRef<HTMLButtonElement | null>(null);
  const projectSelectorRef = useRef<HTMLButtonElement | null>(null);
  const [secretMessage, setSecretMessage] = useState<SecretMessage | null>(null);
  const [saveConflict, setSaveConflict] = useState(false);
  const [runVariablesOpen, setRunVariablesOpen] = useState(false);
  const [overviewEditing, setOverviewEditing] = useState(false);
  const [newTrigger, setNewTrigger] = useState(createDefaultNewTrigger);
  const [editDraft, setEditDraft] = useState<RoutineEditDraft>({
    title: "",
    description: "",
    projectId: "",
    assigneeAgentId: "",
    priority: "medium",
    concurrencyPolicy: "coalesce_if_active",
    catchUpPolicy: "skip_missed",
    activityGatePolicy: "always",
    activityGateScope: "company",
    variables: [],
    env: null,
  });

  const legacyOperateSection = !streamlinedUiEnabled && (sectionParam === "runs" || sectionParam === "activity")
    ? sectionParam
    : null;
  const section: RoutineSectionKey = legacyOperateSection
    ?? (isRoutineDetailView(sectionParam) ? sectionParam : "overview");

  const navigateToSection = useCallback(
    (next: RoutineSectionKey, options?: { replace?: boolean }) => {
      if (!routineId) return;
      if (!streamlinedUiEnabled && (next === "runs" || next === "activity")) {
        navigate(`/routines/${routineId}/${next}`, { replace: options?.replace ?? true });
        return;
      }
      navigate(
        resolveRoutineDetailDestination({ routineId, section: next }),
        { replace: options?.replace ?? true },
      );
    },
    [navigate, routineId, streamlinedUiEnabled],
  );

  const { data: routine, isLoading, error } = useQuery({
    queryKey: queryKeys.routines.detail(routineId!),
    queryFn: () => routinesApi.get(routineId!),
    enabled: !!routineId,
  });
  const activeIssueId = routine?.activeIssue?.id;
  const { data: liveRuns } = useQuery({
    queryKey: queryKeys.issues.liveRuns(activeIssueId!),
    queryFn: () => heartbeatsApi.liveRunsForIssue(activeIssueId!),
    enabled: !!activeIssueId,
    refetchInterval: 3000,
  });
  const hasLiveRun = (liveRuns ?? []).length > 0;
  const { data: routineRuns } = useQuery({
    queryKey: queryKeys.routines.runs(routineId!),
    queryFn: () => routinesApi.listRuns(routineId!),
    enabled: !!routineId,
    refetchInterval: hasLiveRun ? 3000 : false,
  });
  const relatedActivityIds = useMemo(
    () => ({
      triggerIds: routine?.triggers.map((trigger) => trigger.id) ?? [],
      runIds: routineRuns?.map((run) => run.id) ?? [],
    }),
    [routine?.triggers, routineRuns],
  );
  const { data: activity } = useQuery({
    queryKey: [
      ...queryKeys.routines.activity(selectedCompanyId!, routineId!),
      relatedActivityIds.triggerIds.join(","),
      relatedActivityIds.runIds.join(","),
    ],
    queryFn: () => routinesApi.activity(selectedCompanyId!, routineId!, relatedActivityIds),
    enabled: !!selectedCompanyId && !!routineId && !!routine,
  });
  const { data: agents } = useQuery({
    queryKey: queryKeys.agents.list(selectedCompanyId!),
    queryFn: () => agentsApi.list(selectedCompanyId!),
    enabled: !!selectedCompanyId,
  });
  const { data: projects } = useQuery({
    queryKey: queryKeys.projects.list(selectedCompanyId!, { includeArchived: true }),
    queryFn: () => projectsApi.list(selectedCompanyId!, { includeArchived: true }),
    enabled: !!selectedCompanyId,
  });
  const { data: companyMembers } = useQuery({
    queryKey: queryKeys.access.companyUserDirectory(selectedCompanyId!),
    queryFn: () => accessApi.listUserDirectory(selectedCompanyId!),
    enabled: !!selectedCompanyId,
  });
  const { data: availableSecrets = [] } = useQuery({
    queryKey: selectedCompanyId ? queryKeys.secrets.list(selectedCompanyId) : ["secrets", "none"],
    queryFn: () => secretsApi.list(selectedCompanyId!),
    enabled: Boolean(selectedCompanyId),
  });
  const createSecret = useMutation({
    mutationFn: (input: { name: string; value: string }) => {
      if (!selectedCompanyId) throw new Error("Select an organization to create secrets");
      return secretsApi.create(selectedCompanyId, input);
    },
    onSuccess: () => {
      if (!selectedCompanyId) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.secrets.list(selectedCompanyId) });
    },
  });

  const routineDefaults = useMemo<RoutineEditDraft | null>(
    () =>
      routine
        ? {
            title: routine.title,
            description: routine.description ?? "",
            projectId: routine.projectId ?? "",
            assigneeAgentId: routine.assigneeAgentId ?? "",
            priority: routine.priority,
            concurrencyPolicy: routine.concurrencyPolicy,
            catchUpPolicy: routine.catchUpPolicy,
            activityGatePolicy: routine.activityGatePolicy,
            activityGateScope: routine.activityGateScope,
            variables: routine.variables,
            env: routine.env ?? null,
          }
        : null,
    [routine],
  );
  const dirtyFields = useMemo<RoutineHistoryDirtyFieldDescriptor[]>(() => {
    if (!routineDefaults) return [];
    const result: RoutineHistoryDirtyFieldDescriptor[] = [];
    if (editDraft.title !== routineDefaults.title) result.push({ key: "title", label: tf("auto.09cb2aa33cd8ccd7") });
    if (editDraft.description !== routineDefaults.description) {
      result.push({ key: "description", label: tf("auto.734b09bc156cb750") });
    }
    if (editDraft.projectId !== routineDefaults.projectId) {
      result.push({ key: "projectId", label: tf("auto.059df477b2cb17de") });
    }
    if (editDraft.assigneeAgentId !== routineDefaults.assigneeAgentId) {
      result.push({ key: "assigneeAgentId", label: tf("auto.730b86dbeb212af8") });
    }
    if (editDraft.priority !== routineDefaults.priority) {
      result.push({ key: "priority", label: tf("auto.6b75dd28dd04c1a7") });
    }
    if (editDraft.concurrencyPolicy !== routineDefaults.concurrencyPolicy) {
      result.push({ key: "concurrencyPolicy", label: tf("auto.f6cd91903edd18e7") });
    }
    if (editDraft.catchUpPolicy !== routineDefaults.catchUpPolicy) {
      result.push({ key: "catchUpPolicy", label: tf("auto.d4abae3db21d0959") });
    }
    if (editDraft.activityGatePolicy !== routineDefaults.activityGatePolicy) {
      result.push({ key: "activityGatePolicy", label: tf("auto.ea1331849ead6021") });
    }
    if (editDraft.activityGateScope !== routineDefaults.activityGateScope) {
      result.push({ key: "activityGateScope", label: tf("auto.1f0144102583efe5") });
    }
    if (JSON.stringify(editDraft.variables) !== JSON.stringify(routineDefaults.variables)) {
      result.push({ key: "variables", label: tf("auto.ee87e5c506d7645e") });
    }
    if (JSON.stringify(editDraft.env ?? null) !== JSON.stringify(routineDefaults.env ?? null)) {
      result.push({ key: "env", label: tf("auto.b0cf292870f1c333") });
    }
    return result;
  }, [editDraft, routineDefaults]);
  const isEditDirty = dirtyFields.length > 0;

  const sectionDirtyFields = useCallback(
    (target: RoutineSectionKey) => {
      const keys = SECTION_FIELD_KEYS[target];
      if (!keys) return [];
      return dirtyFields.filter((field) => keys.includes(field.key));
    },
    [dirtyFields],
  );
  const isSectionDirty = useCallback(
    (target: RoutineSectionKey) => sectionDirtyFields(target).length > 0,
    [sectionDirtyFields],
  );
  const discardSection = useCallback(
    (target: RoutineSectionKey) => {
      if (!routineDefaults) return;
      const keys = SECTION_FIELD_KEYS[target];
      if (!keys) return;
      setEditDraft((current) => {
        const next = { ...current } as Record<string, unknown>;
        for (const key of keys) {
          next[key] = (routineDefaults as Record<string, unknown>)[key];
        }
        return next as RoutineEditDraft;
      });
    },
    [routineDefaults],
  );

  useEffect(() => {
    if (!routine) return;
    setBreadcrumbs([{ label: tf("text.Routines"), href: "/routines" }, { label: routine.title }]);
    if (!routineDefaults) return;
    const changedRoutine = hydratedRoutineIdRef.current !== routine.id;
    if (changedRoutine || !isEditDirty) {
      setEditDraft(routineDefaults);
      hydratedRoutineIdRef.current = routine.id;
    }
  }, [routine, routineDefaults, isEditDirty, setBreadcrumbs]);

  useEffect(() => {
    autoResizeTextarea(titleInputRef.current);
  }, [editDraft.title, routine?.id]);

  useEffect(() => {
    if (section !== "overview") setOverviewEditing(false);
  }, [routineId, section]);

  const copySecretValue = useCallback(
    async (label: string, value: string) => {
      try {
        await copyTextToClipboard(value);
        pushToast({ title: `${label} copied`, tone: "success" });
      } catch (copyError) {
        pushToast({
          title: `Failed to copy ${label.toLowerCase()}`,
          body: copyError instanceof Error ? copyError.message: tf("auto.4a4ce72f5a73c4d1"),
          tone: "error",
        });
      }
    },
    [pushToast],
  );

  const saveRoutine = useMutation({
    mutationFn: () => {
      const payload = buildRoutineMutationPayload(editDraft);
      const baseRevisionId = routine?.latestRevisionId ?? null;
      return routinesApi.update(routineId!, {
        ...payload,
        ...(baseRevisionId ? { baseRevisionId } : {}),
      });
    },
    onSuccess: async () => {
      setSaveConflict(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.detail(routineId!) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.list(selectedCompanyId!) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.activity(selectedCompanyId!, routineId!) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.revisions(routineId!) }),
      ]);
    },
    onError: (mutationError) => {
      if (mutationError instanceof ApiError && mutationError.status === 409) {
        setSaveConflict(true);
        pushToast({
          title: tf("auto.cd400efa4e49f559"),
          body: "Someone else updated this routine. Reload to see the latest revision.",
          tone: "warn",
        });
        return;
      }
      pushToast({
        title: tf("auto.34cf35e3379f573c"),
        body: mutationError instanceof Error ? mutationError.message: tf("auto.e2293cfe5ae84a2c"),
        tone: "error",
      });
    },
  });

  const runRoutine = useMutation({
    mutationFn: (data?: RoutineRunDialogSubmitData) =>
      routinesApi.run(routineId!, {
        ...(data?.variables && Object.keys(data.variables).length > 0 ? { variables: data.variables } : {}),
        ...(data?.assigneeAgentId !== undefined ? { assigneeAgentId: data.assigneeAgentId } : {}),
        ...(data?.projectId !== undefined ? { projectId: data.projectId } : {}),
        ...(data?.executionWorkspaceId !== undefined ? { executionWorkspaceId: data.executionWorkspaceId } : {}),
        ...(data?.executionWorkspacePreference !== undefined
          ? { executionWorkspacePreference: data.executionWorkspacePreference }
          : {}),
        ...(data?.executionWorkspaceSettings !== undefined
          ? { executionWorkspaceSettings: data.executionWorkspaceSettings }
          : {}),
      }),
    onSuccess: async () => {
      pushToast({ title: tf("auto.89f08da15094f8fa"), tone: "success" });
      setRunVariablesOpen(false);
      navigateToSection("runs");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.detail(routineId!) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.runs(routineId!) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.list(selectedCompanyId!) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.activity(selectedCompanyId!, routineId!) }),
      ]);
    },
    onError: (runError) => {
      pushToast({
        title: tf("auto.296c7ca6e9b82b39"),
        body: runError instanceof Error ? runError.message: tf("auto.5628bbf83ac3d58d"),
        tone: "error",
      });
    },
  });

  const updateRoutineStatus = useMutation({
    mutationFn: (status: string) => routinesApi.update(routineId!, { status }),
    onSuccess: async (_data, status) => {
      pushToast({
        title: tf("auto.e522b3f651ac1ece"),
        body: status === "paused" ? "Automation paused." : "Automation enabled.",
        tone: "success",
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.detail(routineId!) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.list(selectedCompanyId!) }),
      ]);
    },
    onError: (statusError) => {
      pushToast({
        title: tf("auto.658553fd32ab2e2a"),
        body: statusError instanceof Error ? statusError.message: tf("auto.8a9065aa3123a45e"),
        tone: "error",
      });
    },
  });

  const createTrigger = useMutation({
    mutationFn: async (): Promise<RoutineTriggerResponse> => {
      const existingOfKind = (routine?.triggers ?? []).filter((t) => t.kind === newTrigger.kind).length;
      const autoLabel = existingOfKind > 0 ? `${newTrigger.kind}-${existingOfKind + 1}` : newTrigger.kind;
      return routinesApi.createTrigger(routineId!, {
        kind: newTrigger.kind,
        label: autoLabel,
        ...(newTrigger.kind === "schedule"
          ? { cronExpression: newTrigger.cronExpression.trim(), timezone: getLocalTimezone() }
          : {}),
        ...(newTrigger.kind === "webhook"
          ? { signingMode: newTrigger.signingMode, replayWindowSec: Number(newTrigger.replayWindowSec || "300") }
          : {}),
      });
    },
    onSuccess: async (result) => {
      if (result.secretMaterial) {
        setSecretMessage({
          title: tf("auto.ef8b5535cac3f054"),
          entries: [{ webhookUrl: result.secretMaterial.webhookUrl, webhookSecret: result.secretMaterial.webhookSecret }],
        });
      } else {
        pushToast({ title: tf("auto.bdfe6f7147f9c23c"), body: "The routine schedule was saved.", tone: "success" });
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.detail(routineId!) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.list(selectedCompanyId!) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.activity(selectedCompanyId!, routineId!) }),
      ]);
    },
    onError: (triggerError) => {
      pushToast({
        title: tf("auto.3c4a07f9ab8406f2"),
        body: triggerError instanceof Error ? triggerError.message: tf("auto.fd1dc6005b3dd0ca"),
        tone: "error",
      });
    },
  });

  const updateTrigger = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Record<string, unknown> }) => routinesApi.updateTrigger(id, patch),
    onSuccess: async () => {
      pushToast({ title: tf("auto.85c8b3c8d5e427b8"), body: "The routine cadence update was saved.", tone: "success" });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.detail(routineId!) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.list(selectedCompanyId!) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.activity(selectedCompanyId!, routineId!) }),
      ]);
    },
    onError: (triggerError) => {
      pushToast({
        title: tf("auto.4707ca6abf3f933d"),
        body: triggerError instanceof Error ? triggerError.message: tf("auto.121d437c9c61cf51"),
        tone: "error",
      });
    },
  });

  const deleteTrigger = useMutation({
    mutationFn: (id: string) => routinesApi.deleteTrigger(id),
    onSuccess: async () => {
      pushToast({ title: tf("auto.f05261cf7c2fa31f"), tone: "success" });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.detail(routineId!) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.list(selectedCompanyId!) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.activity(selectedCompanyId!, routineId!) }),
      ]);
    },
    onError: (triggerError) => {
      pushToast({
        title: tf("auto.86096d6fbe637665"),
        body: triggerError instanceof Error ? triggerError.message: tf("auto.79940d23c6581164"),
        tone: "error",
      });
    },
  });

  const rotateTrigger = useMutation({
    mutationFn: (id: string): Promise<RotateRoutineTriggerResponse> => routinesApi.rotateTriggerSecret(id),
    onSuccess: async (result) => {
      setSecretMessage({
        title: tf("auto.7eeaca4f875d2584"),
        entries: [{ webhookUrl: result.secretMaterial.webhookUrl, webhookSecret: result.secretMaterial.webhookSecret }],
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.detail(routineId!) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routines.activity(selectedCompanyId!, routineId!) }),
      ]);
    },
    onError: (triggerError) => {
      pushToast({
        title: tf("auto.1caaab4fa334b792"),
        body: triggerError instanceof Error ? triggerError.message: tf("auto.1d49f9c861d9e44e"),
        tone: "error",
      });
    },
  });

  const agentById = useMemo(() => new Map((agents ?? []).map((agent) => [agent.id, agent])), [agents]);
  const projectById = useMemo(() => new Map((projects ?? []).map((project) => [project.id, project])), [projects]);
  const recentAssigneeIds = useMemo(() => getRecentAssigneeIds(), [routine?.id]);
  const recentProjectIds = useMemo(() => getRecentProjectIds(), [routine?.id]);
  const assigneeOptions = useMemo<InlineEntityOption[]>(
    () =>
      sortAgentsByRecency(
        (agents ?? []).filter((agent) => agent.status !== "terminated"),
        recentAssigneeIds,
      ).map((agent) => ({
        id: agent.id,
        label: agent.name,
        searchText: `${agent.name} ${agent.role} ${agent.title ?? ""}`,
      })),
    [agents, recentAssigneeIds],
  );
  const projectOptions = useMemo<InlineEntityOption[]>(
    () => buildRoutineProjectOptions(projects ?? []),
    [projects],
  );
  const mentionOptions = useMemo<MentionOption[]>(
    () => buildMarkdownMentionOptions({
      agents,
      projects: (projects ?? []).filter((project) => !project.archivedAt),
      members: companyMembers?.users,
    }),
    [agents, companyMembers?.users, projects],
  );

  // Wrap track-recent side-effects so the section components stay declarative.
  const setEditDraftTracked: typeof setEditDraft = useCallback((updater) => {
    setEditDraft((current) => {
      const next = typeof updater === "function" ? (updater as (c: RoutineEditDraft) => RoutineEditDraft)(current) : updater;
      if (next.assigneeAgentId && next.assigneeAgentId !== current.assigneeAgentId) {
        trackRecentAssignee(next.assigneeAgentId);
      }
      if (next.projectId && next.projectId !== current.projectId) {
        trackRecentProject(next.projectId);
      }
      return next;
    });
  }, []);

  const currentAssignee = editDraft.assigneeAgentId ? agentById.get(editDraft.assigneeAgentId) ?? null : null;
  const currentProject = editDraft.projectId ? projectById.get(editDraft.projectId) ?? null : null;

  const reloadLatest = useCallback(() => {
    setSaveConflict(false);
    if (routineDefaults) setEditDraft(routineDefaults);
    queryClient.invalidateQueries({ queryKey: queryKeys.routines.detail(routineId!) });
  }, [queryClient, routineDefaults, routineId]);

  const onHistoryRestoreSecretMaterials = useCallback((response: RestoreRoutineRevisionResponse) => {
    if (response.secretMaterials.length > 0) {
      setSecretMessage({
        title:
          response.secretMaterials.length === 1
            ? "Webhook trigger restored"
            : `${response.secretMaterials.length} webhook triggers restored`,
        entries: response.secretMaterials.map((recreated) => ({
          webhookUrl: recreated.webhookUrl,
          webhookSecret: recreated.webhookSecret,
        })),
      });
    }
  }, []);

  const onHistoryRestored = useCallback(
    (response: RestoreRoutineRevisionResponse) => {
      setSaveConflict(false);
      queryClient.setQueryData<RoutineDetailType | undefined>(
        queryKeys.routines.detail(routineId!),
        (prev) =>
          prev
            ? {
                ...prev,
                ...response.routine,
                latestRevisionId: response.revision.id,
                latestRevisionNumber: response.revision.revisionNumber,
              }
            : prev,
      );
      setEditDraft({
        title: response.routine.title,
        description: response.routine.description ?? "",
        projectId: response.routine.projectId ?? "",
        assigneeAgentId: response.routine.assigneeAgentId ?? "",
        priority: response.routine.priority,
        concurrencyPolicy: response.routine.concurrencyPolicy,
        catchUpPolicy: response.routine.catchUpPolicy,
        activityGatePolicy: response.routine.activityGatePolicy,
        activityGateScope: response.routine.activityGateScope,
        variables: response.routine.variables as RoutineVariable[],
        env: (response.routine.env ?? null) as RoutineEnvConfig | null,
      });
      hydratedRoutineIdRef.current = response.routine.id;
    },
    [queryClient, routineId],
  );

  if (!selectedCompanyId) {
    return <EmptyState icon={Repeat} message={tf("auto.7b360fd39f595366")} />;
  }

  const legacyTab = new URLSearchParams(window.location.search).get("tab");
  const validLegacySection = !streamlinedUiEnabled && (sectionParam === "runs" || sectionParam === "activity");
  if (routineId && (legacyTab || !sectionParam || (!isRoutineDetailView(sectionParam) && !validLegacySection))) {
    return (
      <Navigate
        to={resolveRoutineDetailDestination({ routineId, section: sectionParam, legacyTab })}
        replace
      />
    );
  }

  if (isLoading) {
    return <PageSkeleton variant="issues-list" />;
  }

  if (error || !routine || !routineDefaults) {
    return (
      <EmptyState
        icon={AlertCircle}
        message={error instanceof Error ? error.message: tf("auto.737c9508fbf29f62")}
      />
    );
  }

  const automationEnabled = routine.status === "active";
  const automationToggleDisabled = updateRoutineStatus.isPending || routine.status === "archived";
  const automationLabel =
    routine.status === "archived"
      ? "Archived"
      : !routine.assigneeAgentId
        ? "Draft"
        : automationEnabled
          ? "Active"
          : "Paused";
  const automationLabelClassName =
    routine.status === "archived"
      ? "text-muted-foreground"
      : automationEnabled
        ? "text-emerald-400"
        : "text-muted-foreground";

  const contextValue: RoutineDetailContextValue = {
    routine,
    routineId: routineId!,
    companyId: routine.companyId,
    editDraft,
    setEditDraft: setEditDraftTracked,
    routineDefaults,
    dirtyFields,
    isEditDirty,
    sectionDirtyFields,
    isSectionDirty,
    discardSection,
    saveRoutine,
    saveConflict,
    reloadLatest,
    automationEnabled,
    automationLabel,
    automationLabelClassName,
    automationToggleDisabled,
    onToggleAutomation: () => {
      if (!automationEnabled && !routine.assigneeAgentId) {
        pushToast({
          title: tf("auto.2761f376d7aad0e8"),
          body: "Set a default agent before enabling routine automation.",
          tone: "warn",
        });
        return;
      }
      updateRoutineStatus.mutate(automationEnabled ? "paused" : "active");
    },
    onOpenRunDialog: () => setRunVariablesOpen(true),
    runRoutinePending: runRoutine.isPending,
    newTrigger,
    setNewTrigger,
    createTrigger,
    updateTrigger,
    deleteTrigger,
    rotateTrigger,
    secretMessage,
    setSecretMessage,
    copySecretValue,
    availableSecrets,
    createSecret,
    agents: agents ?? [],
    projects: projects ?? [],
    agentById,
    projectById,
    assigneeOptions,
    projectOptions,
    recentAssigneeIds,
    recentProjectIds,
    mentionOptions,
    currentAssignee,
    currentProject,
    routineRuns,
    activity,
    hasLiveRun,
    activeIssueId,
    titleInputRef,
    descriptionEditorRef,
    assigneeSelectorRef,
    projectSelectorRef,
    onHistoryRestoreSecretMaterials,
    onHistoryRestored,
    navigateToSection,
  };

  const isEditableSection = EDITABLE_SECTIONS.includes(section);

  return (
    <RoutineDetailContext.Provider value={contextValue}>
      <a
        href="#routine-section"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-20 focus:rounded focus:bg-background focus:px-3 focus:py-1.5 focus:text-sm"
      >
        {tf("auto.7da8cfce801b55dc")}
      </a>

      {/* The global shell owns routine navigation. This surface keeps one
          content scroll owner and a compact action header. */}
      <div className="-m-4 flex h-full min-h-0 overflow-hidden md:-m-6">
        {!streamlinedUiEnabled ? (
          <RoutineSubSidebar
            activeSection={section}
            hrefFor={(next) => next === "runs" || next === "activity"
              ? `/routines/${routine.id}/${next}`
              : routineDetailHref(routine.id, next)}
            isSectionDirty={isSectionDirty}
            hasLiveRun={hasLiveRun}
            onNavigate={navigateToSection}
          />
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {!streamlinedUiEnabled ? (
          <RoutineSectionPicker
            activeSection={section}
            onNavigate={navigateToSection}
            isSectionDirty={isSectionDirty}
          />
        ) : null}
        <header className="flex min-h-14 shrink-0 flex-wrap items-center gap-3 border-b border-border bg-background px-4 py-2 md:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {section === "overview" && overviewEditing ? (
              <textarea
                ref={titleInputRef}
                data-autosize-title
                className="min-w-0 flex-1 resize-none overflow-hidden bg-transparent text-base font-semibold leading-7 outline-none placeholder:text-muted-foreground/50"
                placeholder={tf("auto.26d0f82a0da1d5ef")}
                rows={1}
                value={editDraft.title}
                onChange={(event) => {
                  setEditDraft((current) => ({ ...current, title: event.target.value }));
                  autoResizeTextarea(event.target);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.metaKey && !event.ctrlKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    descriptionEditorRef.current?.focus();
                  }
                }}
              />
            ) : (
              <h1 className="min-w-0 flex-1 truncate text-xl font-bold">{routine.title}</h1>
            )}
            {routine.managedByPlugin ? (
              <Badge variant="outline" className="hidden shrink-0 gap-1.5 text-xs text-muted-foreground sm:inline-flex">
                <Sparkles className="h-3 w-3" />
                {routine.managedByPlugin.pluginDisplayName}
                <span className="font-mono text-(length:--text-nano)">{routine.managedByPlugin.resourceKey}</span>
              </Badge>
            ) : null}
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {section === "history" ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(routineDetailHref(routine.id))}
              >
                {tf("auto.b202187e08636bb9")}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(routineDetailHref(routine.id, "history"))}
              >
                <History className="h-3.5 w-3.5" />
                {tf("text.History")}
              </Button>
            )}
            {section === "overview" ? (
              overviewEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    discardSection("overview");
                    setOverviewEditing(false);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                  {tf("auto.d07a5a690b140a86")}
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setOverviewEditing(true)}>
                  <Pencil className="h-3.5 w-3.5" />
                  {tf("auto.801e2738261ad99f")}
                </Button>
              )
            ) : null}
            <RunButton onClick={() => setRunVariablesOpen(true)} disabled={runRoutine.isPending} />
            <div className="flex items-center gap-2">
              <ToggleSwitch
                size="default"
                checked={automationEnabled}
                onCheckedChange={contextValue.onToggleAutomation}
                disabled={automationToggleDisabled}
                aria-label={automationEnabled ? tf("auto.0231dbe5cafb33a3") : tf("auto.caf1977652efb154")}
              />
              <span className={`text-sm font-medium ${automationLabelClassName}`}>{automationLabel}</span>
            </div>
          </div>
        </header>

        <main
          id="routine-section"
          role="main"
          className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 pb-6 pt-8 md:px-8"
        >
          <section
            aria-labelledby="routine-section-title"
            className={
              section === "overview" && !overviewEditing
                ? "mx-auto w-full max-w-5xl"
                : isEditableSection
                  ? "mx-auto w-full max-w-3xl"
                  : "w-full"
            }
          >
            <h2 id="routine-section-title" className="mb-4 text-lg font-semibold">
              {SECTION_TITLES[section]}
            </h2>

            {section === "overview" && (overviewEditing ? <OverviewSection /> : <RoutineOverview />)}
            {section === "triggers" && <TriggersSection />}
            {section === "variables" && <VariablesSection />}
            {section === "secrets" && <SecretsSection />}
            {section === "delivery" && <DeliverySection />}
            {section === "runs" && <RunsSection />}
            {section === "activity" && <ActivitySection />}
            {section === "history" && <HistorySection />}

            {isEditableSection && (section !== "overview" || overviewEditing) ? (
              <RoutineSaveBar
                dirtyFields={sectionDirtyFields(section)}
                isSaving={saveRoutine.isPending}
                saveConflict={saveConflict}
                onSave={() => {
                  if (!saveRoutine.isPending && editDraft.title.trim()) saveRoutine.mutate();
                }}
                onDiscard={() => discardSection(section)}
                onReload={reloadLatest}
              />
            ) : null}
          </section>
        </main>
        </div>
      </div>

      <RoutineRunVariablesDialog
        open={runVariablesOpen}
        onOpenChange={setRunVariablesOpen}
        companyId={routine.companyId}
        routineName={routine.title}
        agents={agents ?? []}
        projects={projects ?? []}
        defaultProjectId={routine.projectId}
        defaultAssigneeAgentId={routine.assigneeAgentId}
        variables={routine.variables ?? []}
        isPending={runRoutine.isPending}
        onSubmit={(data) => runRoutine.mutate(data)}
      />
    </RoutineDetailContext.Provider>
  );
}
