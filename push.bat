@echo off

:: Type 'push' to push into github with deafult commit name
:: Type 'push "custom commit name"' to push into github with custom commit name

if "%~1"=="" (
    git add .
    git commit -m "I probably fixed something I dunno"
    git push origin master:main
) else (
    git add .
    git commit -m %1
    git push origin master:main
)