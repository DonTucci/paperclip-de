import { tf } from "@/i18n/fork";
import animatedHero from "../../../announcements/examples/animated/assets/78bafb6adbfd9da899cdbb5d934b4c0b9df5d419d6f0a5104a87a7b25dcc6bd8.html?raw";
import type { Announcement } from "@paperclipai/shared";

/** Design guide / Storybook only. Never a runtime feed fallback. */
export const announcementPreview: Announcement = {
  id: "preview-work-together",
  eyebrow: "New in Paperclip",
  title: tf("auto.4e9241f6776c0215"),
  description: tf("auto.c42c81b24ccb1bb1"),
  image: { path: `assets/${"0".repeat(64)}.png`, alt: tf("auto.b9965c074c85b9fb") },
  secondaryLink: { kind: "external", label: tf("auto.1445799c033a2d17"), url: "https://paperclip.ing" },
  primaryAction: { kind: "route", label: tf("auto.44b5675508a159e6"), path: "/projects" },
};

export const announcementAnimationPreview: Announcement = {
  ...announcementPreview,
  animation: { path: "assets/78bafb6adbfd9da899cdbb5d934b4c0b9df5d419d6f0a5104a87a7b25dcc6bd8.html", alt: tf("auto.30348b941e7d5537") },
};
export const announcementAnimationPreviewSrc = `data:text/html;charset=utf-8,${encodeURIComponent(animatedHero)}`;
