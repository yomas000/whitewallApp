#!/bin/bash

npm install

export ANDROID_HOME=/opt/android-sdk

echo ""
echo "Setting Icon"
npx react-native set-icon --path  ../$1
echo "Icon Set"
echo ""

cd android
chmod +x gradlew

./gradlew bundleRelease
./gradlew assembleRelease

cp app/build/outputs/bundle/release/app-release.aab ../../app-release.aab
cp app/build/outputs/apk/release/app-release.apk ../../app-release.apk