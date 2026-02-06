import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, onSnapshot, orderBy } from 'firebase/firestore';

export const createDemand = async (data) => {
    return await addDoc(collection(db, 'demands'), {
        ...data,
        createdAt: serverTimestamp(),
        status: 'open'
    });
};

export const subscribeToAllDemands = (callback) => {
    const q = query(collection(db, 'demands'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
};
