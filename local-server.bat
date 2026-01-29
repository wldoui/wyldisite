@echo off

REM Для запуска локального сервера сайта
REM Используется Node.js и http-server

REM Полное обновление сайта CTRL + F5
start "" "http://127.0.0.1:8080"
npx http-server -c-1