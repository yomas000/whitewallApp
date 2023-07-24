#!/bin/bash

npm install

npx react-native set-icon --path  ../$1

echo "Icon Set"

chmod +x android/gradlew

./android/gradlew bundleRelease

cp app/build/output/bundle/release/app-release.aab ../app-release.aab