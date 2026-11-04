param(
    [string]$TargetDir = (Get-Location).Path
)
$cliPath = Join-Path $PSScriptRoot "..\bin\cli.js"
& node $cliPath init $TargetDir
