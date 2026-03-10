# start.ps1 — Starts the full Conference Booking app via Docker Compose
# Prerequisites: Docker Desktop installed and running
# Run from the project root:  .\start.ps1

$root = $PSScriptRoot

# ── 1. Check Docker is available ──────────────────────────────────────────────
Write-Host "`n[1/3] Checking Docker..." -ForegroundColor Cyan

$dockerOk = $null -ne (Get-Command docker -ErrorAction SilentlyContinue)
if (-not $dockerOk) {
    Write-Host ""
    Write-Host "  ERROR: Docker not found." -ForegroundColor Red
    Write-Host "  Install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Write-Host "  After installing, restart this machine and re-run this script." -ForegroundColor Yellow
    Read-Host "`nPress Enter to exit"
    exit 1
}

# Check Docker daemon is actually running
try {
    docker info 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw }
    Write-Host "  Docker Desktop is running." -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "  ERROR: Docker is installed but not running." -ForegroundColor Red
    Write-Host "  Start Docker Desktop from the Start Menu, wait for it to fully load, then re-run this script." -ForegroundColor Yellow
    Read-Host "`nPress Enter to exit"
    exit 1
}

# ── 2. Start PostgreSQL + API via Docker Compose ──────────────────────────────
Write-Host "`n[2/3] Starting PostgreSQL + API (docker compose up)..." -ForegroundColor Cyan
Write-Host "      First run will build the API image — this takes ~1-2 minutes." -ForegroundColor Gray

Set-Location $root
docker compose up --build -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: docker compose failed. Check the output above." -ForegroundColor Red
    Read-Host "`nPress Enter to exit"
    exit 1
}

# Wait for the API health endpoint
Write-Host "      Waiting for API to be ready..." -ForegroundColor Gray
$ready = $false
for ($i = 0; $i -lt 60; $i++) {
    Start-Sleep -Seconds 2
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:5230/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($r.StatusCode -lt 400) { $ready = $true; break }
    } catch {}
}

if ($ready) {
    Write-Host "  API ready at http://localhost:5230" -ForegroundColor Green
} else {
    Write-Host "  API did not respond in 120s. Run 'docker compose logs api' to diagnose." -ForegroundColor Yellow
}

# ── 3. Start the React Frontend ───────────────────────────────────────────────
Write-Host "`n[3/3] Starting React Frontend..." -ForegroundColor Cyan

$nodeOk = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
if (-not $nodeOk) {
    Write-Host "  ERROR: Node.js not found." -ForegroundColor Red
    Write-Host "  Install from: https://nodejs.org" -ForegroundColor Yellow
    Read-Host "`nPress Enter to exit"; exit 1
}

if (-not (Test-Path "$root\ConferenceBookingClient\node_modules")) {
    Write-Host "  Installing frontend dependencies (first run only)..." -ForegroundColor Gray
    Push-Location "$root\ConferenceBookingClient"
    npm install --silent
    Pop-Location
}

$frontendProc = Start-Process -FilePath "cmd" `
    -ArgumentList "/c npm run dev" `
    -WorkingDirectory "$root\ConferenceBookingClient" `
    -PassThru `
    -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "─────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host "  App is running!" -ForegroundColor Green
Write-Host "  Frontend  : http://localhost:5173"
Write-Host "  API       : http://localhost:5230/api"
Write-Host "  Login     : admin@domain.com / Admin123!"
Write-Host ""
Write-Host "  To stop the backend containers:"
Write-Host "    docker compose down"
Write-Host "─────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""
