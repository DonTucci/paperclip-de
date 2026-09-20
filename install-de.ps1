[CmdletBinding()]
param(
  [string]$InstallPath = (Join-Path $env:LOCALAPPDATA 'Paperclip-DE'),
  [switch]$Start,
  [switch]$SkipPrerequisiteInstall
)

$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)
[Console]::OutputEncoding = $utf8
$OutputEncoding = $utf8
$repository = 'https://github.com/DonTucci/paperclip-de.git'
$branch = 'fork/deutsch'
$releaseTag = '__RELEASE_TAG__'
if ($releaseTag -eq '__RELEASE_TAG__') {
  $releaseTag = $env:PAPERCLIP_DE_RELEASE_TAG
}

function Install-Prerequisite([string]$Name, [string]$PackageId) {
  if ($SkipPrerequisiteInstall) {
    throw "$Name wurde nicht gefunden. Die automatische Installation wurde übersprungen."
  }
  if (-not (Get-Command 'winget' -ErrorAction SilentlyContinue)) {
    throw "$Name wurde nicht gefunden und Windows App Installer (winget) ist nicht verfügbar. Installieren Sie $Name und starten Sie die EXE erneut."
  }

  Write-Host "$Name wird automatisch eingerichtet ..."
  & winget install --id $PackageId --exact --silent --accept-package-agreements --accept-source-agreements
  if ($LASTEXITCODE -ne 0) {
    throw "$Name konnte nicht automatisch installiert werden (Fehlercode $LASTEXITCODE). Installieren Sie $Name und starten Sie die EXE erneut."
  }
}

function Ensure-Command([string]$Name, [string[]]$Candidates, [string]$PackageId, [string]$InstallHint) {
  if (Get-Command $Name -ErrorAction SilentlyContinue) {
    return (Get-Command $Name).Source
  }
  foreach ($candidate in $Candidates) {
    if (Test-Path -LiteralPath $candidate) {
      $candidateDirectory = Split-Path -Parent $candidate
      $env:PATH = "$candidateDirectory;$env:PATH"
      if (Get-Command $Name -ErrorAction SilentlyContinue) {
        return (Get-Command $Name).Source
      }
    }
  }

  Install-Prerequisite $Name $PackageId
  foreach ($candidate in $Candidates) {
    if (Test-Path -LiteralPath $candidate) {
      $candidateDirectory = Split-Path -Parent $candidate
      $env:PATH = "$candidateDirectory;$env:PATH"
      if (Get-Command $Name -ErrorAction SilentlyContinue) {
        return (Get-Command $Name).Source
      }
    }
  }
  throw "${Name} wurde nach der automatischen Installation nicht gefunden. Bitte starten Sie Windows neu und führen Sie die EXE erneut aus. Hilfe: $InstallHint"
}

function Invoke-Checked([string]$Command, [string[]]$Arguments) {
  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$Command wurde mit Fehlercode $LASTEXITCODE beendet."
  }
}

function New-PaperclipShortcut([string]$TargetInstallPath) {
  $desktopPath = [Environment]::GetFolderPath([Environment+SpecialFolder]::DesktopDirectory)
  if ([string]::IsNullOrWhiteSpace($desktopPath)) {
    Write-Warning 'Desktop-Ordner konnte nicht ermittelt werden. Die Verknüpfung wurde nicht erstellt.'
    return
  }
  $startScript = Join-Path $TargetInstallPath 'scripts\start-paperclip-de.ps1'
  if (-not (Test-Path -LiteralPath $startScript)) {
    throw "Startskript fehlt: $startScript"
  }

  $shortcutPath = Join-Path $desktopPath 'Paperclip DE.lnk'
  $powerShellPath = Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe'
  $iconPath = Join-Path $TargetInstallPath 'ui\public\favicon.ico'
  $shell = New-Object -ComObject WScript.Shell
  $shortcut = $shell.CreateShortcut($shortcutPath)
  $shortcut.TargetPath = $powerShellPath
  $shortcut.Arguments = "-NoLogo -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$startScript`""
  $shortcut.WorkingDirectory = $TargetInstallPath
  if (Test-Path -LiteralPath $iconPath) {
    $shortcut.IconLocation = "$iconPath,0"
  }
  $shortcut.Description = 'Paperclip DE starten'
  $shortcut.Save()
  Write-Host "Desktop-Verknüpfung wurde erstellt: $shortcutPath"
}

