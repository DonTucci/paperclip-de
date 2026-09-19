import { tf } from "@/i18n/fork";
import type { UIAdapterModule } from "../types";
import { parseOpenCodeStdoutLine } from "@paperclipai/adapter-opencode-local/ui";
import { OpenCodeLocalConfigFields } from "./config-fields";
import { buildOpenCodeLocalConfig } from "@paperclipai/adapter-opencode-local/ui";

export const openCodeLocalUIAdapter: UIAdapterModule = {
  type: "opencode_local",
  label: tf("auto.3af0e55ccc96d87c"),
  parseStdoutLine: parseOpenCodeStdoutLine,
  ConfigFields: OpenCodeLocalConfigFields,
  buildAdapterConfig: buildOpenCodeLocalConfig,
};
