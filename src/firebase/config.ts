// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, onChildAdded, onValue, push, ref, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app)
// console.log(database);


export const writeCode = async (code: string) => {

    const timestamp = Date.now()
    const codeRef = ref(database, `/codes/`);
    const newCodeRef = push(codeRef);
    set(newCodeRef, { code, timestamp });

}
