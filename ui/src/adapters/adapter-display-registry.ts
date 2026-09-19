import { tf } from "@/i18n/fork";
/**
 * Single source of truth for adapter display metadata.
 *
 * Built-in adapters have entries in `adapterDisplayMap`. External (plugin)
 * adapters get sensible defaults derived from their type string via
 * `getAdapterDisplay()`.
 */
import type { ComponentType } from "react";
import {
  Bot,
  Code,
  Gem,
  Moon,
  MousePointer2,
  Sparkles,
  Terminal,
  Cpu,
} from "lucide-react";
import { OpenCodeLogoIcon } from "@/components/OpenCodeLogoIcon";

// ---------------------------------------------------------------------------
// Type suffix parsing
// ---------------------------------------------------------------------------

// Suffixes stripped from type ids when deriving a human-readable label for
// unknown (plugin) adapter types. "_local" is a legacy qualifier from before
// first-class Environments and is never displayed; "_gateway" is re-appended
// as " (gateway)" to disambiguate gateway variants. Known adapters in
// `adapterDisplayMap` have final labels and never get a derived suffix.
const STRIPPED_TYPE_SUFFIXES = ["_local", "_gateway"] as const;

const DISPLAY_SUFFIXES: Record<string, string> = {
  _gateway: "gateway",
};

function getTypeSuffix(type: string): string | null {
  for (const [suffix, mode] of Object.entries(DISPLAY_SUFFIXES)) {
    if (type.endsWith(suffix)) return mode;
  }
  return null;
}

function withSuffix(label: string, suffix: string | null): string {
  return suffix ? `${label} (${suffix})` : label;
}

// ---------------------------------------------------------------------------
// Display metadata per adapter type
// ---------------------------------------------------------------------------

export interface AdapterDisplayInfo {
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  recommended?: boolean;
  comingSoon?: boolean;
  disabledLabel?: string;
  experimental?: boolean;
  hideFromVisualSelection?: boolean;
}

const adapterDisplayMap: Record<string, AdapterDisplayInfo> = {
  acpx_local: {
    label: tf("auto.8b657a5385e370da"),
    description: tf("auto.b063be3d2f51c529"),
    icon: Bot,
    comingSoon: true,
    disabledLabel: "Use Claude Code or Codex with the ACP engine",
    hideFromVisualSelection: true,
  },
  claude_local: {
    label: tf("auto.246ef8c1130d56f5"),
    description: tf("auto.8ef9af1e3a2fcfc9"),
    icon: Sparkles,
    recommended: true,
  },
  codex_local: {
    label: tf("auto.616efbe96852d8c9"),
    description: tf("auto.8544dfe53669038d"),
    icon: Code,
    recommended: true,
  },
  paperclip_runner: {
    label: tf("auto.aacfc564be2ab279"),
    description: tf("auto.98edf62ea51ef9e8"),
    icon: Cpu,
    experimental: true,
  },
  gemini_local: {
    label: tf("auto.731732835cd76be6"),
    description: tf("auto.f87585b22acc7b8f"),
    icon: Gem,
  },
  grok_local: {
    label: tf("auto.fd3bf01ac1dbce93"),
    description: tf("auto.916ba19af6e9dc5b"),
    icon: Bot,
  },
  kimi_local: {
    label: tf("auto.0c486180bb8a7b51"),
    description: tf("auto.92db38e885309ced"),
    icon: Moon,
  },
  hermes_gateway: {
    label: tf("auto.10ea67a0116e5c44"),
    description: tf("auto.120e74ee2c192e38"),
    icon: Bot,
    hideFromVisualSelection: true,
  },
  hermes_local: {
    label: tf("auto.66e0988d1198afe0"),
    description: tf("auto.1709feea43aeca1e"),
    icon: Bot,
  },
  opencode_local: {
    label: tf("auto.3af0e55ccc96d87c"),
    description: tf("auto.b8f8e337faae16f0"),
    icon: OpenCodeLogoIcon,
  },
  pi_local: {
    label: tf("auto.4d87941d681ca4e8"),
    description: tf("auto.19e155b199115245"),
    icon: Terminal,
  },
  cursor: {
    label: tf("auto.2c014f8f8986f1b2"),
    description: tf("auto.473f101c68eada0c"),
    icon: MousePointer2,
  },
  cursor_cloud: {
    label: tf("auto.95a2aa7ec569b9b8"),
    description: tf("auto.201c0c40df9194f3"),
    icon: MousePointer2,
  },
  openclaw_gateway: {
    label: tf("auto.b0371788e957340a"),
    description: tf("auto.73f2526439943e44"),
    icon: Bot,
    comingSoon: true,
    disabledLabel: "Invite external agents from the add-agent modal",
    hideFromVisualSelection: true,
  },
  process: {
    label: tf("auto.e083bd83e9d3e97e"),
    description: tf("auto.485c4b0acd62e56c"),
    icon: Cpu,
    comingSoon: true,
  },
  http: {
    label: tf("auto.56d6f32151ad8474"),
    description: tf("auto.6036685cfc20d1fb"),
    icon: Cpu,
    comingSoon: true,
  },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function humanizeType(type: string): string {
  // Strip known type suffixes so "droid_local" → "Droid", not "Droid Local"
  let base = type;
  for (const suffix of STRIPPED_TYPE_SUFFIXES) {
    if (base.endsWith(suffix)) {
      base = base.slice(0, -suffix.length);
      break;
    }
  }
  return base.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getAdapterLabel(type: string): string {
  // Known labels are final — only unknown (plugin) types get a derived
  // suffix, so labels like "OpenClaw Gateway" don't become
  // "OpenClaw Gateway (gateway)".
  const known = adapterDisplayMap[type];
  if (known) return known.label;
  return withSuffix(humanizeType(type), getTypeSuffix(type));
}

export function getAdapterLabels(): Record<string, string> {
  const labels: Record<string, string> = {};
  for (const [type, info] of Object.entries(adapterDisplayMap)) {
    labels[type] = info.label;
  }
  return labels;
}

export function getAdapterDisplay(type: string): AdapterDisplayInfo {
  const known = adapterDisplayMap[type];
  if (known) return known;

  const suffix = getTypeSuffix(type);
  const label = withSuffix(humanizeType(type), suffix);
  return {
    label,
    description: suffix ? `External ${suffix} adapter` : "External adapter",
    icon: Cpu,
  };
}

export function isKnownAdapterType(type: string): boolean {
  return type in adapterDisplayMap;
}
