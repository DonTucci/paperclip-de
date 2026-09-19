import { tf } from "@/i18n/fork";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { nextCronFires, parseCronExpression } from "../lib/cron-fires";

export type SchedulePreset = "every_minute" | "every_hour" | "every_day" | "weekdays" | "weekly" | "monthly" | "custom";

const PRESETS: { value: SchedulePreset; label: string }[] = [
  { value: "every_minute", label: tf("auto.3c14fb8a28813883") },
  { value: "every_hour", label: tf("auto.a4bac4655d4593de") },
  { value: "every_day", label: tf("auto.c4e42b974c335dc5") },
  { value: "weekdays", label: tf("auto.6f4b602bb52984dc") },
  { value: "weekly", label: tf("auto.2975132481a7a695") },
  { value: "monthly", label: tf("auto.9b11f6b707d2a03e") },
  { value: "custom", label: tf("auto.6dc53fd85ce22bf5") },
];

const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: String(i),
  label: i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`,
}));

const MINUTES = Array.from({ length: 12 }, (_, i) => ({
  value: String(i * 5),
  label: String(i * 5).padStart(2, "0"),
}));

const DAYS_OF_WEEK = [
  { value: "1", label: tf("auto.f40d7f51f69edfaf") },
  { value: "2", label: tf("auto.d1eb39b09bf52b68") },
  { value: "3", label: tf("auto.58339f45df960408") },
  { value: "4", label: tf("auto.7da11212ed340ea7") },
  { value: "5", label: tf("auto.66dab40cea1dea5c") },
  { value: "6", label: tf("auto.fdeb71b569e0034d") },
  { value: "0", label: tf("auto.db18f17fe5320076") },
];

const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

function hasOption(options: Array<{ value: string }>, value: string): boolean {
  return options.some((option) => option.value === value);
}

export function parseCronToPreset(cron: string): {
  preset: SchedulePreset;
  hour: string;
  minute: string;
  dayOfWeek: string;
  dayOfMonth: string;
} {
  const defaults = { hour: "10", minute: "0", dayOfWeek: "1", dayOfMonth: "1" };

  if (!cron || !cron.trim()) {
    return { preset: "every_day", ...defaults };
  }

  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { preset: "custom", ...defaults };
  }

  const [min, hr, dom, month, dow] = parts;
  const selectableMinute = hasOption(MINUTES, min);
  const selectableHour = hasOption(HOURS, hr);

  // Every minute: "* * * * *"
  if (min === "*" && hr === "*" && dom === "*" && month === "*" && dow === "*") {
    return { preset: "every_minute", ...defaults };
  }

  // Every hour: "0 * * * *"
  if (hr === "*" && dom === "*" && month === "*" && dow === "*" && selectableMinute) {
    return { preset: "every_hour", ...defaults, minute: min };
  }

  // Every day: "M H * * *"
  if (dom === "*" && month === "*" && dow === "*" && selectableHour && selectableMinute) {
    return { preset: "every_day", ...defaults, hour: hr, minute: min };
  }

  // Weekdays: "M H * * 1-5"
  if (dom === "*" && month === "*" && dow === "1-5" && selectableHour && selectableMinute) {
    return { preset: "weekdays", ...defaults, hour: hr, minute: min };
  }

  // Weekly: "M H * * D" (single day)
  if (dom === "*" && month === "*" && hasOption(DAYS_OF_WEEK, dow) && selectableHour && selectableMinute) {
    return { preset: "weekly", ...defaults, hour: hr, minute: min, dayOfWeek: dow };
  }

  // Monthly: "M H D * *"
  if (month === "*" && hasOption(DAYS_OF_MONTH, dom) && dow === "*" && selectableHour && selectableMinute) {
    return { preset: "monthly", ...defaults, hour: hr, minute: min, dayOfMonth: dom };
  }

  return { preset: "custom", ...defaults };
}

export function buildCron(preset: SchedulePreset, hour: string, minute: string, dayOfWeek: string, dayOfMonth: string): string {
  switch (preset) {
    case "every_minute":
      return "* * * * *";
    case "every_hour":
      return `${minute} * * * *`;
    case "every_day":
      return `${minute} ${hour} * * *`;
    case "weekdays":
      return `${minute} ${hour} * * 1-5`;
    case "weekly":
      return `${minute} ${hour} * * ${dayOfWeek}`;
    case "monthly":
      return `${minute} ${hour} ${dayOfMonth} * *`;
    case "custom":
      return "";
  }
}

function describeSchedule(cron: string): string {
  const { preset, hour, minute, dayOfWeek, dayOfMonth } = parseCronToPreset(cron);
  const hourLabel = HOURS.find((h) => h.value === hour)?.label ?? `${hour}`;
  const timeStr = `${hourLabel.replace(/ (AM|PM)$/, "")}:${minute.padStart(2, "0")} ${hourLabel.match(/(AM|PM)$/)?.[0] ?? ""}`;

  switch (preset) {
    case "every_minute":
      return "Every minute";
    case "every_hour":
      return `Every hour at :${minute.padStart(2, "0")}`;
    case "every_day":
      return `Every day at ${timeStr}`;
    case "weekdays":
      return `Weekdays at ${timeStr}`;
    case "weekly": {
      const day = DAYS_OF_WEEK.find((d) => d.value === dayOfWeek)?.label ?? dayOfWeek;
      return `Every ${day} at ${timeStr}`;
    }
    case "monthly":
      return `Monthly on the ${dayOfMonth}${ordinalSuffix(Number(dayOfMonth))} at ${timeStr}`;
    case "custom":
      return cron || "No schedule set";
  }
}

function ordinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export { describeSchedule };

export function getScheduleCronValidation(cron: string): {
  valid: boolean;
  message: string;
  nextFires: Date[];
} {
  const trimmed = cron.trim();
  if (!trimmed) {
    return {
      valid: false,
      message: tf("auto.317636a735821037"),
      nextFires: [],
    };
  }

  const fields = trimmed.split(/\s+/);
  if (fields.length !== 5) {
    return {
      valid: false,
      message: `Use exactly 5 fields; this has ${fields.length}.`,
      nextFires: [],
    };
  }

  if (!parseCronExpression(trimmed)) {
    return {
      valid: false,
      message: tf("auto.a9b7c68b0a4610d0"),
      nextFires: [],
    };
  }

  const nextFires = nextCronFires(trimmed, 3, { timeZone: "UTC" });
  return {
    valid: true,
    message: nextFires.length > 0 ? "Valid cron." : "Valid cron, but no upcoming fires were found.",
    nextFires,
  };
}

export function ScheduleEditor({
  value,
  onChange,
  onValidityChange,
}: {
  value: string;
  onChange: (cron: string) => void;
  onValidityChange?: (valid: boolean) => void;
}) {
  const parsed = useMemo(() => parseCronToPreset(value), [value]);
  const [preset, setPreset] = useState<SchedulePreset>(parsed.preset);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [dayOfWeek, setDayOfWeek] = useState(parsed.dayOfWeek);
  const [dayOfMonth, setDayOfMonth] = useState(parsed.dayOfMonth);
  const [customCron, setCustomCron] = useState(preset === "custom" ? value : "");
  const customValidation = useMemo(() => getScheduleCronValidation(customCron), [customCron]);

  useEffect(() => {
    onValidityChange?.(preset !== "custom" || customValidation.valid);
  }, [customValidation.valid, onValidityChange, preset]);

  // Sync from external value changes
  useEffect(() => {
    const p = parseCronToPreset(value);
    setPreset(p.preset);
    setHour(p.hour);
    setMinute(p.minute);
    setDayOfWeek(p.dayOfWeek);
    setDayOfMonth(p.dayOfMonth);
    if (p.preset === "custom") setCustomCron(value);
  }, [value]);

  const emitChange = useCallback(
    (p: SchedulePreset, h: string, m: string, dow: string, dom: string, custom: string) => {
      if (p === "custom") {
        onChange(custom);
      } else {
        onChange(buildCron(p, h, m, dow, dom));
      }
    },
    [onChange],
  );

  const handlePresetChange = (newPreset: SchedulePreset) => {
    setPreset(newPreset);
    if (newPreset === "custom") {
      setCustomCron(value);
    } else {
      emitChange(newPreset, hour, minute, dayOfWeek, dayOfMonth, customCron);
    }
  };

  return (
    <div className="space-y-3">
      <Select value={preset} onValueChange={(v) => handlePresetChange(v as SchedulePreset)}>
        <SelectTrigger className="w-full" aria-label={tf("auto.feed2d11fc52ba9a")}>
          <SelectValue placeholder={tf("auto.554798442cd7ef04")} />
        </SelectTrigger>
        <SelectContent>
          {PRESETS.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {preset === "custom" ? (
        <div className="space-y-1.5">
          <Input
            value={customCron}
            onChange={(e) => {
              const nextCron = e.target.value;
              setCustomCron(nextCron);
              // Report validity synchronously with the keystroke so consumers can gate
              // their submit affordance in the same render. Relying solely on the
              // effect below leaves a one-tick window where an invalid draft still
              // reads as valid to the parent.
              const nextValidation = getScheduleCronValidation(nextCron);
              onValidityChange?.(nextValidation.valid);
              if (nextValidation.valid) {
                emitChange("custom", hour, minute, dayOfWeek, dayOfMonth, nextCron);
              }
            }}
            placeholder="0 10 * * *"
            aria-label={tf("auto.9e6e7de6b9d693c9")}
            aria-invalid={!customValidation.valid}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            {tf("auto.7abb912add4d394a")}
          </p>
          <p
            className={customValidation.valid ? "text-xs text-muted-foreground" : "text-xs text-destructive"}
            aria-live="polite"
          >
            {customValidation.message}
            {customValidation.valid && customValidation.nextFires.length > 0
              ? ` Next: ${customValidation.nextFires.map((fire) => fire.toLocaleString()).join(", ")}.`
              : null}
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {preset !== "every_minute" && preset !== "every_hour" && (
            <>
              <span className="text-sm text-muted-foreground">{tf("auto.b1d6b91b67c2afa5")}</span>
              <Select
                value={hour}
                onValueChange={(h) => {
                  setHour(h);
                  emitChange(preset, h, minute, dayOfWeek, dayOfMonth, customCron);
                }}
              >
                <SelectTrigger className="w-(--sz-120px)">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.map((h) => (
                    <SelectItem key={h.value} value={h.value}>
                      {h.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">:</span>
              <Select
                value={minute}
                onValueChange={(m) => {
                  setMinute(m);
                  emitChange(preset, hour, m, dayOfWeek, dayOfMonth, customCron);
                }}
              >
                <SelectTrigger className="w-(--sz-80px)">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MINUTES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {preset === "every_hour" && (
            <>
              <span className="text-sm text-muted-foreground">{tf("auto.5f2ed72dfcbcf154")}</span>
              <Select
                value={minute}
                onValueChange={(m) => {
                  setMinute(m);
                  emitChange(preset, hour, m, dayOfWeek, dayOfMonth, customCron);
                }}
              >
                <SelectTrigger className="w-(--sz-80px)">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MINUTES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      :{m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {preset === "weekly" && (
            <>
              <span className="text-sm text-muted-foreground">{tf("auto.b8d31e852725afb1")}</span>
              <div className="flex gap-1">
                {DAYS_OF_WEEK.map((d) => (
                  <Button
                    key={d.value}
                    type="button"
                    variant={dayOfWeek === d.value ? "default" : "outline"}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    aria-pressed={dayOfWeek === d.value}
                    onClick={() => {
                      setDayOfWeek(d.value);
                      emitChange(preset, hour, minute, d.value, dayOfMonth, customCron);
                    }}
                  >
                    {d.label}
                  </Button>
                ))}
              </div>
            </>
          )}

          {preset === "monthly" && (
            <>
              <span className="text-sm text-muted-foreground">{tf("auto.ada1fca3e7ade2de")}</span>
              <Select
                value={dayOfMonth}
                onValueChange={(dom) => {
                  setDayOfMonth(dom);
                  emitChange(preset, hour, minute, dayOfWeek, dom, customCron);
                }}
              >
                <SelectTrigger className="w-(--sz-80px)">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_MONTH.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      )}
    </div>
  );
}
