import { tf } from "@/i18n/fork";
/**
 * Attachment-chip helpers for the task-chat redesign (PAP-351): map a filename
 * to a kind icon + label for the shadcn base/attachment chips, and extract the
 * non-image file references the composer writes into message bodies
 * ("[name](/api/attachments/<id>/content)") so posted bubbles can render them
 * as the same chips instead of bare links.
 */
import {
  FileArchive,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileVideo,
  File as FileIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { IssueAttachment } from "@paperclipai/shared";

export interface FileKind {
  icon: LucideIcon;
  /** Short kind label for the chip description, e.g. "PDF", "ZIP". */
  label: string;
}

const IMAGE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg",
  "avif",
  "bmp",
  "ico",
  "heic",
]);

const KIND_BY_EXTENSION: Record<string, FileKind> = {
  pdf: { icon: FileText, label: tf("auto.1d393b0081b632c5") },
  doc: { icon: FileText, label: tf("auto.49f4e57c2625d4ae") },
  docx: { icon: FileText, label: tf("auto.49f4e57c2625d4ae") },
  txt: { icon: FileText, label: tf("auto.71988c4d8e0803ba") },
  md: { icon: FileText, label: tf("auto.0e52f6b9d02515c5") },
  rtf: { icon: FileText, label: tf("auto.71988c4d8e0803ba") },
  csv: { icon: FileSpreadsheet, label: tf("auto.eb6b42f54c42d283") },
  tsv: { icon: FileSpreadsheet, label: tf("auto.fca17147560446ce") },
  xls: { icon: FileSpreadsheet, label: tf("auto.54bf0ebbfb3e0e37") },
  xlsx: { icon: FileSpreadsheet, label: tf("auto.54bf0ebbfb3e0e37") },
  zip: { icon: FileArchive, label: tf("auto.eaca4b30692888d0") },
  gz: { icon: FileArchive, label: tf("text.Archive") },
  tar: { icon: FileArchive, label: tf("text.Archive") },
  tgz: { icon: FileArchive, label: tf("text.Archive") },
  rar: { icon: FileArchive, label: tf("text.Archive") },
  "7z": { icon: FileArchive, label: tf("text.Archive") },
  mp3: { icon: FileAudio, label: tf("auto.bc1b88907d3b748a") },
  wav: { icon: FileAudio, label: tf("auto.bc1b88907d3b748a") },
  m4a: { icon: FileAudio, label: tf("auto.bc1b88907d3b748a") },
  ogg: { icon: FileAudio, label: tf("auto.bc1b88907d3b748a") },
  mp4: { icon: FileVideo, label: tf("auto.d534be829e32196b") },
  mov: { icon: FileVideo, label: tf("auto.d534be829e32196b") },
  webm: { icon: FileVideo, label: tf("auto.d534be829e32196b") },
  json: { icon: FileCode, label: tf("auto.db1a21a0bc2ef8fb") },
  yaml: { icon: FileCode, label: tf("auto.9b6e8abe425e34bb") },
  yml: { icon: FileCode, label: tf("auto.9b6e8abe425e34bb") },
  xml: { icon: FileCode, label: tf("auto.40658e9af8fd9222") },
  html: { icon: FileCode, label: tf("auto.07239dbd2a1a1dd7") },
  css: { icon: FileCode, label: tf("auto.b581e46042cbfbb0") },
  js: { icon: FileCode, label: tf("auto.340f463033e0fd5d") },
  jsx: { icon: FileCode, label: tf("auto.340f463033e0fd5d") },
  ts: { icon: FileCode, label: tf("auto.340f463033e0fd5d") },
  tsx: { icon: FileCode, label: tf("auto.340f463033e0fd5d") },
  py: { icon: FileCode, label: tf("auto.340f463033e0fd5d") },
  rb: { icon: FileCode, label: tf("auto.340f463033e0fd5d") },
  go: { icon: FileCode, label: tf("auto.340f463033e0fd5d") },
  rs: { icon: FileCode, label: tf("auto.340f463033e0fd5d") },
  sh: { icon: FileCode, label: tf("auto.340f463033e0fd5d") },
  sql: { icon: FileCode, label: tf("auto.a7056a455639d1c7") },
  log: { icon: FileText, label: tf("auto.21e49eb2b299c9f7") },
  patch: { icon: FileCode, label: tf("auto.7e345470de240d11") },
  diff: { icon: FileCode, label: tf("auto.7e345470de240d11") },
};

function extensionOf(name: string): string {
  const match = /\.([a-z0-9]+)$/i.exec(name.trim());
  return match ? match[1].toLowerCase() : "";
}

export function isImageFilename(name: string): boolean {
  return IMAGE_EXTENSIONS.has(extensionOf(name));
}

type AttachmentRecord = Pick<
  IssueAttachment,
  | "id"
  | "contentPath"
  | "openPath"
  | "downloadPath"
  | "contentType"
  | "byteSize"
  | "originalFilename"
>;

function normalizedContentType(contentType: string | undefined): string {
  return (contentType ?? "").toLowerCase().split(";")[0]?.trim() ?? "";
}

/** MIME type is authoritative; filenames remain a fallback for legacy refs. */
export function isImageAttachment(ref: AttachmentRef): boolean {
  const contentType = normalizedContentType(ref.contentType);
  if (contentType.startsWith("image/")) return true;
  if (contentType && contentType !== "application/octet-stream") return false;
  return isImageFilename(ref.name) || isImageFilename(ref.url.split("?")[0]);
}

/** Kind icon + short label for a filename; unknown extensions get File/"File". */
export function fileKindForName(name: string): FileKind {
  return KIND_BY_EXTENSION[extensionOf(name)] ?? { icon: FileIcon, label: tf("text.File") };
}

