# diagnostico.ps1
Write-Host "=== DIAGNÓSTICO COMPLETO SQL SERVER + DOCKER ===" -ForegroundColor Green
Write-Host ""

# 1. Verificar servicios SQL Server
Write-Host "1. Verificando servicios SQL Server..." -ForegroundColor Yellow
$sqlService = Get-Service -Name "MSSQLSERVER" -ErrorAction SilentlyContinue
if ($sqlService) {
    Write-Host "   SQL Server: $($sqlService.Status)" -ForegroundColor $(if($sqlService.Status -eq "Running"){"Green"}else{"Red"})
} else {
    Write-Host "   SQL Server: NO ENCONTRADO" -ForegroundColor Red
}

$browserService = Get-Service -Name "SQLBrowser" -ErrorAction SilentlyContinue
if ($browserService) {
    Write-Host "   SQL Browser: $($browserService.Status)" -ForegroundColor $(if($browserService.Status -eq "Running"){"Green"}else{"Red"})
} else {
    Write-Host "   SQL Browser: NO ENCONTRADO" -ForegroundColor Red
}
Write-Host ""

# 2. Verificar puerto 1433
Write-Host "2. Verificando puerto 1433..." -ForegroundColor Yellow
$port1433 = Test-NetConnection -ComputerName localhost -Port 1433 -WarningAction SilentlyContinue
if ($port1433.TcpTestSucceeded) {
    Write-Host "   Puerto 1433: ABIERTO" -ForegroundColor Green
} else {
    Write-Host "   Puerto 1433: CERRADO" -ForegroundColor Red
}
Write-Host ""

# 3. Verificar reglas de firewall
Write-Host "3. Verificando reglas de firewall..." -ForegroundColor Yellow
$firewallRules = Get-NetFirewallRule -DisplayName "*SQL*" -ErrorAction SilentlyContinue | Where-Object {$_.Enabled -eq $true}
if ($firewallRules) {
    Write-Host "   Reglas activas encontradas:" -ForegroundColor Green
    $firewallRules | ForEach-Object {
        Write-Host "   - $($_.DisplayName)" -ForegroundColor Cyan
    }
} else {
    Write-Host "   NO hay reglas de firewall para SQL Server" -ForegroundColor Red
}
Write-Host ""

# 4. Verificar IP de la máquina
Write-Host "4. IPs de la máquina:" -ForegroundColor Yellow
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*"} | ForEach-Object {
    Write-Host "   $($_.InterfaceAlias): $($_.IPAddress)" -ForegroundColor Cyan
}
Write-Host ""

# 5. Verificar contenedores Docker
Write-Host "5. Verificando contenedores Docker..." -ForegroundColor Yellow
$containers = docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>$null
if ($containers) {
    Write-Host $containers
} else {
    Write-Host "   No hay contenedores corriendo" -ForegroundColor Red
}
Write-Host ""

# 6. Verificar archivo .env
Write-Host "6. Verificando archivo .env..." -ForegroundColor Yellow
$envFile = ".\api-laravel-ilca\.env"
if (Test-Path $envFile) {
    Write-Host "   Archivo .env encontrado" -ForegroundColor Green
    $dbHost = Select-String -Path $envFile -Pattern "^DB_HOST=" | Select-Object -First 1
    $dbPort = Select-String -Path $envFile -Pattern "^DB_PORT=" | Select-Object -First 1
    $dbDatabase = Select-String -Path $envFile -Pattern "^DB_DATABASE=" | Select-Object -First 1
    $dbUsername = Select-String -Path $envFile -Pattern "^DB_USERNAME=" | Select-Object -First 1
    
    Write-Host "   $dbHost" -ForegroundColor Cyan
    Write-Host "   $dbPort" -ForegroundColor Cyan
    Write-Host "   $dbDatabase" -ForegroundColor Cyan
    Write-Host "   $dbUsername" -ForegroundColor Cyan
} else {
    Write-Host "   Archivo .env NO encontrado" -ForegroundColor Red
}
Write-Host ""

# 7. Recomendaciones
Write-Host "=== RECOMENDACIONES ===" -ForegroundColor Green
Write-Host ""

if ($sqlService.Status -ne "Running") {
    Write-Host "❌ Inicia el servicio SQL Server" -ForegroundColor Red
}

if (-not $port1433.TcpTestSucceeded) {
    Write-Host "❌ El puerto 1433 no está accesible. Ejecuta:" -ForegroundColor Red
    Write-Host "   New-NetFirewallRule -DisplayName 'SQL Server' -Direction Inbound -Protocol TCP -LocalPort 1433 -Action Allow" -ForegroundColor Yellow
}

if (-not $firewallRules) {
    Write-Host "❌ No hay reglas de firewall. Ejecuta:" -ForegroundColor Red
    Write-Host "   New-NetFirewallRule -DisplayName 'SQL Server' -Direction Inbound -Protocol TCP -LocalPort 1433 -Action Allow" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== FIN DEL DIAGNÓSTICO ===" -ForegroundColor Green