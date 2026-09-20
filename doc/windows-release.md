# Windows-Veröffentlichung

Der deutsche Fork kann Windows-Dateien mit einem bereits kompilierten nativen Runner veröffentlichen. Nutzer benötigen dadurch keine C++-Build-Tools. Sie benötigen nur die von der Installationsroutine geprüften Laufzeitvoraussetzungen.

## Testpaket bauen

1. In GitHub den Workflow **Deutsche Windows-Veröffentlichung** öffnen.
2. **Run workflow** wählen.
3. Als `source_ref` normalerweise `fork/deutsch` eintragen.
4. Einen neuen Tag wie `de-v2026.920.0` eintragen.
5. `publish` auf `false` lassen.

Der Workflow baut `paperclip-runnerd.exe`, erstellt den Windows-Installer und legt Prüfsummen als GitHub-Artefakt ab. Das Artefakt kann vor einer Veröffentlichung heruntergeladen und getestet werden.

## Veröffentlichung

Nach erfolgreichem Test wird ein Tag erstellt und übertragen:

```powershell
git tag de-v2026.920.0
git push origin de-v2026.920.0
```

Der Tag startet den gleichen Workflow automatisch. Er veröffentlicht diese Dateien im GitHub Release:

- `Paperclip-DE-Setup-de-v2026.920.0.exe`
- `paperclip-runnerd-windows-x64.exe`
- `SHA256SUMS.txt`

Der Installer richtet fehlendes Git und Node.js über Windows automatisch ein, lädt den Runner passend zum Release und muss ihn nicht lokal kompilieren. Danach erstellt er die Desktop-Verknüpfung **Paperclip DE**.

## Signatur

Für eine vertrauenswürdigere Windows-Anzeige können im Repository zwei Actions-Secrets hinterlegt werden:

- `WINDOWS_SIGN_CERT_BASE64`: Base64-Inhalt eines PFX-Zertifikats
- `WINDOWS_SIGN_CERT_PASSWORD`: Passwort des PFX-Zertifikats

Ohne diese Secrets funktioniert der Build trotzdem. Windows kann bei unsignierten Dateien jedoch weiterhin SmartScreen anzeigen.

## Aktualisierung des Forks

`fork-upstream-update.yml` prüft täglich das neueste stabile Originalrelease. Bei neuen Änderungen wird ein Entwurfs-Pull-Request erzeugt und der deutsche Prüfworkflow gestartet. Erst nach erfolgreicher Prüfung wird der Update-Branch übernommen und danach ein neuer `de-v...`-Tag erstellt.
