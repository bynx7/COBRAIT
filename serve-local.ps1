param(
  [int]$Port = 5500,
  [string]$BindAddress = "0.0.0.0"
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Add-Type -AssemblyName System.Web

function Get-ContentType($path) {
  switch ([IO.Path]::GetExtension($path).ToLowerInvariant()) {
    ".html" { "text/html; charset=utf-8" }
    ".css"  { "text/css; charset=utf-8" }
    ".js"   { "application/javascript; charset=utf-8" }
    ".json" { "application/json; charset=utf-8" }
    ".png"  { "image/png" }
    ".jpg"  { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    ".gif"  { "image/gif" }
    ".svg"  { "image/svg+xml" }
    ".ico"  { "image/x-icon" }
    ".webmanifest" { "application/manifest+json; charset=utf-8" }
    default { "application/octet-stream" }
  }
}

function Get-LocalIpv4Addresses() {
  [Net.Dns]::GetHostAddresses([Net.Dns]::GetHostName()) |
    Where-Object {
      $_.AddressFamily -eq [Net.Sockets.AddressFamily]::InterNetwork -and
      -not [Net.IPAddress]::IsLoopback($_) -and
      -not $_.ToString().StartsWith("169.254.")
    } |
    Select-Object -ExpandProperty IPAddressToString -Unique
}

function Send-Response($stream, $statusCode, $statusText, $contentType, $bytes, $headOnly) {
  $headers = @(
    "HTTP/1.1 $statusCode $statusText",
    "Content-Type: $contentType",
    "Content-Length: $($bytes.Length)",
    "Connection: close",
    ""
    ""
  ) -join "`r`n"

  $headerBytes = [Text.Encoding]::ASCII.GetBytes($headers)
  $stream.Write($headerBytes, 0, $headerBytes.Length)

  if (-not $headOnly -and $bytes.Length -gt 0) {
    $stream.Write($bytes, 0, $bytes.Length)
  }
}

function Send-TextResponse($stream, $statusCode, $statusText, $message, $headOnly) {
  $bytes = [Text.Encoding]::UTF8.GetBytes($message)
  Send-Response $stream $statusCode $statusText "text/plain; charset=utf-8" $bytes $headOnly
}

try {
  if ($BindAddress -eq "0.0.0.0" -or $BindAddress -eq "*") {
    $ipAddress = [Net.IPAddress]::Any
  } else {
    $ipAddress = [Net.IPAddress]::Parse($BindAddress)
  }

  $listener = [Net.Sockets.TcpListener]::new($ipAddress, $Port)
  $listener.Start()
} catch {
  Write-Host ("Nao foi possivel abrir o servidor em {0}:{1}." -f $BindAddress, $Port) -ForegroundColor Red
  Write-Host "Tenta outro porto, por exemplo:" -ForegroundColor Yellow
  Write-Host ".\serve-local.ps1 -Port 8080 -BindAddress 0.0.0.0" -ForegroundColor Cyan
  throw
}

$localUrl = "http://localhost:$Port/"
$lanAddresses = Get-LocalIpv4Addresses

Write-Host "Servidor ativo em $localUrl" -ForegroundColor Green
if ($BindAddress -eq "0.0.0.0" -or $BindAddress -eq "*") {
  foreach ($address in $lanAddresses) {
    Write-Host ("Rede local: http://{0}:{1}/" -f $address, $Port) -ForegroundColor Cyan
  }
} else {
  Write-Host ("Host: http://{0}:{1}/" -f $BindAddress, $Port) -ForegroundColor Cyan
}
Write-Host ("Admin: {0}admin.html" -f $localUrl) -ForegroundColor Yellow
Write-Host "Para parar: Ctrl + C" -ForegroundColor Yellow

while ($true) {
  $client = $null
  $stream = $null

  try {
    $client = $listener.AcceptTcpClient()
    $client.ReceiveTimeout = 5000
    $client.SendTimeout = 5000
    $stream = $client.GetStream()
    $reader = New-Object IO.StreamReader($stream, [Text.Encoding]::ASCII, $false, 8192, $true)

    $requestLine = $reader.ReadLine()
    if ([string]::IsNullOrWhiteSpace($requestLine)) {
      continue
    }

    $parts = $requestLine.Split(" ")
    if ($parts.Length -lt 2) {
      Send-TextResponse $stream 400 "Bad Request" "Bad Request" $false
      continue
    }

    $method = $parts[0].ToUpperInvariant()
    $target = $parts[1]
    $headOnly = $method -eq "HEAD"

    while ($true) {
      $headerLine = $reader.ReadLine()
      if ($null -eq $headerLine -or $headerLine -eq "") {
        break
      }
    }

    if ($method -ne "GET" -and -not $headOnly) {
      Send-TextResponse $stream 405 "Method Not Allowed" "Method Not Allowed" $headOnly
      continue
    }

    $requestUri = [Uri]::new("http://localhost$target")
    $rawPath = [System.Web.HttpUtility]::UrlDecode($requestUri.AbsolutePath.TrimStart('/'))
    if ([string]::IsNullOrWhiteSpace($rawPath)) {
      $rawPath = "index.html"
    }

    $safeRelative = $rawPath.Replace('/', [IO.Path]::DirectorySeparatorChar)
    $fullPath = [IO.Path]::GetFullPath((Join-Path $root $safeRelative))

    if (-not $fullPath.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
      Send-TextResponse $stream 403 "Forbidden" "Forbidden" $headOnly
      continue
    }

    if ((Test-Path -LiteralPath $fullPath -PathType Container)) {
      $fullPath = Join-Path $fullPath "index.html"
    }

    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
      Send-TextResponse $stream 404 "Not Found" "Not Found" $headOnly
      continue
    }

    $bytes = [IO.File]::ReadAllBytes($fullPath)
    Send-Response $stream 200 "OK" (Get-ContentType $fullPath) $bytes $headOnly
  } catch {
    if ($stream) {
      try {
        Send-TextResponse $stream 500 "Internal Server Error" "Internal Server Error" $false
      } catch {}
    }
    Write-Host "Erro no request: $($_.Exception.Message)" -ForegroundColor Red
  } finally {
    if ($stream) { $stream.Dispose() }
    if ($client) { $client.Close() }
  }
}
