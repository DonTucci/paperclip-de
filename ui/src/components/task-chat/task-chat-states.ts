import { tf } from "@/i18n/fork";
/**
 * Canonical state inventory for the chat-style task thread (the default task
 * view; the classic legacy view sits behind enableClassicTaskInterface).
 *
 * This list is the single source of truth for:
 *   - the dev harness state switcher (/dev/task-chat-lab), and
 *   - the finish-line test that asserts every state renders without error.
 *
 * Each id traces to a real agent-protocol state (plan Deliverable 1). `tier`
 * marks whether the state already streams live ("live") or is emitted upstream
 * but dropped by acpx today ("tier-b", driven by synthetic events in the
 * harness, live wiring flagged). `surface` says where the state renders.
 */

export const TASK_CHAT_STATES = [
  "session-start",
  "human-message",
  "agent-message",
  "thinking",
  "responding",
  "responding-burst",
  "tool-call",
  "diff",
  "working",
  "running",
  "completed",
  "activity-phases",
  "awaiting-approval",
  "plan-todo",
  "interrupted",
  "refused",
  "truncated",
  "live-token-cost",
] as const;

export type TaskChatStateId = (typeof TASK_CHAT_STATES)[number];

export type TaskChatStateTier = "live" | "tier-b";
export type TaskChatStateSurface = "thread" | "plan";

export interface TaskChatStateMeta {
  id: TaskChatStateId;
  label: string;
  tier: TaskChatStateTier;
  surface: TaskChatStateSurface;
  /** Real protocol source, quoted for the harness inspector. */
  protocol: string;
}

export const TASK_CHAT_STATE_META: Record<TaskChatStateId, TaskChatStateMeta> = {
  "session-start": {
    id: "session-start",
    label: tf("auto.6f269d14620f3a2e"),
    tier: "live",
    surface: "thread",
    protocol: 'acpx.session → TranscriptEntry kind:"init"',
  },
  "human-message": {
    id: "human-message",
    label: tf("auto.e9b8caedde9e3437"),
    tier: "live",
    surface: "thread",
    protocol: 'IssueComment authorType:"user"',
  },
  "agent-message": {
    id: "agent-message",
    label: tf("auto.e34cfffabc90876d"),
    tier: "live",
    surface: "thread",
    protocol: 'PRP item.delta kind:"agentMessage" channel:"final"',
  },
  thinking: {
    id: "thinking",
    label: tf("auto.a20d12c5e9c428c3"),
    tier: "live",
    surface: "thread",
    protocol: "text_delta stream:thought (ACP agent_thought_chunk)",
  },
  responding: {
    id: "responding",
    label: tf("auto.f30914fcd6949013"),
    tier: "live",
    surface: "thread",
    protocol: 'PRP item.delta kind:"agentMessage" channel:"progress"',
  },
  "responding-burst": {
    id: "responding-burst",
    label: tf("auto.df7d4b71d2046d67"),
    tier: "live",
    surface: "thread",
    protocol: "text_delta stream:output ×N, tool calls between (PAP-368 dwell)",
  },
  "tool-call": {
    id: "tool-call",
    label: tf("auto.17011048725fe0aa"),
    tier: "live",
    surface: "thread",
    protocol: "acpx.tool_call (ACP tool_call / tool_call_update)",
  },
  diff: {
    id: "diff",
    label: tf("auto.7ecf46284588f3fa"),
    tier: "live",
    surface: "thread",
    protocol: 'ToolCallContent type:"diff" → TranscriptEntry kind:"diff"',
  },
  working: {
    id: "working",
    label: tf("auto.a92f0449a9f7235b"),
    tier: "live",
    surface: "thread",
    protocol: "heartbeat.run.progress + acpx.status",
  },
  running: {
    id: "running",
    label: tf("text.Running"),
    tier: "live",
    surface: "thread",
    protocol: 'message.status.type === "running"',
  },
  completed: {
    id: "completed",
    label: tf("auto.12b8d2f9ce8c66a0"),
    tier: "live",
    surface: "thread",
    protocol: "acpx.result (StopReason in subtype)",
  },
  "activity-phases": {
    id: "activity-phases",
    label: tf("auto.c6fe5bd62c20f74a"),
    tier: "live",
    surface: "thread",
    protocol: "assistant boundaries + chronological tool calls",
  },
  "awaiting-approval": {
    id: "awaiting-approval",
    label: tf("auto.ae25c9b1d366d159"),
    tier: "tier-b",
    surface: "thread",
    protocol: "ACP RequestPermissionRequest + PermissionOptionKind",
  },
  "plan-todo": {
    id: "plan-todo",
    label: tf("auto.3e891e27139458a6"),
    tier: "tier-b",
    surface: "plan",
    protocol: "ACP Plan { entries: PlanEntry[] }, PlanEntryStatus",
  },
  interrupted: {
    id: "interrupted",
    label: tf("auto.132d124d6bb3d811"),
    tier: "tier-b",
    surface: "thread",
    protocol: 'AcpRuntimeTurnResult.status:"cancelled" / StopReason "cancelled"',
  },
  refused: {
    id: "refused",
    label: tf("auto.66b873543aebf01b"),
    tier: "tier-b",
    surface: "thread",
    protocol: 'StopReason "refusal"',
  },
  truncated: {
    id: "truncated",
    label: tf("auto.d9d9fcf3bd8af345"),
    tier: "tier-b",
    surface: "thread",
    protocol: 'StopReason "max_tokens" | "max_turn_requests"',
  },
  "live-token-cost": {
    id: "live-token-cost",
    label: tf("auto.5bbaf785da9be0cb"),
    tier: "tier-b",
    surface: "thread",
    protocol: "ACP UsageUpdate { used, size, cost }",
  },
};

export const TASK_CHAT_STATE_LIST: TaskChatStateMeta[] = TASK_CHAT_STATES.map(
  (id) => TASK_CHAT_STATE_META[id],
);
