import { tf } from "@/i18n/fork";
import type { UIAdapterModule } from "../types";
import { parseStdoutLine as parseHermesGatewayStdoutLine } from "@paperclipai/hermes-paperclip-adapter/gateway/ui";
import { buildSchemaAdapterConfig } from "../schema-config-fields";
import { HermesGatewayConfigFields } from "./config-fields";

export const hermesGatewayUIAdapter: UIAdapterModule = {
  type: "hermes_gateway",
  label: tf("auto.10ea67a0116e5c44"),
  parseStdoutLine: parseHermesGatewayStdoutLine,
  ConfigFields: HermesGatewayConfigFields,
  buildAdapterConfig: buildSchemaAdapterConfig,
};
