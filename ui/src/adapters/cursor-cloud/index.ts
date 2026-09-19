import { tf } from "@/i18n/fork";
import type { UIAdapterModule } from "../types";
import { SchemaConfigFields } from "../schema-config-fields";
import {
  buildCursorCloudConfig,
  parseCursorCloudStdoutLine,
} from "@paperclipai/adapter-cursor-cloud/ui";

export const cursorCloudUIAdapter: UIAdapterModule = {
  type: "cursor_cloud",
  label: tf("auto.95a2aa7ec569b9b8"),
  parseStdoutLine: parseCursorCloudStdoutLine,
  ConfigFields: SchemaConfigFields,
  buildAdapterConfig: buildCursorCloudConfig,
};
