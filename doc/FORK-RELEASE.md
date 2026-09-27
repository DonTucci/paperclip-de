# Release-Prüfung im deutschen Fork

Jeder Upstream-Job in `release.yml` ist mit
`github.repository == 'paperclipai/paperclip'` abgegrenzt. Dies gilt auch
für manuelle Starts, Zeitpläne, Dry-Runs und Statusfunktionen. Der Fork
betritt keine npm-Publishing-Umgebung und erstellt keine Upstream-Tags.
Die bestehende Upstream-Logik bleibt erhalten.

Im Fork laufen stattdessen:

- `fork_boundary`: Regressionstest aller Upstream-Jobbedingungen.
- `fork_verify`: vollständiger Release-Verify-Workflow mit Event-SHA,
  einschließlich Build, Typecheck, Tests und Runner-Prüfungen.
- `fork_smoke`: bestehende Docker-/Browser- und systemd-Installer-Smokes
  gegen das veröffentlichte npm-`nightly`. Dies prüft die Kompatibilität
  des Upstream-Installers, kein veröffentlichtes Fork-Paket.

Pushes auf `fork/deutsch`, manuelle Starts und der bestehende Zeitplan
starten diese Prüfungen. Im Fork wird immer der Event-SHA geprüft;
`source_ref` ist dort kein Build-Override.

Windows-EXE, Runner und Prüfsummen bleiben im unveränderten Workflow
`fork-windows-release.yml` verfügbar. Ein Testlauf verwendet den geprüften
SHA als `source_ref`, einen `de-v...`-Tag und `publish=false`. Dies erzeugt
Actions-Artefakte ohne GitHub-Release. Docker bleibt separat in `docker.yml`
verfügbar; die Korrektur führt keine neue Registry-Veröffentlichung ein.

## Ursache

`a77aa3b31` ergänzte Fork-Prüfung und Upstream-Synchronisation.
`95b7dc61b` dokumentierte eine getrennte Veröffentlichungsstrategie,
änderte aber nur Dokumentation. Im aktiven Stand `94dc1463f` fehlte die
Repository-Abgrenzung unter anderem bei `publish_nightly`. Zusätzliche
Fork-Workflows ersetzen oder deaktivieren den ursprünglichen Workflow nicht.

Bei Upstream-Synchronisation neue Release-Jobs ebenfalls abgrenzen.
Der Regressionstest lehnt nicht abgegrenzte Jobs ab. Uncommittete Änderungen
in anderen, nicht bereitgestellten Arbeitsverzeichnissen lassen sich durch
die Remote-Historie nicht ausschließen.
