@echo off
setlocal
powershell -ExecutionPolicy Bypass -File "%~dp0serve-local.ps1" %*
