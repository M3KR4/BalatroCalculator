#!/bin/bash

# Compile TypeScript
npx tsc
if [ $? -ne 0 ]; then
    echo "[!] TypeScript compilation failed."
    exit 1
fi

# Run compiled JS
node web/script/cards.js