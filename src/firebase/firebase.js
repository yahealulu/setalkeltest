import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
    // قم بوضع تكوين Firebase الخاص بك هنا
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const getDeviceToken = async () => {
    let token = '';
    try {
        token = await getToken(messaging, {
            vapidKey: 'YOUR_VAPID_KEY' // مفتاح VAPID من إعدادات Firebase
        });
        console.log('Device Token:', token);
    } catch (error) {
        console.error('Error getting device token:', error);
    }
    return token;
}; 