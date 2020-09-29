// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBkmgwNt3dZmMpItBemSli6i8AFwQUCFvM",
  authDomain: "instagram-clone-7996b.firebaseapp.com",
  databaseURL: "https://instagram-clone-7996b.firebaseio.com",
  projectId: "instagram-clone-7996b",
  storageBucket: "instagram-clone-7996b.appspot.com",
  messagingSenderId: "24341060921",
  appId: "1:24341060921:web:707897c21d1b017e5f9ce8",
  measurementId: "G-MT5J51B1CD"
})
const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()


 export {db, auth, storage};
