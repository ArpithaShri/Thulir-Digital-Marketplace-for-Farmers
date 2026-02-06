import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';

export const submitDispute = async (data) => {
    return await addDoc(collection(db, 'disputes'), {
        ...data,
        status: 'OPEN',
        createdAt: serverTimestamp()
    });
};

export const resolveDispute = async (id) => {
    await updateDoc(doc(db, 'disputes', id), {
        status: 'RESOLVED',
        resolvedAt: serverTimestamp()
    });
};

export const subscribeToDisputes = (isAdmin, uid, callback) => {
    let q;
    if (isAdmin) {
        q = query(collection(db, 'disputes'), orderBy('createdAt', 'desc'));
    } else {
        q = query(
            collection(db, 'disputes'),
            where('reportedBy', '==', uid),
            orderBy('createdAt', 'desc')
        );
    }
    return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
};
