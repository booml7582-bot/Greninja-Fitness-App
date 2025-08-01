import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

console.log('Firebase db imported:', !!db, 'db:', db);

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  const configured = db && typeof db === 'object';
  console.log('Firebase configured:', configured, 'db:', !!db, 'db type:', typeof db);
  return configured;
};

// Save trainer data to both local storage and cloud
export const saveTrainerData = async (trainerId, data) => {
  console.log('Saving trainer data for:', trainerId, data);
  
  // Convert trainerId to string if it's a number
  const trainerIdString = String(trainerId);
  
  // Always save to local storage as backup
  localStorage.setItem(`trainer_${trainerIdString}`, JSON.stringify(data));
  
  // Try to save to cloud if Firebase is configured
  if (isFirebaseConfigured()) {
    try {
      // Clean the data to ensure it's serializable
      const cleanData = JSON.parse(JSON.stringify(data));
      
      await setDoc(doc(db, 'trainers', trainerIdString), {
        ...cleanData,
        lastUpdated: new Date().toISOString()
      });
      console.log('Data saved to cloud successfully');
    } catch (error) {
      console.error('Failed to save to cloud:', error);
      // Continue with local storage only
    }
  } else {
    console.log('Firebase not configured, saving to local storage only');
  }
};

// Load trainer data from cloud first, fallback to local storage
export const loadTrainerData = async (trainerId) => {
  // Convert trainerId to string if it's a number
  const trainerIdString = String(trainerId);
  
  // Try to load from cloud first
  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, 'trainers', trainerIdString);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        // Update local storage with cloud data
        localStorage.setItem(`trainer_${trainerIdString}`, JSON.stringify(cloudData));
        console.log('Data loaded from cloud successfully');
        return cloudData;
      }
    } catch (error) {
      console.error('Failed to load from cloud:', error);
      // Fallback to local storage
    }
  }
  
  // Fallback to local storage
  const localData = localStorage.getItem(`trainer_${trainerIdString}`);
  if (localData) {
    return JSON.parse(localData);
  }
  
  return null;
};

// Load all trainers data for leaderboard
export const loadAllTrainersData = async () => {
  const trainersData = {};
  
  // Try to load from cloud first
  if (isFirebaseConfigured()) {
    try {
      const querySnapshot = await getDocs(collection(db, 'trainers'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        trainersData[doc.id] = data;
        // Update local storage
        localStorage.setItem(`trainer_${doc.id}`, JSON.stringify(data));
      });
      console.log('All trainers data loaded from cloud');
      return trainersData;
    } catch (error) {
      console.error('Failed to load all trainers from cloud:', error);
      // Fallback to local storage
    }
  }
  
  // Fallback to local storage
  const trainerIds = ['ced', 'naz', 'theo', 'krys', 'jesmer'];
  trainerIds.forEach(id => {
    const localData = localStorage.getItem(`trainer_${id}`);
    if (localData) {
      trainersData[id] = JSON.parse(localData);
    }
  });
  
  return trainersData;
};

// Save app settings (dark mode, audio settings)
export const saveAppSettings = async (settings) => {
  localStorage.setItem('appSettings', JSON.stringify(settings));
  
  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, 'settings', 'global'), {
        ...settings,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to save settings to cloud:', error);
    }
  }
};

// Load app settings
export const loadAppSettings = async () => {
  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const cloudSettings = docSnap.data();
        localStorage.setItem('appSettings', JSON.stringify(cloudSettings));
        return cloudSettings;
      }
    } catch (error) {
      console.error('Failed to load settings from cloud:', error);
    }
  }
  
  const localSettings = localStorage.getItem('appSettings');
  return localSettings ? JSON.parse(localSettings) : null;
}; 