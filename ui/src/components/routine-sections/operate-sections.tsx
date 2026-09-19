import { tf } from "@/i18n/fork";
import { useMemo, useState } from "react";
import { Activity as ActivityIcon, Play, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { timeAgo } from "../../lib/timeAgo";
import { runRowSubtitle, dedupedTriggerLabel } from "../../lib/routine-run-display";
import { EmptyState } from "../EmptyState";
import { EntityRow } from "../EntityRow";
import { FilterBar, type FilterValue } from "../FilterBar";
import { LiveRunWidget } from "../LiveRunWidget";
import { RoutineHistoryTab } from "../RoutineHistoryTab";
import { RoutineActivityRow } from "../RoutineActivityRow";
import { useRoutineDetail } from "./context";

const DATE_WINDOW_OPTIONS: { value: string; label: string; ms: number | null }[] = [
  { value: "any", label: tf("auto.5e7de49a40c3d754"), ms: null },
  { value: "24h", label: tf("auto.3033b37ea23466d2"), ms: 24 * 60 * 60 * 1000 },
  { value: "7d", label: tf("auto.9976054f2ae7088c"), ms: 7 * 24 * 60 * 60 * 1000 },
  { value: "30d", label: tf("auto.bbada0d68c50286d"), ms: 30 * 24 * 60 * 60 * 1000 },
];

export function RunsSection() {
  const ctx = useRoutineDetail();
  const { routine, routineRuns, hasLiveRun, activeIssueId, onOpenRunDialog } = ctx;
  const runs = useMemo(() => routineRuns ?? [], [routineRuns]);

  const [sourceFilter, setSourceFilter] = useState("any");
  const [statusFilter, setStatusFilter] = useState("any");
  const [dateFilter, setDateFilter] = useState("any");

  const sourceOptions = useMemo(
    () => [...new Set(runs.map((run) => run.source))].sort(),
    [runs],
  );
  const statusOptions = useMemo(
    () => [...new Set(runs.map((run) => run.status))].sort(),
    [runs],
  );

  const filtered = useMemo(() => {
    const windowMs = DATE_WINDOW_OPTIONS.find((option) => option.value === dateFilter)?.ms ?? null;
    const cutoff = windowMs == null ? null : Date.now() - windowMs;
    return runs.filter((run) => {
      if (sourceFilter !== "any" && run.source !== sourceFilter) return false;
      if (statusFilter !== "any" && run.status !== statusFilter) return false;
      if (cutoff != null && new Date(run.triggeredAt).getTime() < cutoff) return false;
      return true;
    });
  }, [runs, sourceFilter, statusFilter, dateFilter]);

  const activeFilters = useMemo<FilterValue[]>(() => {
    const list: FilterValue[] = [];
    if (sourceFilter !== "any") list.push({ key: "source", label: tf("text.Source"), value: sourceFilter });
    if (statusFilter !== "any") {
      list.push({ key: "status", label: tf("text.Status"), value: statusFilter.replaceAll("_", " ") });
    }
    if (dateFilter !== "any") {
      const label = DATE_WINDOW_OPTIONS.find((option) => option.value === dateFilter)?.label ?? dateFilter;
      list.push({ key: "date", label: tf("text.Date"), value: label });
    }
    return list;
  }, [sourceFilter, statusFilter, dateFilter]);

  function clearFilters() {
    setSourceFilter("any");
    setStatusFilter("any");
    setDateFilter("any");
  }

  function removeFilter(key: string) {
    if (key === "source") setSourceFilter("any");
    if (key === "status") setStatusFilter("any");
    if (key === "date") setDateFilter("any");
  }

  return (
    <div className="space-y-4">
      {hasLiveRun && activeIssueId ? (
        <LiveRunWidget issueId={activeIssueId} companyId={routine.companyId} />
      ) : null}

      {runs.length === 0 ? (
        <EmptyState
          icon={Play}
          message={tf("auto.e5e464b6c6ed0250")}
          action={tf("text.Run now")}
          onAction={onOpenRunDialog}
        />
      ) : (
        <>
          {/* Filter chips row (§3.6) */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger size="sm" className="h-8 w-auto gap-1.5 text-xs" aria-label={tf("auto.e150d205164c213c")}>
                  <span className="text-muted-foreground">{tf("auto.c707ee4ecc240442")}</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{tf("auto.d6a7cd2a7371b1a1")}</SelectItem>
                  {sourceOptions.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger size="sm" className="h-8 w-auto gap-1.5 text-xs" aria-label={tf("auto.94d5a7703a8250de")}>
                  <span className="text-muted-foreground">{tf("auto.755c8b2a9fb11446")}</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{tf("auto.d6a7cd2a7371b1a1")}</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger size="sm" className="h-8 w-auto gap-1.5 text-xs" aria-label={tf("auto.385d4932fa7d5e92")}>
                  <span className="text-muted-foreground">{tf("auto.b51489bde8d89513")}</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_WINDOW_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FilterBar filters={activeFilters} onRemove={removeFilter} onClear={clearFilters} />
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={SlidersHorizontal}
              message={tf("auto.aedae6e517ebb7db")}
              action={tf("text.Clear filters")}
              onAction={clearFilters}
            />
          ) : (
            <div className="rounded-lg border border-border">
              {filtered.map((run) => {
                const label = dedupedTriggerLabel(run.trigger);
                const title = run.linkedIssue?.title ?? label ?? "Run";
                return (
                  <EntityRow
                    key={run.id}
                    leading={
                      <>
                        <Badge variant="outline" className="shrink-0">
                          {run.source}
                        </Badge>
                        <Badge
                          variant={run.status === "failed" ? "destructive" : "secondary"}
                          className="shrink-0"
                        >
                          {run.status.replaceAll("_", " ")}
                        </Badge>
                      </>
                    }
                    identifier={
                      run.linkedIssue
                        ? run.linkedIssue.identifier ?? run.linkedIssue.id.slice(0, 8)
                        : undefined
                    }
                    title={title}
                    subtitle={runRowSubtitle(run, routine.variables)}
                    reserveSubtitleSpace
                    trailing={
                      <span className="text-xs text-muted-foreground">{timeAgo(run.triggeredAt)}</span>
                    }
                    to={
                      run.linkedIssue
                        ? `/issues/${run.linkedIssue.identifier ?? run.linkedIssue.id}`
                        : undefined
                    }
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function ActivitySection() {
  const ctx = useRoutineDetail();
  const { activity } = ctx;
  const events = activity ?? [];

  const groups = useMemo(() => {
    const byDay = new Map<string, typeof events>();
    for (const event of events) {
      let label = tf("auto.e10ae99074011888");
      try {
        label = new Date(event.createdAt).toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
      } catch {
        /* keep fallback label */
      }
      const bucket = byDay.get(label) ?? [];
      bucket.push(event);
      byDay.set(label, bucket);
    }
    return Array.from(byDay.entries());
  }, [events]);

  if (events.length === 0) {
    return <EmptyState icon={ActivityIcon} message={tf("auto.a288d2d0a21eed3c")} />;
  }

  return (
    <div className="space-y-4">
      {groups.map(([day, dayEvents]) => (
        <div key={day}>
          <div className="sticky top-0 bg-background py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {day}
          </div>
          <div>
            {dayEvents.map((event) => (
              <RoutineActivityRow key={event.id} event={event} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function HistorySection() {
  const ctx = useRoutineDetail();
  const {
    routine,
    isEditDirty,
    dirtyFields,
    routineDefaults,
    setEditDraft,
    saveRoutine,
    agentById,
    projectById,
    availableSecrets,
    onHistoryRestoreSecretMaterials,
    onHistoryRestored,
  } = ctx;

  return (
    <RoutineHistoryTab
      routine={routine}
      isEditDirty={isEditDirty}
      dirtyFields={dirtyFields}
      onDiscardEdits={() => setEditDraft(routineDefaults)}
      onSaveEdits={() => {
        if (!saveRoutine.isPending && routine.title.trim()) {
          saveRoutine.mutate();
        }
      }}
      agents={agentById}
      projects={projectById}
      secrets={availableSecrets}
      onRestoreSecretMaterials={onHistoryRestoreSecretMaterials}
      onRestored={onHistoryRestored}
    />
  );
}
