<#
BayouOps Patch Readiness
Read-only Windows patch readiness scanner.
#>

param(
    [string]$ComputerList = ".\samples\servers.csv",
    [string]$OutputPath = ".\reports"
)

New-Item -ItemType Directory -Force -Path $OutputPath | Out-Null

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$csvOut = Join-Path $OutputPath "bayouops_patch_readiness_$timestamp.csv"

$servers = Import-Csv $ComputerList

$results = foreach ($server in $servers) {
    $computer = $server.ComputerName

    try {
        $os = Get-CimInstance Win32_OperatingSystem -ComputerName $computer -ErrorAction Stop

        $wua = Get-Service -ComputerName $computer -Name wuauserv -ErrorAction SilentlyContinue
        $bits = Get-Service -ComputerName $computer -Name BITS -ErrorAction SilentlyContinue

        $rebootPending = $false
        $rebootReasons = @()

        $regBase = [Microsoft.Win32.RegistryKey]::OpenRemoteBaseKey('LocalMachine', $computer)

        $cbs = $regBase.OpenSubKey("SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\RebootPending")
        if ($cbs) {
            $rebootPending = $true
            $rebootReasons += "CBS RebootPending"
        }

        $wu = $regBase.OpenSubKey("SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update\RebootRequired")
        if ($wu) {
            $rebootPending = $true
            $rebootReasons += "Windows Update RebootRequired"
        }

        [PSCustomObject]@{
            ComputerName     = $computer
            LOB              = $server.LOB
            OwnerName        = $server.OwnerName
            OwnerEmail       = $server.OwnerEmail
            OwnerPhone       = $server.OwnerPhone
            PatchWave        = $server.PatchWave
            Criticality      = $server.Criticality
            OSName           = $os.Caption
            OSVersion        = $os.Version
            BuildNumber      = $os.BuildNumber
            LastBoot         = $os.LastBootUpTime
            UptimeDays       = [math]::Round(((Get-Date) - $os.LastBootUpTime).TotalDays, 2)
            WindowsUpdateSvc = if ($wua) { $wua.Status } else { "Not Found" }
            BITSService      = if ($bits) { $bits.Status } else { "Not Found" }
            RebootPending    = $rebootPending
            RebootReason     = ($rebootReasons -join "; ")
            ScanStatus       = "Success"
            Error            = ""
        }
    }
    catch {
        [PSCustomObject]@{
            ComputerName     = $computer
            LOB              = $server.LOB
            OwnerName        = $server.OwnerName
            OwnerEmail       = $server.OwnerEmail
            OwnerPhone       = $server.OwnerPhone
            PatchWave        = $server.PatchWave
            Criticality      = $server.Criticality
            OSName           = ""
            OSVersion        = ""
            BuildNumber      = ""
            LastBoot         = ""
            UptimeDays       = ""
            WindowsUpdateSvc = ""
            BITSService      = ""
            RebootPending    = ""
            RebootReason     = ""
            ScanStatus       = "Failed"
            Error            = $_.Exception.Message
        }
    }
}

$results | Export-Csv $csvOut -NoTypeInformation

Write-Host ""
Write-Host "BayouOps Patch Readiness scan complete."
Write-Host "Report saved to: $csvOut"
Write-Host ""
