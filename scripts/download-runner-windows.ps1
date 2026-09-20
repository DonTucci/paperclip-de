[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$InstallPath,
  [string]$ReleaseTag = '',
  [string]$Repository = 'DonTucci/paperclip-de'
)

$ErrorActionPreference = 'Stop'
$assetName = 'paperclip-runnerd-windows-x64.exe'
$runnerDirectory = Join-Path $InstallPath 'packages\paperclip-runner\dist\bin'
$runnerPath = Join-Path $runnerDirectory 'paperclip-runnerd.exe'
$headers = @{ 'User-Agent' = 'paperclip-de-installer' }

if ([string]::IsNullOrWhiteSpace($ReleaseTag)) {
  $releaseUri = "https://api.github.com/repos/$Repository/releases/latest"
} else {
  $releaseUri = "https://api.github.com/repos/$Repository/releases/tags/$([uri]::EscapeDataString($ReleaseTag))"
}

Write-Host 'Suche eine vorkompilierte Windows-Version des nativen Runners ...'
try {
  $release = Invoke-RestMethod -Uri $releaseUri -Headers $headers -TimeoutSec 30
} catch {
  throw "Die GitHub-Veröffentlichung konnte nicht gelesen werden. Prüfen Sie Ihre Internetverbindung und ob die Veröffentlichung $ReleaseTag existiert. Details: $($_.Exception.Message)"
}

$asset = @($release.assets) | Where-Object { $_.name -eq $assetName } | Select-Object -First 1
if (-not $asset) {
  $selectedTag = if ($release.tag_name) { $release.tag_name } else { $ReleaseTag }
  throw "Die Veröffentlichung $selectedTag enthält noch keine Datei $assetName. Bitte verwenden Sie eine neuere Version."
}

New-Item -ItemType Directory -Path $runnerDirectory -Force | Out-Null
$temporaryPath = "$runnerPath.download"
try {
  Invoke-WebRequest -Uri $asset.browser_download_url -Headers $headers -OutFile $temporaryPath -TimeoutSec 300
  $file = Get-Item -LiteralPath $temporaryPath
  if ($file.Length -lt 1MB) {
    throw "Die heruntergeladene Runner-Datei ist unerwartet klein ($($file.Length) Bytes)."
  }
  Move-Item -LiteralPath $temporaryPath -Destination $runnerPath -Force
} finally {
  Remove-Item -LiteralPath $temporaryPath -Force -ErrorAction SilentlyContinue
}

Write-Host "Vorkompilierter Runner $($release.tag_name) wurde eingerichtet."
Write-Output $runnerPath
