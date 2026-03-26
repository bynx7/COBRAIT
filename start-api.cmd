@echo off
setlocal
cd /d "%~dp0server"
call npm.cmd start