export function fileKindForAttachment(ref: AttachmentRef): FileKind {
  const byName = fileKindForName(ref.name);
  if (byName.label !== "File") return byName;

  const contentType = normalizedContentType(ref.contentType);
  if (contentType === "application/pdf") return { icon: FileText, label: tf("auto.1d393b0081b632c5") };
  if (contentType === "application/json" || contentType.endsWith("+json")) {
    return { icon: FileCode, label: tf("auto.db1a21a0bc2ef8fb") };
  }
  if (contentType === "text/csv" || contentType === "application/csv") {
    return { icon: FileSpreadsheet, label: tf("auto.eb6b42f54c42d283") };
  }
  if (contentType.startsWith("text/")) return { icon: FileText, label: tf("auto.71988c4d8e0803ba") };
  if (contentType.startsWith("audio/")) return { icon: FileAudio, label: tf("auto.bc1b88907d3b748a") };
  if (contentType.startsWith("video/")) return { icon: FileVideo, label: tf("auto.d534be829e32196b") };
  if (contentType.includes("zip") || contentType.includes("archive")) {
    return { icon: FileArchive, label: tf("text.Archive") };
  }
  return byName;
}

/** "2.4 MB"-style size for chip descriptions (same tiers as IssueChatThread). */
export function formatFileSize(bytes: number | undefined): string {
  if (bytes === undefined || !Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface AttachmentRef {
  name: string;
  url: string;
  id?: string;
  contentType?: string;
  byteSize?: number;
  openPath?: string;
  downloadPath?: string;
}

function attachmentIdFromUrl(url: string): string | null {
  return /\/api\/(?:attachments|assets)\/([^/?]+)\/content/.exec(url)?.[1] ?? null;
}

export function hydrateAttachmentRefs(
  refs: AttachmentRef[],
  attachments: AttachmentRecord[],
): AttachmentRef[] {
  const byId = new Map(attachments.map((attachment) => [attachment.id, attachment]));
  const byPath = new Map(
    attachments.flatMap((attachment) => [
      [attachment.contentPath, attachment] as const,
      ...(attachment.openPath ? [[attachment.openPath, attachment] as const] : []),
    ]),
  );

  return refs.map((ref) => {
    const cleanUrl = ref.url.split("?")[0];
    const record =
      byPath.get(cleanUrl) ??
      byId.get(attachmentIdFromUrl(ref.url) ?? "");
    if (!record) return ref;
    return {
      ...ref,
      id: record.id,
      name: record.originalFilename?.trim() || ref.name,
      contentType: record.contentType,
      byteSize: record.byteSize,
      openPath: record.openPath,
      downloadPath: record.downloadPath,
    };
  });
}

/**
 * Markdown links (not `![]` embeds) pointing at attachment/asset content. The
 * label admits backslash-escaped characters — the composer escapes `[`/`]` in
 * filenames when inserting references.
 */
const ATTACHMENT_LINK_RE =
  /(?<!!)\[((?:\\.|[^\]\\])+)\]\((\/api\/(?:attachments|assets)\/[^()\s]+\/content(?:\?[^()\s]*)?)\)/g;

/** Markdown image embeds (`![name](url)`), same escaped-label grammar. */
const IMAGE_EMBED_RE = /!\[((?:\\.|[^\]\\])*)\]\(([^()\s]+)\)/g;

function isStandaloneImageEmbedLine(line: string): boolean {
  return (
    line.replace(IMAGE_EMBED_RE, "").trim().length === 0 && line.trim().length > 0
  );
}

/**
 * Images on standalone lines, in document order, deduped by URL. Images woven
 * into prose stay inline so they are not also duplicated in the media strip.
 * Feeds the bubble's lightbox: the refs become the gallery items and the
 * clicked <img> src picks the initial index.
 */
export function extractImageRefs(body: string): AttachmentRef[] {
  const refs: AttachmentRef[] = [];
  const seen = new Set<string>();
  for (const line of body.split("\n")) {
    if (!isStandaloneImageEmbedLine(line)) continue;
    for (const match of line.matchAll(IMAGE_EMBED_RE)) {
      const [, name, url] = match;
      if (seen.has(url)) continue;
      seen.add(url);
      refs.push({ name: name.replace(/\\([[\]])/g, "$1"), url });
    }
  }
  return refs;
}

/** Remove standalone image-embed lines after promoting them to the media strip. */
export function stripStandaloneImageEmbeds(body: string): string {
  return body
    .split("\n")
    .filter((line) => !isStandaloneImageEmbedLine(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export interface ExtractedAttachmentRefs {
  refs: AttachmentRef[];
  /** Body with lines that were nothing but extracted links removed. */
  text: string;
}

/**
 * Pull non-image attachment references out of a message body. Every matching
 * link becomes a chip; a line is stripped from the rendered body only when it
 * contains nothing but extracted links (the shape the composer inserts), so
 * links woven into prose keep their sentence.
 */
export function extractAttachmentRefs(body: string): ExtractedAttachmentRefs {
  const refs: AttachmentRef[] = [];
  const seen = new Set<string>();
  for (const match of body.matchAll(ATTACHMENT_LINK_RE)) {
    const [, name, url] = match;
    if (seen.has(url)) continue;
    seen.add(url);
    refs.push({ name: name.replace(/\\([[\]])/g, "$1"), url });
  }
  if (refs.length === 0) return { refs, text: body };

  const kept = body.split("\n").filter((line) => {
    const withoutLinks = line.replace(ATTACHMENT_LINK_RE, (full, name: string, url: string) => {
      return seen.has(url) ? "" : full;
    });
    return withoutLinks.trim().length > 0 || line.trim().length === 0;
  });
  // Collapse the blank run left behind where a link-only line was removed.
  const text = kept
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { refs, text };
}
