# Firebase Setup for Cross-Device Syncing

To enable cross-device syncing of your game data, you need to set up Firebase. Follow these steps:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "fitness-warrior-game")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)
5. Click "Create project"

## 2. Enable Firestore Database

1. In your Firebase project, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## 3. Get Your Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "fitness-warrior-web")
6. Copy the configuration object

## 4. Update the Firebase Configuration

1. Open `src/firebase.js` in your project
2. Replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 5. Install Firebase (if not already installed)

Run this command in your project directory:
```bash
npm install firebase
```

## 6. Test the Setup

1. Start your app: `npm start`
2. Create a trainer and complete some tasks
3. Check the browser console for "Data saved to cloud successfully" messages
4. Try accessing the app from another device/browser to verify sync

## Security Rules (Optional)

For production, you should set up proper Firestore security rules. In the Firestore console:

1. Go to "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents (for development)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Note:** These rules allow full access. For production, implement proper authentication and authorization.

## Troubleshooting

- **"Firebase not configured" errors**: Make sure you've updated the config in `src/firebase.js`
- **Permission errors**: Check that Firestore is enabled and rules allow read/write
- **Network errors**: Ensure your app has internet access
- **Data not syncing**: Check browser console for error messages

## How It Works

- **Local Storage**: Still used as backup and for offline functionality
- **Cloud Sync**: Data is automatically saved to Firebase when you:
  - Complete tasks
  - Update character stats
  - Change settings
  - Battle other trainers
- **Fallback**: If Firebase is unavailable, the app continues to work with local storage
- **Cross-Device**: All devices with the same Firebase project will share data

## Data Structure

The app stores data in two Firestore collections:
- `trainers`: Individual trainer data (character stats, progress)
- `settings`: Global app settings (audio, dark mode preferences) 