param(
  [int]$Port = 5500
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$prefix = "http://localhost:$Port/"

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

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
  $listener.Start()
} catch {
  Write-Host "Nao foi possivel abrir $prefix. Tenta outro porto, por exemplo:" -ForegroundColor Red
  Write-Host ".\serve-local.ps1 -Port 8080" -ForegroundColor Yellow
  throw
}

Write-Host "Servidor ativo em $prefix" -ForegroundColor Green
Write-Host "Admin: $prefix" + "admin.html" -ForegroundColor Cyan
Write-Host "Para parar: Ctrl + C" -ForegroundColor Yellow

while ($listener.IsListening) {
  try {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $rawPath = [System.Web.HttpUtility]::UrlDecode($request.Url.AbsolutePath.TrimStart('/'))
    if ([string]::IsNullOrWhiteSpace($rawPath)) { $rawPath = "index.html" }

    $safeRelative = $rawPath.Replace('/', [IO.Path]::DirectorySeparatorChar)
    $fullPath = Join-Path $root $safeRelative

    if (-not $fullPath.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
      $response.StatusCode = 403
      $bytes = [Text.Encoding]::UTF8.GetBytes("Forbidden")
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
      $response.Close()
      continue
    }

    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
      $response.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes("Not Found")
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
      $response.Close()
      continue
    }

    $contentType = Get-ContentType $fullPath
    $response.ContentType = $contentType
    $bytes = [IO.File]::ReadAllBytes($fullPath)
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
    $response.Close()
  } catch {
    if ($listener.IsListening) {
      Write-Host "Erro no request: $($_.Exception.Message)" -ForegroundColor Red
    }
  }
}

$listener.Stop()
$listener.Close()
