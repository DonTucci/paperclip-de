import { tf } from "@/i18n/fork";
import type { UIAdapterModule } from "../types";
import { createGrokStdoutParser, parseGrokStdoutLine } from "@paperclipai/adapter-grok-local/ui";
import { buildGrokLocalConfig } from "@paperclipai/adapter-grok-local/ui";
import { GrokLocalConfigFields } from "./config-fields";

export const grokLocalUIAdapter: UIAdapterModule = {
  type: "grok_local",
  label: tf("auto.fd3bf01ac1dbce93"),
  parseStdoutLine: parseGrokStdoutLine,
  createStdoutParser: createGrokStdoutParser,
  ConfigFields: GrokLocalConfigFields,
  buildAdapterConfig: buildGrokLocalConfig,
};
