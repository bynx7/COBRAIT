param(
  [int]$WebPort = 5500,
  [int]$ApiPort = 4000,
  [switch]$SkipFirewall
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Get-LocalIpv4Addresses() {
  [Net.Dns]::GetHostAddresses([Net.Dns]::GetHostName()) |
    Where-Object {
      $_.AddressFamily -eq [Net.Sockets.AddressFamily]::InterNetwork -and
      -not [Net.IPAddress]::IsLoopback($_) -and
      -not $_.ToString().StartsWith("169.254.")
    } |
    Select-Object -ExpandProperty IPAddressToString -Unique
}

function Get-ListeningProcessIds([int]$port) {
  try {
    return @(
      Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction Stop |
        Select-Object -ExpandProperty OwningProcess -Unique
    )
  } catch {
    return @()
  }
}

function Ensure-FirewallRule([string]$name, [int]$port) {
  $existing = Get-NetFirewallRule -DisplayName $name -ErrorAction SilentlyContinue
  if ($existing) {
    return
  }

  New-NetFirewallRule `
    -DisplayName $name `
    -Direction Inbound `
    -Protocol TCP `
    -LocalPort $port `
    -Action Allow | Out-Null
}

function Test-PortListening([int]$port) {
  try {
    return [bool](Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction Stop | Select-Object -First 1)
  } catch {
    return $false
  }
}

function Test-ApiHealth([string]$url) {
  try {
    $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 3 -ErrorAction Stop
    return ($response.ok -eq $true -and $response.service -eq "cobrait-admin-api")
  } catch {
    return $false
  }
}

function Restart-ApiInNetworkMode([int]$port) {
  $processIds = Get-ListeningProcessIds -port $port
  foreach ($processId in $processIds) {
    try {
      Stop-Process -Id $processId -Force -ErrorAction Stop
    } catch {
      Write-Warning "Nao foi possivel parar o processo $processId que estava a usar a porta $port."
    }
  }

  Start-Sleep -Milliseconds 800

  Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "set API_HOST=0.0.0.0 && set PORT=$port && cd /d `"$root\server`" && npm.cmd start" | Out-Null
}

$ips = Get-LocalIpv4Addresses

if (-not $SkipFirewall) {
  try {
    Ensure-FirewallRule -name "COBRAIT Web $WebPort" -port $WebPort
    Ensure-FirewallRule -name "COBRAIT API $ApiPort" -port $ApiPort
  } catch {
    Write-Warning "Nao foi possivel criar regras no Firewall automaticamente. Se necessario, abre manualmente as portas $WebPort e $ApiPort."
  }
}

$apiNeedsStart = -not (Test-PortListening -port $ApiPort)
$apiNeedsRestartForLan = $false

if (-not $apiNeedsStart) {
  $localhostHealth = Test-ApiHealth -url "http://localhost:$ApiPort/api/health"
  $lanHealth = $false

  foreach ($ip in $ips) {
    if (Test-ApiHealth -url "http://$ip`:$ApiPort/api/health") {
      $lanHealth = $true
      break
    }
  }

  if ($localhostHealth -and -not $lanHealth) {
    $apiNeedsRestartForLan = $true
    Write-Host "API encontrada apenas em localhost. A reiniciar em modo rede..." -ForegroundColor Yellow
  } elseif ($lanHealth) {
    Write-Host "API ja esta acessivel na rede local na porta $ApiPort." -ForegroundColor Yellow
  } else {
    Write-Warning "Ja existe algo a ouvir na porta $ApiPort, mas nao foi possivel confirmar a API da COBRAIT."
  }
}

if ($apiNeedsStart -or $apiNeedsRestartForLan) {
  Restart-ApiInNetworkMode -port $ApiPort
} else {
  Write-Host "API ja estava a ouvir na porta $ApiPort." -ForegroundColor Yellow
}

if (-not (Test-PortListening -port $WebPort)) {
  Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$root\serve-local.ps1`"", "-Port", "$WebPort", "-BindAddress", "0.0.0.0" | Out-Null
} else {
  Write-Host "Web ja estava a ouvir na porta $WebPort." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "COBRAIT em network mode" -ForegroundColor Green
Write-Host ""
Write-Host "Local:" -ForegroundColor Yellow
Write-Host "  Site  : http://localhost:$WebPort/" -ForegroundColor Cyan
Write-Host "  Admin : http://localhost:$WebPort/admin.html" -ForegroundColor Cyan
Write-Host "  API   : http://localhost:$ApiPort/api/health" -ForegroundColor Cyan

if ($ips) {
  Write-Host ""
  Write-Host "Rede local:" -ForegroundColor Yellow
  foreach ($ip in $ips) {
    Write-Host "  Site  : http://$ip`:$WebPort/" -ForegroundColor Cyan
    Write-Host "  Admin : http://$ip`:$WebPort/admin.html" -ForegroundColor Cyan
    Write-Host "  API   : http://$ip`:$ApiPort/api/health" -ForegroundColor Cyan
  }
}

Write-Host ""
Write-Host "No outro computador basta abrir o browser. Nao precisa instalar nada." -ForegroundColor Green
