import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const getUserData = async (uid) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
};

export const createUserProfile = async (uid, data) => {
    await setDoc(doc(db, 'users', uid), {
        ...data,
        createdAt: new Date().toISOString()
    });
};

export const updateUserProfile = async (uid, data) => {
    await updateDoc(doc(db, 'users', uid), data);
};
