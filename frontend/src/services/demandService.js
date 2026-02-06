import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, onSnapshot, orderBy } from 'firebase/firestore';

export const createDemand = async (data) => {
    try {
        const docRef = await addDoc(collection(db, 'demands'), {
            ...data,
            createdAt: serverTimestamp(),
            status: 'open'
        });
        console.log(`[Firestore Success] Demand created with ID: ${docRef.id}`);
        return docRef;
    } catch (err) {
        console.error(`[Firestore Failure] Error creating demand: ${err.message}`);
        throw err;
    }
};

export const subscribeToAllDemands = (callback) => {
    const q = query(collection(db, 'demands'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
};
