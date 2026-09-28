@echo off
title Instalador Universal Antigravity SDD
chcp 65001 >nul

echo ==========================================================
echo    Instalando Entorno SDD en este ordenador...
echo ==========================================================

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-sdd.ps1"

echo.
pause
