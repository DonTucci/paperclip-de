import { tf } from "@/i18n/fork";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ShortcutEntry {
  keys: string[];
  label: string;
  /** Render keys as a simultaneous chord (joined with "+") rather than a
   *  "then" sequence. */
  combo?: boolean;
}

interface ShortcutSection {
  title: string;
  shortcuts: ShortcutEntry[];
}

const sections: ShortcutSection[] = [
  {
    title: tf("text.Inbox"),
    shortcuts: [
      { keys: ["j"], label: tf("auto.40bb50da160cdc21") },
      { keys: ["↓"], label: tf("auto.40bb50da160cdc21") },
      { keys: ["k"], label: tf("auto.c66feb5eb8f217c7") },
      { keys: ["↑"], label: tf("auto.c66feb5eb8f217c7") },
      { keys: ["←"], label: tf("auto.933a60afce8a6b41") },
      { keys: ["→"], label: tf("auto.6ecae6bf37bf0525") },
      { keys: ["Enter"], label: tf("auto.948dbc15b31394c9") },
      { keys: ["a"], label: tf("auto.0fd57cea79115d49") },
      { keys: ["y"], label: tf("auto.0fd57cea79115d49") },
      { keys: ["r"], label: tf("text.Mark as read") },
      { keys: ["U"], label: tf("auto.2c19d584bf8ad518") },
    ],
  },
  {
    title: tf("auto.be4654d6726af242"),
    shortcuts: [
      { keys: ["y"], label: tf("auto.630428a4c87f5f6b") },
      { keys: ["g", "i"], label: tf("auto.cde5bedaa1cc432c") },
      { keys: ["g", "c"], label: tf("auto.a0f6da743c071031") },
    ],
  },
  {
    title: tf("text.Decisions"),
    shortcuts: [
      { keys: ["j"], label: tf("auto.40bb50da160cdc21") },
      { keys: ["↓"], label: tf("auto.40bb50da160cdc21") },
      { keys: ["k"], label: tf("auto.c66feb5eb8f217c7") },
      { keys: ["↑"], label: tf("auto.c66feb5eb8f217c7") },
      { keys: ["Enter"], label: tf("auto.54d2aedada1f0c4c") },
      { keys: ["x"], label: tf("auto.371158fa81c25127") },
    ],
  },
  {
    title: tf("auto.a258b30f88c30650"),
    shortcuts: [
      { keys: ["/"], label: tf("auto.4dac6ee7d1ea34bb") },
      { keys: ["c"], label: tf("text.New task") },
      { keys: ["["], label: tf("auto.041aefc44394f530") },
      { keys: ["]"], label: tf("auto.ed98852805c90543") },
      { keys: ["?"], label: tf("auto.3d0ced5dc621bc9e") },
    ],
  },
];

function KeyCap({ children }: { children: string }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium text-foreground shadow-(--shadow-extract-10)">
      {children}
    </kbd>
  );
}

export function KeyboardShortcutsCheatsheetContent() {
  return (
    <>
      <div className="divide-y divide-border border-t border-border">
        {sections.map((section) => (
          <div key={section.title} className="px-5 py-3">
            <h3 className="mb-2 text-(length:--text-micro) font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h3>
            <div className="space-y-1.5">
              {section.shortcuts.map((shortcut) => (
                <div
                  key={shortcut.label + shortcut.keys.join()}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-sm text-foreground/90">{shortcut.label}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, i) => (
                      <span key={key} className="flex items-center gap-1">
                        {i > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {shortcut.combo ? "+" : "then"}
                          </span>
                        )}
                        <KeyCap>{key}</KeyCap>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-5 py-3">
        <p className="text-xs text-muted-foreground">
          Press <KeyCap>{tf("auto.52f878edb34fa14f")}</KeyCap> to close &middot; Shortcuts are disabled in text fields
        </p>
      </div>
    </>
  );
}

export function KeyboardShortcutsCheatsheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden" showCloseButton={false}>
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-base">{tf("auto.e9bef0b0f3c25e6e")}</DialogTitle>
        </DialogHeader>
        <KeyboardShortcutsCheatsheetContent />
      </DialogContent>
    </Dialog>
  );
}
