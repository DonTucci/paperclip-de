import { tf } from "@/i18n/fork";
import type { UIAdapterModule } from "../types";
import { parseHermesStdoutLine, buildHermesConfig } from "@paperclipai/hermes-paperclip-adapter/ui";
import { SchemaConfigFields } from "../schema-config-fields";

export const hermesLocalUIAdapter: UIAdapterModule = {
  type: "hermes_local",
  label: tf("auto.66e0988d1198afe0"),
  parseStdoutLine: parseHermesStdoutLine,
  ConfigFields: SchemaConfigFields,
  buildAdapterConfig: buildHermesConfig,
};
