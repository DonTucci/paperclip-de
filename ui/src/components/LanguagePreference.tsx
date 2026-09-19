import { tf } from "@/i18n/fork";
import { useId, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { readLanguage, saveLanguage, type ForkLanguage } from "../i18n/fork-preferences";

export function LanguagePreference() {
  const id = useId();
  const [language, setLanguage] = useState<ForkLanguage>(readLanguage);
  const [error, setError] = useState(false);
  return (
    <section className="space-y-3 rounded-lg border border-border p-4">
      <Label htmlFor={id}>{tf("language.label")}</Label>
      <p className="text-sm text-muted-foreground">{tf("language.description")}</p>
      <select
        id={id}
        value={language}
        onChange={(event) => setLanguage(event.target.value as ForkLanguage)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="de">{tf("auto.b0f39c44af654d3a")}</option>
        <option value="en">{tf("auto.ba118bf7fc9c1aed")}</option>
      </select>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          try {
            saveLanguage(language);
            window.location.reload();
          } catch {
            setError(true);
          }
        }}
      >
        {tf("language.apply")}
      </Button>
      {error && <p role="alert" className="text-sm text-destructive">{tf("language.error")}</p>}
    </section>
  );
}
