@echo off
setlocal

start "COBRAIT API" cmd /k "cd /d ""%~dp0server"" && npm.cmd start"
start "COBRAIT Web" powershell -NoExit -ExecutionPolicy Bypass -File "%~dp0serve-local.ps1"

echo COBRAIT API: http://localhost:4000/api/health
echo COBRAIT Web: http://localhost:5500/
echo Admin: http://localhost:5500/admin.html
