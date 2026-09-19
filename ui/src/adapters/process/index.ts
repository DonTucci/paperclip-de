import { tf } from "@/i18n/fork";
import type { UIAdapterModule } from "../types";
import { parseProcessStdoutLine } from "./parse-stdout";
import { ProcessConfigFields } from "./config-fields";
import { buildProcessConfig } from "./build-config";

export const processUIAdapter: UIAdapterModule = {
  type: "process",
  label: tf("auto.ee53cd0cfaaf1c33"),
  parseStdoutLine: parseProcessStdoutLine,
  ConfigFields: ProcessConfigFields,
  buildAdapterConfig: buildProcessConfig,
};
