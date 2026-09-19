import { tf } from "@/i18n/fork";
import { Database, Gauge, ReceiptText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SURFACES = [
  {
    title: tf("auto.41faba7cc38d6027"),
    description: tf("auto.80135fc7038b8e97"),
    icon: Database,
    points: ["tokens + billed dollars", "provider, biller, model", "subscription and overage aware"],
    tone: "from-sky-500/12 via-sky-500/6 to-transparent",
  },
  {
    title: tf("auto.46bfab69ff187f2f"),
    description: tf("auto.5f1e31b27c3e9193"),
    icon: ReceiptText,
    points: ["top-ups, refunds, fees", "Bedrock provisioned or training charges", "credit expiries and adjustments"],
    tone: "from-amber-500/14 via-amber-500/6 to-transparent",
  },
  {
    title: tf("auto.d7cd0a58c6713ccf"),
    description: tf("auto.c4f5142f91accff0"),
    icon: Gauge,
    points: ["provider quota windows", "biller credit systems", "errors surfaced directly"],
    tone: "from-emerald-500/14 via-emerald-500/6 to-transparent",
  },
] as const;

export function AccountingModelCard() {
  return (
    <Card className="relative overflow-hidden border-border/70">
      <div className="absolute inset-0 bg-(image:--gradient-extract-3)" />
      <CardHeader className="relative px-5 pt-5 pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-(--tracking-caps) text-muted-foreground">
          {tf("auto.811f1fa2a5af2e68")}
        </CardTitle>
        <CardDescription className="max-w-2xl text-sm leading-6">
          Paperclip now separates request-level inference usage from account-level finance events.
          That keeps provider reporting honest when the biller is OpenRouter, Cloudflare, Bedrock, or another intermediary.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative grid gap-3 px-5 pb-5 md:grid-cols-3">
        {SURFACES.map((surface) => {
          const Icon = surface.icon;
          return (
            <div
              key={surface.title}
              className={`rounded-2xl border border-border/70 bg-gradient-to-br ${surface.tone} p-4 shadow-sm`}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{surface.title}</div>
                  <div className="text-xs text-muted-foreground">{surface.description}</div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                {surface.points.map((point) => (
                  <div key={point}>{point}</div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
