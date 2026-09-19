import { tf } from "@/i18n/fork";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { brandChipBadge, type BrandChipColor } from "@/lib/status-colors";

/**
 * The load-bearing visual grammar for the built-in bundle status panel
 * (Reflection Coach — [PAP-13099], ux-spec §4). Each variant double-encodes
 * state as glyph + word + color so it never relies on color alone
 * (WCAG 1.4.1). Colors route through the shared `brandChipBadge` families — no
 * bespoke tints are minted here (ux-spec §10).
 *
 * A single resource shows at most one readiness chip and at most one drift
 * chip; when both a readiness problem and a drift state coexist, the caller
 * suppresses the drift chip until readiness is `ready` (ux-spec §4).
 */
export type ResourceStatusVariant =
  | "ready"
  | "needs_setup"
  | "missing"
  | "error"
  | "update_available"
  | "drifted"
  | "schedule_off"
  | "schedule_on"
  | "pending_approval"
  | "proposal_pending";

interface VariantSpec {
  color: BrandChipColor;
  glyph: string;
  label: string;
  title: string;
}

const VARIANTS: Record<ResourceStatusVariant, VariantSpec> = {
  ready: { color: "green", glyph: "●", label: tf("auto.5fa7aac5375c5815"), title: tf("auto.4dd6c838decdfcb4") },
  needs_setup: { color: "amber", glyph: "⚠", label: tf("auto.b6df2441064f1416"), title: tf("auto.968a205913144398") },
  missing: { color: "amber", glyph: "⚠", label: tf("auto.6be36ca49ee85210"), title: tf("auto.f4936f59ff7986ab") },
  error: { color: "red", glyph: "✕", label: tf("text.Error"), title: tf("auto.4e42ee640e89878f") },
  update_available: {
    color: "blue",
    glyph: "↑",
    label: tf("auto.ff8b555d818f0b25"),
    title: tf("auto.71a19f555fc9aa0b"),
  },
  drifted: {
    color: "gray",
    glyph: "✎",
    label: tf("auto.bb85e2687d4222fb"),
    title: tf("auto.993846ba180493ed"),
  },
  schedule_off: {
    color: "gray",
    glyph: "◌",
    label: tf("auto.e96f8077b459c809"),
    title: tf("auto.ef9bdba77102a11f"),
  },
  schedule_on: { color: "green", glyph: "●", label: tf("auto.2975132481a7a695"), title: tf("auto.47fd02dd7f2aa529") },
  pending_approval: {
    color: "amber",
    glyph: "⚠",
    label: tf("status.pending_approval"),
    title: tf("auto.96a74263220d3ec0"),
  },
  proposal_pending: {
    color: "blue",
    glyph: "↑",
    label: tf("auto.f8a713a24dfda798"),
    title: tf("auto.ae9d508636c9ad06"),
  },
};

export function ResourceStatusChip({
  variant,
  label,
  compact = false,
  className,
}: {
  variant: ResourceStatusVariant;
  /** Override the default label (e.g. "Weekly · Mon 09:00 UTC"). */
  label?: string;
  compact?: boolean;
  className?: string;
}) {
  const spec = VARIANTS[variant];
  return (
    <Badge
      variant="outline"
      className={cn(
        brandChipBadge[spec.color],
        "font-medium",
        compact && "px-1.5 py-0 text-(length:--text-nano)",
        className,
      )}
      title={spec.title}
    >
      <span aria-hidden="true">{spec.glyph}</span>
      {label ?? spec.label}
    </Badge>
  );
}
