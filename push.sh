#!/bin/bash

# Type './push.sh' to push with a default commit message
# Type './push.sh "custom message"' to push with a custom message

if [ -z "$1" ]; then
    git add .
    git commit -m "I probably fixed something I dunno"
else
    git add .
    git commit -m "$1"
fi

git push origin master:main
if [ $? -ne 0 ]; then
    echo
    echo "[!] Normal push failed. Attempting force push..."
    git push --force origin master:main
fi