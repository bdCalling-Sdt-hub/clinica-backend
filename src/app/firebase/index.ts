// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import config from "../config";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: config.firebase.firebase_apikey,
  authDomain: config.firebase.firebase_authdomain,
  projectId: config.firebase.firebase_projectid,
  storageBucket: config.firebase.firebase_storagebucket,
  messagingSenderId: config.firebase.firebase_messagingsenderid,
  appId: config.firebase.firebase_appid
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp
// export declare function getMessaging(app?: FirebaseApp): Messaging;
// export type Message = TokenMessage | TopicMessage | ConditionMessage;