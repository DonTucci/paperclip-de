import { tf } from "@/i18n/fork";
import { Activity, LayoutGrid, KeyRound, Wrench, Boxes } from "lucide-react";

/**
 * Gateway detail tabs (PAP-11200). Terminology is locked by the approved
 * PAP-11178 design of record: Overview · Apps & tools · Tokens · Activity ·
 * Advanced. Raw protocol / JSON / transport details live under Advanced.
 */
export const GATEWAY_TABS = [
  { key: "overview", label: tf("text.Overview"), icon: LayoutGrid },
  { key: "apps", label: tf("auto.b10a5c4456cf1cdc"), icon: Boxes },
  { key: "tokens", label: tf("text.Tokens"), icon: KeyRound },
  { key: "activity", label: tf("text.Activity"), icon: Activity },
  { key: "advanced", label: tf("text.Advanced"), icon: Wrench },
] as const;

export type GatewayTabKey = (typeof GATEWAY_TABS)[number]["key"];

export function gatewayTabHref(gatewayId: string, tab: GatewayTabKey): string {
  return `/apps/gateways/${gatewayId}/${tab}`;
}

export function isGatewayTabKey(value: string | undefined): value is GatewayTabKey {
  return GATEWAY_TABS.some((tab) => tab.key === value);
}

export function gatewayTabLabel(tabKey: GatewayTabKey): string {
  return GATEWAY_TABS.find((tab) => tab.key === tabKey)?.label ?? "Overview";
}
