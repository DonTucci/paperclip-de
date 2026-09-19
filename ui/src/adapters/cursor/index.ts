import { tf } from "@/i18n/fork";
import type { UIAdapterModule } from "../types";
import { parseCursorStdoutLine } from "@paperclipai/adapter-cursor-local/ui";
import { CursorLocalConfigFields } from "./config-fields";
import { buildCursorLocalConfig } from "@paperclipai/adapter-cursor-local/ui";

export const cursorLocalUIAdapter: UIAdapterModule = {
  type: "cursor",
  label: tf("auto.2c014f8f8986f1b2"),
  parseStdoutLine: parseCursorStdoutLine,
  ConfigFields: CursorLocalConfigFields,
  buildAdapterConfig: buildCursorLocalConfig,
};
