#!/bin/bash

# Remove the in-memory database
rm -rf ./.db

# Change content of a file in ./src folder in order to re-compile the project
echo "// OK!" > ./src/test.ts