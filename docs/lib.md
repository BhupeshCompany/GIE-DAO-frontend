1. npx patch-package
2. Go to android/build.gradle in react-native-vision-camera in node_modules
3. Replace this line 
excludes = ["**/libc++_shared.so", "**/libfbjni.so", "**/libjsi.so", "**/libreactnativejni.so", "**/libfolly_json.so", "**/libreanimated.so", "**/libjscexecutor.so", "**/libhermes.so", "**/libfolly_runtime.so"]
4. for more info visit https://github.com/mrousavy/react-native-vision-camera/pull/1144/files