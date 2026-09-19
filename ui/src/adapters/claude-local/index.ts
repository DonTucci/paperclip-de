import { tf } from "@/i18n/fork";
import type { UIAdapterModule } from "../types";
import { parseClaudeStdoutLine } from "@paperclipai/adapter-claude-local/ui";
import { ClaudeLocalConfigFields } from "./config-fields";
import { buildClaudeLocalConfig } from "@paperclipai/adapter-claude-local/ui";

export const claudeLocalUIAdapter: UIAdapterModule = {
  type: "claude_local",
  label: tf("auto.246ef8c1130d56f5"),
  parseStdoutLine: parseClaudeStdoutLine,
  ConfigFields: ClaudeLocalConfigFields,
  buildAdapterConfig: buildClaudeLocalConfig,
};
