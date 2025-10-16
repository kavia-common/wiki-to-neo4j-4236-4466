#!/bin/bash
cd /home/kavia/workspace/code-generation/wiki-to-neo4j-4236-4466/FrontendWebApplication
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

