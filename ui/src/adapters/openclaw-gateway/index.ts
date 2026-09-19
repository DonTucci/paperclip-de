import { tf } from "@/i18n/fork";
import type { UIAdapterModule } from "../types";
import { parseOpenClawGatewayStdoutLine } from "@paperclipai/adapter-openclaw-gateway/ui";
import { buildOpenClawGatewayConfig } from "@paperclipai/adapter-openclaw-gateway/ui";
import { OpenClawGatewayConfigFields } from "./config-fields";

export const openClawGatewayUIAdapter: UIAdapterModule = {
  type: "openclaw_gateway",
  label: tf("auto.b0371788e957340a"),
  parseStdoutLine: parseOpenClawGatewayStdoutLine,
  ConfigFields: OpenClawGatewayConfigFields,
  buildAdapterConfig: buildOpenClawGatewayConfig,
};
