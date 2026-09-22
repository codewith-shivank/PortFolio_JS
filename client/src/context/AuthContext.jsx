import { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '@/lib/firebase';

const AuthContext = createContext(null);

const ADMIN_EMAIL = 'codewithshivank@gmail.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const signingInPromiseRef = useRef(null);

  // Sync Firebase Auth state and Firestore user document
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setFirebaseUser(currentUser);
        try {
          const idToken = await currentUser.getIdToken();
          setToken(idToken);

          // Sync or create user profile in Firestore
          const userDocPath = `users/${currentUser.uid}`;
          let profileData = null;

          try {
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);

            const isAppAdmin =
              currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

            if (!userSnap.exists()) {
              profileData = {
                id: currentUser.uid,
                displayName: currentUser.displayName || 'Developer Visitor',
                email: currentUser.email || '',
                photoURL: currentUser.photoURL || '',
                role: isAppAdmin ? 'admin' : 'user',
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
              };
              await setDoc(userRef, profileData);
            } else {
              profileData = userSnap.data();
              // Update last login timestamp and latest profile info
              const updates = {
                lastLoginAt: new Date().toISOString(),
                displayName: currentUser.displayName || profileData.displayName || '',
                photoURL: currentUser.photoURL || profileData.photoURL || '',
                email: currentUser.email || profileData.email || '',
              };
              await updateDoc(userRef, updates);
              profileData = { ...profileData, ...updates };
            }
          } catch (firestoreErr) {
            handleFirestoreError(firestoreErr, OperationType.WRITE, userDocPath);
          }

          setUser({
            uid: currentUser.uid,
            displayName: currentUser.displayName || profileData?.displayName || 'User',
            email: currentUser.email || profileData?.email || '',
            photoURL: currentUser.photoURL || profileData?.photoURL || '',
            role:
              profileData?.role ||
              (currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
                ? 'admin'
                : 'user'),
          });
        } catch (err) {
          console.error('Error synchronizing auth user profile:', err);
          setUser({
            uid: currentUser.uid,
            displayName: currentUser.displayName || 'User',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
            role:
              currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
                ? 'admin'
                : 'user',
          });
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign-In with popup, concurrency locking & graceful cancellation handling
  const signInWithGoogle = async () => {
    // If user is already authenticated, return current Firebase user
    if (auth.currentUser) {
      return auth.currentUser;
    }

    // If a popup authentication request is already active, return the existing in-flight promise
    if (signingInPromiseRef.current) {
      return signingInPromiseRef.current;
    }

    setIsSigningIn(true);
    const runSignIn = async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
      } catch (error) {
        const errorCode = error?.code || '';
        const errorMessage = error?.message || '';

        // Benign cancellation: user closed popup, switched tabs, or duplicate was dismissed
        const isCancelled =
          errorCode === 'auth/cancelled-popup-request' ||
          errorCode === 'auth/popup-closed-by-user' ||
          errorCode === 'auth/user-cancelled' ||
          errorMessage.includes('cancelled-popup-request') ||
          errorMessage.includes('popup-closed-by-user');

        if (isCancelled) {
          // Informational only, not an application error
          return null;
        }

        console.warn('Google Sign-In prompt was dismissed or failed:', errorMessage);
        return null;
      } finally {
        signingInPromiseRef.current = null;
        setIsSigningIn(false);
      }
    };

    signingInPromiseRef.current = runSignIn();
    return signingInPromiseRef.current;
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      setToken(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const isAdmin =
    user?.role === 'admin' ||
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        token,
        loading,
        isSigningIn,
        isAdmin,
        signInWithGoogle,
        login: signInWithGoogle, // For backwards-compatibility with login routes
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
