# Cybersafe NG prototype

## Setup (once)
```bash
npx create-expo-app@latest cybersafe-ng --template blank
cd cybersafe-ng
npx expo install react-dom react-native-web @expo/metro-runtime expo-font @expo/vector-icons @expo-google-fonts/poppins @expo-google-fonts/mulish
```
Copy `App.js`, `src/` and `netlify.toml` from this zip into that project (replace the existing App.js).

## Run
```bash
npx expo start --web
```

## Build for Netlify
```bash
npx expo export --platform web
```
Drag the generated `dist` folder onto https://app.netlify.com/drop, or push to GitHub and connect the repo
(netlify.toml already sets build command `npx expo export --platform web` and publish dir `dist`).

## Demo flow
- User: Login/Register -> Next -> Verify -> Home. Tabs: Home, Reports, Notices, Chat.
- Officer: Login screen -> "Login as Officer" -> Next. Tabs: Reports, Notices, Chat.
- Cases, notices and chat messages are shared between the user and officer views (in memory only, reset on refresh).
