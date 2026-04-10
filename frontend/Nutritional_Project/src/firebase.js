import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

function readConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
}

const config = readConfig()
const hasConfig = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId,
)

let app = null
if (hasConfig) {
  app = getApps().length ? getApps()[0] : initializeApp(config)
}

/** @type {import('firebase/auth').Auth | null} */
export const auth = app ? getAuth(app) : null

export const firebaseAuthReady = Boolean(auth)
