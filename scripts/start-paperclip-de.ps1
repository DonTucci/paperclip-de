[CmdletBinding()]
param([switch]$Server)

$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$userHome = [Environment]::GetFolderPath('UserProfile')
$paperclipHome = Join-Path $userHome '.paperclip'
$dataDir = Join-Path $paperclipHome 'paperclip-de-data'
$shimDir = Join-Path $paperclipHome 'pnpm-shim'
$corepackHome = Join-Path $paperclipHome 'corepack'
$logDir = Join-Path $env:LOCALAPPDATA 'Paperclip-DE'
$logPath = Join-Path $logDir 'paperclip.log'
$serverUrl = 'http://127.0.0.1:3100'
$runnerBinary = Join-Path $repo 'packages\paperclip-runner\dist\bin\paperclip-runnerd.exe'

$env:COREPACK_HOME = $corepackHome
$env:PATH = "$shimDir;$userHome\.cargo\bin;C:\Program Files\nodejs;$env:PATH"
if (-not (Test-Path -LiteralPath $runnerBinary)) {
  # Übergangslösung für die Oberfläche, bis der native Runner gebaut ist.
  $env:PAPERCLIP_RUNNER_BINARY = Join-Path $env:WINDIR 'System32\cmd.exe'
}

function Test-PaperclipReady {
  try {
    return (Invoke-WebRequest -UseBasicParsing -Uri "$serverUrl/api/health" -TimeoutSec 2).StatusCode -eq 200
  } catch {
    return $false
  }
}

if ($Server) {
  New-Item -ItemType Directory -Path $logDir -Force | Out-Null
  Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format s)] Deutsche Paperclip-Instanz wird gestartet."
  Push-Location $repo
  try {
    & (Join-Path $shimDir 'pnpm.cmd') dev:once -- --data-dir $dataDir *>&1 | Tee-Object -FilePath $logPath -Append
    exit $LASTEXITCODE
  } finally {
    Pop-Location
  }
}

if (-not (Test-PaperclipReady)) {
  $powershell = Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe'
  $arguments = @('-NoLogo', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden', '-File', $PSCommandPath, '-Server')
  Start-Process -FilePath $powershell -ArgumentList $arguments -WindowStyle Hidden | Out-Null
  for ($attempt = 1; $attempt -le 90; $attempt++) {
    Start-Sleep -Seconds 1
    if (Test-PaperclipReady) { break }
  }
}

if (Test-PaperclipReady) {
  Start-Process $serverUrl | Out-Null
} else {
  New-Item -ItemType Directory -Path $logDir -Force | Out-Null
  Start-Process notepad.exe $logPath | Out-Null
}
