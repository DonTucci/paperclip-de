import { tf } from "@/i18n/fork";
import type { UIAdapterModule } from "../types";
import { parseHttpStdoutLine } from "./parse-stdout";
import { HttpConfigFields } from "./config-fields";
import { buildHttpConfig } from "./build-config";

export const httpUIAdapter: UIAdapterModule = {
  type: "http",
  label: tf("auto.676845eefafdeee3"),
  parseStdoutLine: parseHttpStdoutLine,
  ConfigFields: HttpConfigFields,
  buildAdapterConfig: buildHttpConfig,
};