Write-Host 'Prüfe Voraussetzungen ...'
$gitPath = Ensure-Command 'git' @(
  (Join-Path $env:ProgramFiles 'Git\cmd\git.exe'),
  (Join-Path ${env:ProgramFiles(x86)} 'Git\cmd\git.exe'),
  (Join-Path $env:LOCALAPPDATA 'Programs\Git\cmd\git.exe'),
  (Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Links\git.exe')
) 'Git.Git' 'https://git-scm.com/download/win'
$nodePath = Ensure-Command 'node' @(
  (Join-Path $env:ProgramFiles 'nodejs\node.exe'),
  (Join-Path ${env:ProgramFiles(x86)} 'nodejs\node.exe'),
  (Join-Path $env:LOCALAPPDATA 'Programs\nodejs\node.exe'),
  (Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Links\node.exe')
) 'OpenJS.NodeJS.LTS' 'https://nodejs.org/en/download'
$corepackPath = Ensure-Command 'corepack' @(
  (Join-Path $env:ProgramFiles 'nodejs\corepack.cmd'),
  (Join-Path ${env:ProgramFiles(x86)} 'nodejs\corepack.cmd'),
  (Join-Path $env:LOCALAPPDATA 'Programs\nodejs\corepack.cmd'),
  (Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Links\corepack.cmd')
) 'OpenJS.NodeJS.LTS' 'https://nodejs.org/en/download'
Write-Host "Git: $gitPath"
Write-Host "Node.js: $nodePath"
Invoke-Checked $corepackPath @('enable')

$nodeVersion = (& node --version).Trim().TrimStart('v')
$nodeMajor = [int]($nodeVersion.Split('.')[0])
if ($nodeMajor -lt 24) {
  throw "Node.js $nodeVersion ist zu alt. Paperclip benötigt Node.js 24.11 oder neuer."
}

if (-not (Test-Path (Join-Path $InstallPath '.git'))) {
  Write-Host "Lade die deutsche Version nach $InstallPath ..."
  New-Item -ItemType Directory -Path (Split-Path $InstallPath -Parent) -Force | Out-Null
  Invoke-Checked 'git' @('clone', '--branch', $branch, '--single-branch', $repository, $InstallPath)
} else {
  Write-Host "Aktualisiere die deutsche Version unter $InstallPath ..."
  Invoke-Checked 'git' @('-C', $InstallPath, 'fetch', 'origin', $branch)
  Invoke-Checked 'git' @('-C', $InstallPath, 'checkout', $branch)
  Invoke-Checked 'git' @('-C', $InstallPath, 'reset', '--hard', "origin/$branch")
}

Push-Location $InstallPath
try {
  Write-Host 'Installiere Abhängigkeiten. Dieser Schritt kann mehrere Minuten dauern ...'
  Invoke-Checked 'corepack' @('pnpm@9.15.4', 'install', '--frozen-lockfile')
  Write-Host 'Richte den vorkompilierten Windows-Runner ein ...'
  & (Join-Path $InstallPath 'scripts\download-runner-windows.ps1') -InstallPath $InstallPath -ReleaseTag $releaseTag
  if ($LASTEXITCODE -ne 0) {
    throw "Der vorkompilierte Windows-Runner konnte nicht eingerichtet werden."
  }
  New-PaperclipShortcut $InstallPath
  Write-Host "Paperclip DE wurde unter $InstallPath eingerichtet."
  if ($Start) {
    & corepack pnpm@9.15.4 dev:once
  } else {
    Write-Host 'Zum Starten doppelklicken Sie auf die Desktop-Verknüpfung Paperclip DE.'
  }
} finally {
  Pop-Location
}
