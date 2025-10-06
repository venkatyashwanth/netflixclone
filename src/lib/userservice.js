import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // If user document doesn't exist, create it
    if (!userSnap.exists()) {
        const { email } = user;
        const createdAt = new Date();

        try {
            await setDoc(userRef, {
                uid: user.uid,
                email,
                displayName: additionalData.displayName || '',
                createdAt,
                ...additionalData
            });
        } catch (error) {
            console.error('Error creating user document:', error);
        }
    }
}

// Get user data from Firestore
export const getUserData = async (userId) => {
    if (!userId) return null;

    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
};
