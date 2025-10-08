"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, getIdToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserDocument, getUserData } from "@/lib/userservice";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false); // Add this
  const isSigningUpRef = useRef(false);
  const router = useRouter();

  // Set auth token cookie
  const setAuthTokenCookie = async (user) => {
    if (user) {
      try {
        const token = await getIdToken(user);
        // Set cookie that middleware can read
        document.cookie = `auth-token=${token}; path=/; max-age=3600; SameSite=Lax`;
      } catch (error) {
        console.error('Error setting auth token:', error);
      }
    } else {
      // Clear cookie on logout
      document.cookie = 'auth-token=; path=/; max-age=0';
    }
  };

  // Sign up function

  const signup = async (email, password, displayName = '') => {
    setIsSigningUp(true);
    isSigningUpRef.current = true;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await createUserDocument(user, { displayName });
      router.push('/login');
      signOut(auth).finally(() => {
        setIsSigningUp(false);
        isSigningUpRef.current = false;
      });
      return userCredential;
    } catch (error) {
      setIsSigningUp(false);
      isSigningUpRef.current = false;
      console.error('Error in signup:', error);
      setLoading(false);
      throw error;
    }
  };

  // Sign in function
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);


    // Set auth token cookie
    await setAuthTokenCookie(userCredential.user);

    const userDoc = await getUserData(userCredential.user.uid);
    setUserData(userDoc);


    return userCredential;
  };

  // Sign out function
  const logout = () => {
    setUserData(null);
    // Cookie will be cleared in the auth state change listener
    return signOut(auth);
  };

  // Password reset function
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Function to refresh user data
  const refreshUserData = async () => {
    if (user) {
      const data = await getUserData(user.uid);
      setUserData(data);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // If we're in the middle of signup, don't update user state
      if (!isSigningUpRef.current) {
        setUser(user);

        if (user) {
          await setAuthTokenCookie(user);
          const userDoc = await getUserData(user.uid);
          setUserData(userDoc);
        } else {
          setAuthTokenCookie(null);
          setUserData(null);
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [isSigningUp]); // Add dependency

  const value = {
    user: isSigningUp ? null : user, // Return null user during signup
    loading,
    userData: isSigningUp ? null : userData, // Return null userData during signup
    signup,
    login,
    logout,
    resetPassword,
    refreshUserData,
    isSigningUp // Expose this if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}