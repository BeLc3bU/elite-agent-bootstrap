param(
    [Parameter(Mandatory=$false)]
    [string]$TargetDir = (Get-Location).Path,

    [Parameter(Mandatory=$false)]
    [ValidateSet("Auto", "Existing", "New")]
    [string]$Mode = "Auto",

    [Parameter(Mandatory=$false)]
    [switch]$Force,

    [Parameter(Mandatory=$false)]
    [switch]$NoBackup
)

$cliPath = Join-Path $PSScriptRoot "..\bin\cli.js"
$argsList = @("init", $TargetDir, "--mode", $Mode.ToLower())
if ($Force) { $argsList += "--force" }
if ($NoBackup) { $argsList += "--no-backup" }

& node $cliPath @argsList
