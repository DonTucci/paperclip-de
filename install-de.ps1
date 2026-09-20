[CmdletBinding()]
param(
  [string]$InstallPath = (Join-Path $env:LOCALAPPDATA 'Paperclip-DE'),
  [switch]$Start
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

function Ensure-Command([string]$Name, [string[]]$Candidates, [string]$InstallHint) {
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
  throw "${Name} wurde nicht gefunden. Bitte installieren Sie ${Name}: $InstallHint"
}

function Invoke-Checked([string]$Command, [string[]]$Arguments) {
  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$Command wurde mit Fehlercode $LASTEXITCODE beendet."
  }
}

Write-Host 'Prüfe Voraussetzungen ...'
$gitPath = Ensure-Command 'git' @(
  (Join-Path $env:ProgramFiles 'Git\cmd\git.exe'),
  (Join-Path ${env:ProgramFiles(x86)} 'Git\cmd\git.exe'),
  (Join-Path $env:LOCALAPPDATA 'Programs\Git\cmd\git.exe')
) 'https://git-scm.com/download/win'
$nodePath = Ensure-Command 'node' @(
  (Join-Path $env:ProgramFiles 'nodejs\node.exe'),
  (Join-Path ${env:ProgramFiles(x86)} 'nodejs\node.exe'),
  (Join-Path $env:LOCALAPPDATA 'Programs\nodejs\node.exe')
) 'https://nodejs.org/en/download'
Ensure-Command 'corepack' @(
  (Join-Path $env:ProgramFiles 'nodejs\corepack.cmd'),
  (Join-Path ${env:ProgramFiles(x86)} 'nodejs\corepack.cmd'),
  (Join-Path $env:LOCALAPPDATA 'Programs\nodejs\corepack.cmd')
) 'https://nodejs.org/en/download' | Out-Null
Write-Host "Git: $gitPath"
Write-Host "Node.js: $nodePath"

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
  Write-Host "Paperclip DE wurde unter $InstallPath eingerichtet."
  if ($Start) {
    & corepack pnpm@9.15.4 dev:once
  } else {
    Write-Host 'Zum Starten: corepack pnpm@9.15.4 dev:once'
  }
} finally {
  Pop-Location
}
