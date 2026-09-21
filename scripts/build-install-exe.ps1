[CmdletBinding()]
param(
  [string]$Version = 'de-v2026.916.5',
  [string]$OutputDirectory = (Join-Path $PSScriptRoot '..\releases\windows')
)

$ErrorActionPreference = 'Stop'

$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$windowsPowerShell = Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe'
$templatePath = Join-Path $repositoryRoot 'installer\PaperclipDeSetup.cs'
$scriptPath = Join-Path $repositoryRoot 'install-de.ps1'
$runnerPath = Join-Path $repositoryRoot 'packages\paperclip-runner\dist\bin\paperclip-runnerd.exe'
$outputDirectoryPath = (Resolve-Path (New-Item -ItemType Directory -Path $OutputDirectory -Force)).Path
$outputPath = Join-Path $outputDirectoryPath ("Paperclip-DE-Setup-$Version.exe")
$temporaryDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ("paperclip-de-build-" + [guid]::NewGuid().ToString('N'))
$sourcePath = Join-Path $temporaryDirectory 'PaperclipDeSetup.cs'
$compileScriptPath = Join-Path $temporaryDirectory 'compile.ps1'

if (-not (Test-Path $windowsPowerShell)) {
  throw 'Windows PowerShell 5.1 wurde nicht gefunden.'
}
if (-not (Test-Path $runnerPath)) {
  throw "Der Windows-Runner fehlt: $runnerPath. Bauen Sie zuerst @paperclipai/paperclip-runner."
}

New-Item -ItemType Directory -Path $temporaryDirectory -Force | Out-Null
try {
  $installScript = (Get-Content -LiteralPath $scriptPath -Raw).Replace("'__RELEASE_TAG__'", "'$Version'")
  $scriptBase64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($installScript))
  $source = (Get-Content -LiteralPath $templatePath -Raw).Replace('__SCRIPT_BASE64__', $scriptBase64)
  Set-Content -LiteralPath $sourcePath -Value $source -Encoding UTF8

  @'
param([string]$SourcePath, [string]$OutputPath, [string]$RunnerPath)
$compilerCandidates = @(
  (Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'),
  (Join-Path $env:WINDIR 'Microsoft.NET\Framework\v4.0.30319\csc.exe')
)
$compiler = $compilerCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $compiler) { throw 'Der Windows-C#-Compiler wurde nicht gefunden.' }
& $compiler /nologo /target:winexe "/out:$OutputPath" /r:System.Windows.Forms.dll /r:System.Drawing.dll "/resource:$RunnerPath,PaperclipDeSetup.paperclip-runnerd.exe" $SourcePath
exit $LASTEXITCODE
'@ | Set-Content -LiteralPath $compileScriptPath -Encoding UTF8

  if (Test-Path $outputPath) { Remove-Item -LiteralPath $outputPath -Force }
  & $windowsPowerShell -NoLogo -NoProfile -ExecutionPolicy Bypass -File $compileScriptPath -SourcePath $sourcePath -OutputPath $outputPath -RunnerPath $runnerPath
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path $outputPath)) {
    throw "Die EXE konnte nicht gebaut werden (Exitcode $LASTEXITCODE)."
  }

  Write-Output $outputPath
} finally {
  Remove-Item -LiteralPath $temporaryDirectory -Recurse -Force -ErrorAction SilentlyContinue
}
