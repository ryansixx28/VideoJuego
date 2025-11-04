import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
     apiKey: "AIzaSyD1AEjLyBmcCj1tUBGvr6KhhJrmW0YDHIs",
  authDomain: "quiz-redes-fb118.firebaseapp.com",
  projectId: "quiz-redes-fb118",
  storageBucket: "quiz-redes-fb118.firebasestorage.app",
  messagingSenderId: "642374436041",
  appId: "1:642374436041:web:d68c518f765727e8fef918"
}

let app, auth
export let db
export function initFirebase(){
  if(!app){
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  }
  return app
}
const provider = new GoogleAuthProvider()
export function loginWithGoogle(){
  initFirebase()
  const isAndroid = /Android/i.test(navigator.userAgent)
  return isAndroid ? signInWithRedirect(auth, provider) : signInWithPopup(auth, provider)
}




export async function resumeRedirect(){
  initFirebase()
  try {
    const res = await getRedirectResult(auth)
    // opcional: puedes leer res?.user si quieres actuar aquí
    return res
  } catch (e) {
    console.log('[getRedirectResult]', e?.message)
    return null
  }
}
export function logout(){ initFirebase(); return signOut(auth) }
export function onUser(cb){ initFirebase(); return onAuthStateChanged(auth, cb) }