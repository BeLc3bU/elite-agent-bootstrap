@echo off
title Inicializador de Proyecto SDD
chcp 65001 >nul
node "%~dp0..\bin\cli.js" init "%CD%"
pause
