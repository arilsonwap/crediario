@echo off
echo ===============================================
echo  CORRECAO AUTOMATICA DO PROJETO EXPO - WINDOWS
echo ===============================================
echo.

REM 1️⃣ Remover pastas antigas e caches
echo Removendo node_modules, .expo, android, ios e caches antigos...
rmdir /s /q node_modules
rmdir /s /q .expo
rmdir /s /q android
rmdir /s /q ios
del /q package-lock.json

REM 2️⃣ Reinstalar dependencias
echo Instalando dependencias novamente...
npm install

REM 3️⃣ Reinstalar Reanimated correto (para Expo SDK 54)
echo Instalando react-native-reanimated@~3.10.1 ...
npx expo install react-native-reanimated@~3.10.1

REM 4️⃣ Recriar diretorios nativos
echo Recriando builds nativos...
npx expo prebuild --clean

REM 5️⃣ Limpar cache do bundler
echo Limpando cache do Expo e iniciando o projeto...
npx expo start -c

echo.
echo ✅ Processo concluido! O projeto sera iniciado agora.
pause
