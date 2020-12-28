import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCsZElUnh7twW4xjEOVyKyBfrc92kbICjQ",
    authDomain: "fb-whatsapp-17ac0.firebaseapp.com",
    projectId: "fb-whatsapp-17ac0",
    storageBucket: "fb-whatsapp-17ac0.appspot.com",
    messagingSenderId: "208266287975",
    appId: "1:208266287975:web:19c94d431f5e5c17022dc2"
  };


const firebaseApp = firebase.initializeApp(firebaseConfig);
  
const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth, provider};
export default db;