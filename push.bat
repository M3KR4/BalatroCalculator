@echo off
setlocal

:: Type 'push' to push into GitHub with default commit message
:: Type 'push "custom commit message"' to push into GitHub with custom commit message

if "%~1"=="" (
    git add .
    git commit -m "I probably fixed something I dunno"
) else (
    git add .
    git commit -m %1
)

git push origin master:main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Normal push failed. Attempting force push...
    git push --force origin master:main
)

endlocal