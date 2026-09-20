[CmdletBinding()]
param(
  [string]$Version = 'de-v2026.916.3',
  [string]$OutputDirectory = (Join-Path $PSScriptRoot '..\releases\windows')
)

$ErrorActionPreference = 'Stop'

$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$windowsPowerShell = Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe'
$templatePath = Join-Path $repositoryRoot 'installer\PaperclipDeSetup.cs'
$scriptPath = Join-Path $repositoryRoot 'install-de.ps1'
$outputDirectoryPath = (Resolve-Path (New-Item -ItemType Directory -Path $OutputDirectory -Force)).Path
$outputPath = Join-Path $outputDirectoryPath ("Paperclip-DE-Setup-$Version.exe")
$temporaryDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ("paperclip-de-build-" + [guid]::NewGuid().ToString('N'))
$sourcePath = Join-Path $temporaryDirectory 'PaperclipDeSetup.cs'
$compileScriptPath = Join-Path $temporaryDirectory 'compile.ps1'

if (-not (Test-Path $windowsPowerShell)) {
  throw 'Windows PowerShell 5.1 wurde nicht gefunden.'
}

New-Item -ItemType Directory -Path $temporaryDirectory -Force | Out-Null
try {
  $scriptBase64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes((Get-Content -LiteralPath $scriptPath -Raw)))
  $source = (Get-Content -LiteralPath $templatePath -Raw).Replace('__SCRIPT_BASE64__', $scriptBase64)
  Set-Content -LiteralPath $sourcePath -Value $source -Encoding UTF8

  @'
param([string]$SourcePath, [string]$OutputPath)
Add-Type -Path $SourcePath -OutputType ConsoleApplication -OutputAssembly $OutputPath
'@ | Set-Content -LiteralPath $compileScriptPath -Encoding UTF8

  if (Test-Path $outputPath) { Remove-Item -LiteralPath $outputPath -Force }
  & $windowsPowerShell -NoLogo -NoProfile -ExecutionPolicy Bypass -File $compileScriptPath -SourcePath $sourcePath -OutputPath $outputPath
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path $outputPath)) {
    throw "Die EXE konnte nicht gebaut werden (Exitcode $LASTEXITCODE)."
  }

  Write-Output $outputPath
} finally {
  Remove-Item -LiteralPath $temporaryDirectory -Recurse -Force -ErrorAction SilentlyContinue
}
