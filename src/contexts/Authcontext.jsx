"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createUserDocument, getUserData } from "@/lib/userservice";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // Add userData state
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signup = async (email, password, displayName = '') => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await createUserDocument(user, { displayName });

      // Get the created user data
      const userDoc = await getUserData(user.uid);
      setUserData(userDoc);

      return userCredential;
    } catch (error) {
      console.error('Error in signup:', error);
      throw error;
    }

  };

  // Sign in function
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Get user data from Firestore after login
    const userDoc = await getUserData(userCredential.user.uid);
    setUserData(userDoc);

    return userCredential;
  };

  // Sign out function
  const logout = () => {
    setUserData(null); // Clear user data
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

  const testdb = async (userId) => {
    console.log("testing db");
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        console.log(userSnap.data());
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Get user data from Firestore when auth state changes
        const userDoc = await getUserData(user.uid);
        setUserData(userDoc);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userData, // Include userData in context value
    signup,
    login,
    logout,
    resetPassword,
    refreshUserData // Add function to refresh user data
  };
  return (
    <AuthContext.Provider value={value}>
      {/* {!loading && children} */}
      {children}
    </AuthContext.Provider>
  );
}

