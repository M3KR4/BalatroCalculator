@echo off
chcp 65001 > nul

echo Compiling TypeScript...
npx tsc

echo Running JS...
node web\index.js

pause