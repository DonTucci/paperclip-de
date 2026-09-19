[CmdletBinding()]
param(
  [string]$InstallPath = (Join-Path $env:LOCALAPPDATA 'Paperclip-DE'),
  [switch]$Start
)

$ErrorActionPreference = 'Stop'
$repository = 'https://github.com/DonTucci/paperclip-de.git'
$branch = 'fork/deutsch'

function Require-Command([string]$Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "$Name wurde nicht gefunden. Bitte zuerst Node.js 24.11 oder neuer und Git installieren."
  }
}

Require-Command 'git'
Require-Command 'node'

$nodeVersion = (& node --version).Trim().TrimStart('v')
$nodeMajor = [int]($nodeVersion.Split('.')[0])
if ($nodeMajor -lt 24) {
  throw "Node.js $nodeVersion ist zu alt. Paperclip benötigt Node.js 24.11 oder neuer."
}

if (-not (Test-Path (Join-Path $InstallPath '.git'))) {
  New-Item -ItemType Directory -Path (Split-Path $InstallPath -Parent) -Force | Out-Null
  & git clone --branch $branch --single-branch $repository $InstallPath
} else {
  & git -C $InstallPath fetch origin $branch
  & git -C $InstallPath checkout $branch
  & git -C $InstallPath reset --hard "origin/$branch"
}

Push-Location $InstallPath
try {
  & corepack pnpm@9.15.4 install --frozen-lockfile
  Write-Host "Paperclip auf Deutsch wurde unter $InstallPath eingerichtet."
  if ($Start) {
    & corepack pnpm@9.15.4 dev:once
  } else {
    Write-Host 'Zum Starten: corepack pnpm@9.15.4 dev:once'
  }
} finally {
  Pop-Location
}
