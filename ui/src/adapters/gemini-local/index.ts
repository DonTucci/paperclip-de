import { tf } from "@/i18n/fork";
import type { UIAdapterModule } from "../types";
import { parseGeminiStdoutLine } from "@paperclipai/adapter-gemini-local/ui";
import { GeminiLocalConfigFields } from "./config-fields";
import { buildGeminiLocalConfig } from "@paperclipai/adapter-gemini-local/ui";

export const geminiLocalUIAdapter: UIAdapterModule = {
  type: "gemini_local",
  label: tf("auto.731732835cd76be6"),
  parseStdoutLine: parseGeminiStdoutLine,
  ConfigFields: GeminiLocalConfigFields,
  buildAdapterConfig: buildGeminiLocalConfig,
};
