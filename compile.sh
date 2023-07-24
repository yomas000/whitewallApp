#!/bin/bash

npm install

echo "\n"
echo "Setting Icon"
npx react-native set-icon --path  ../$1
echo "Icon Set"

cd android
chmod +x gradlew

./gradlew bundleRelease

cp app/build/outputs/bundle/release/app-release.aab ../../app-release.aab