import { tf } from "@/i18n/fork";
import type { FinanceByKind } from "@paperclipai/shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { financeEventKindDisplayName, formatCents } from "@/lib/utils";

interface FinanceKindCardProps {
  rows: FinanceByKind[];
}

export function FinanceKindCard({ rows }: FinanceKindCardProps) {
  return (
    <Card>
      <CardHeader className="px-4 pt-4 pb-1">
        <CardTitle className="text-base">{tf("auto.ca44745da6492463")}</CardTitle>
        <CardDescription>{tf("auto.61cc3a6edc93d2c3")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-4 pt-3">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">{tf("auto.66810e6a0789e6f9")}</p>
        ) : (
          rows.map((row) => (
            <div
              key={row.eventKind}
              className="flex items-center justify-between gap-3 border border-border px-3 py-2"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{financeEventKindDisplayName(row.eventKind)}</div>
                <div className="text-xs text-muted-foreground">
                  {row.eventCount} event{row.eventCount === 1 ? "" : "s"} · {row.billerCount} biller{row.billerCount === 1 ? "" : "s"}
                </div>
              </div>
              <div className="text-right tabular-nums">
                <div className="text-sm font-medium">{formatCents(row.netCents)}</div>
                <div className="text-xs text-muted-foreground">
                  {formatCents(row.debitCents)} debits
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
