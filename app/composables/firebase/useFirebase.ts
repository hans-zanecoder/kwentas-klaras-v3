import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, type Auth, type User } from 'firebase/auth'

let firebaseApp: FirebaseApp | null = null
let auth: Auth | null = null

export function useFirebase() {
  const config = useRuntimeConfig()

  function getFirebaseApp(): FirebaseApp {
    if (firebaseApp) {
      return firebaseApp
    }

    const existingApps = getApps()
    if (existingApps.length > 0 && existingApps[0]) {
      firebaseApp = existingApps[0]
      return firebaseApp
    }
    
    firebaseApp = initializeApp({
      apiKey: config.public.firebaseApiKey,
      authDomain: config.public.firebaseAuthDomain,
      projectId: config.public.firebaseProjectId,
      storageBucket: config.public.firebaseStorageBucket,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId: config.public.firebaseAppId,
    })

    return firebaseApp
  }

  function getFirebaseAuth(): Auth {
    if (auth) {
      return auth
    }

    const app = getFirebaseApp()
    auth = getAuth(app)
    return auth
  }

  const login = async (email: string, password: string): Promise<User> => {
    const firebaseAuth = getFirebaseAuth()
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password)
    return userCredential.user
  }

  return {
    login,
    auth: computed(() => getFirebaseAuth()),
  }
}

