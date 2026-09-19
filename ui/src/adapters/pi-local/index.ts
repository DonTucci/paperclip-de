import { tf } from "@/i18n/fork";
import type { UIAdapterModule } from "../types";
import { parsePiStdoutLine } from "@paperclipai/adapter-pi-local/ui";
import { PiLocalConfigFields } from "./config-fields";
import { buildPiLocalConfig } from "@paperclipai/adapter-pi-local/ui";

export const piLocalUIAdapter: UIAdapterModule = {
  type: "pi_local",
  label: tf("auto.4d87941d681ca4e8"),
  parseStdoutLine: parsePiStdoutLine,
  ConfigFields: PiLocalConfigFields,
  buildAdapterConfig: buildPiLocalConfig,
};
