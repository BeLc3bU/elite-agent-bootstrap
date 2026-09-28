@echo off
title Inicializador de Proyecto SDD
chcp 65001 >nul

echo ==========================================================
echo    Inicializando Estructura SDD en el Proyecto Actual...
echo ==========================================================

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0init-project-sdd.ps1" "%CD%"

echo.
pause
