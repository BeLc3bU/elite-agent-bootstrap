@echo off
title Inicializador de Proyecto ODD
chcp 65001 >nul
node "%~dp0..\bin\cli.js" init "%CD%"
pause
