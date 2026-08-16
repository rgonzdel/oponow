const { getDefaultConfig } = require('expo/metro-config');

// expo/metro-config ya detecta el monorepo pnpm y configura symlinks/
// package-exports por su cuenta en SDK 57 — expo-doctor avisa
// explícitamente de no sobreescribir esos valores a mano.
module.exports = getDefaultConfig(__dirname);
