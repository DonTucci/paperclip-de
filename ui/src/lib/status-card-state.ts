import { tf } from "@/i18n/fork";
import type { StatusCard, StatusCardRefreshPolicy } from "@paperclipai/shared";

/**
 * The lifecycle states a status card renders as on the board (plan §7,
 * wireframe `07-card-states.svg`). Derived from the stored `status_cards` row:
 * the persisted `state` enum plus `archivedAt`, `generatingIssueId` and
 * `pendingChangeCount`. Kept in one place so the board tile, detail drawer and
 * tests agree on the mapping.
 */
export type StatusCardLifecycle =
  | "compiling"
  | "fresh"
  | "stale"
  | "updating"
  | "error"
  | "paused_budget"
  | "paused_hours"
  | "archived";

/**
 * Map a card row to its display lifecycle. Precedence, highest first:
 * archived → compiling → error → paused → updating (a run is in flight) →
 * stale (pending changes) → fresh.
 */
export function deriveStatusCardLifecycle(
  card: Pick<StatusCard, "state" | "archivedAt" | "generatingIssueId" | "pendingChangeCount">,
): StatusCardLifecycle {
  if (card.archivedAt) return "archived";
  if (card.state === "compiling") return "compiling";
  if (card.state === "error") return "error";
  if (card.state === "paused_budget") return "paused_budget";
  if (card.state === "paused_hours") return "paused_hours";
  if (card.generatingIssueId) return "updating";
  if (card.pendingChangeCount > 0) return "stale";
  return "fresh";
}

export interface StatusCardLifecyclePresentation {
  label: string;
  /** Tailwind classes for the leading state dot. */
  dotClassName: string;
  /** Short human description used in the states reference and empty affordances. */
  description: string;
  /** Whether the tile should render a dashed "building" border. */
  dashedBorder: boolean;
  /** Whether the last-good summary should stay visible under a banner. */
  keepsLastSummary: boolean;
}

export const STATUS_CARD_LIFECYCLE_PRESENTATION: Record<
  StatusCardLifecycle,
  StatusCardLifecyclePresentation
> = {
  compiling: {
    label: tf("auto.dbdf27e5db8d8cde"),
    dotClassName: "bg-cyan-400 animate-pulse",
    description: tf("auto.226c1e3f36fbef63"),
    dashedBorder: true,
    keepsLastSummary: false,
  },
  fresh: {
    label: tf("auto.f810b66877419ce9"),
    dotClassName: "bg-emerald-400",
    description: tf("auto.52934f2aadb12235"),
    dashedBorder: false,
    keepsLastSummary: true,
  },
  stale: {
    label: tf("auto.40c9e59c5e152b0a"),
    dotClassName: "bg-amber-400",
    description: tf("auto.c681361c78132942"),
    dashedBorder: false,
    keepsLastSummary: true,
  },
  updating: {
    // Blue (distinct from fresh-emerald and compiling-cyan) so an in-flight
    // update never reads as "fresh" on a glance-scan of the board.
    label: tf("auto.0b5260e1b4054f46"),
    dotClassName: "bg-blue-500 animate-pulse",
    description: tf("auto.0b749ec601a2c86c"),
    dashedBorder: false,
    keepsLastSummary: true,
  },
  error: {
    label: tf("text.Error"),
    dotClassName: "bg-red-500",
    description: tf("auto.3a1419dd214ce615"),
    dashedBorder: false,
    keepsLastSummary: true,
  },
  paused_budget: {
    label: tf("auto.62ae66772ab1775e"),
    dotClassName: "bg-orange-400",
    description: tf("auto.7fb1a09a16453810"),
    dashedBorder: false,
    keepsLastSummary: true,
  },
  paused_hours: {
    label: tf("auto.9e02926799bef4c0"),
    dotClassName: "bg-orange-400",
    description: tf("auto.5fc8333c38cda73f"),
    dashedBorder: false,
    keepsLastSummary: true,
  },
  archived: {
    label: tf("text.Archived"),
    dotClassName: "bg-muted-foreground/50",
    description: tf("auto.cd8313f2af4f1e1d"),
    dashedBorder: false,
    keepsLastSummary: true,
  },
};

/** Compact token count, e.g. `1.1k`, `950`, `12.4k`. */
export function formatTokens(tokens: number): string {
  if (tokens < 1000) return `${tokens}`;
  return `${(tokens / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}

/** US-dollar cost from integer cents, e.g. `$0.09`, `$1.20`. Sub-cent → `<$0.01`. */
export function formatUsdFromCents(cents: number): string {
  if (cents <= 0) return "$0.00";
  if (cents < 1) return "<$0.01";
  return `$${(cents / 100).toFixed(2)}`;
}

/** A one-line, human summary of a card's refresh policy for chips and footers. */
export function describeRefreshPolicy(policy: StatusCardRefreshPolicy): string {
  switch (policy.mode) {
    case "manual":
      return "manual";
    case "interval":
      return policy.intervalMinutes
        ? `every ${policy.intervalMinutes}m if changed`
        : "on a schedule if changed";
    case "reactive": {
      const debounce = policy.debounceSeconds ?? 60;
      return `on change (${debounce}s)`;
    }
    default:
      return "manual";
  }
}
