import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, doc, deleteDoc, updateDoc, orderBy } from 'firebase/firestore';

export const createListing = async (data) => {
    return await addDoc(collection(db, 'listings'), {
        ...data,
        createdAt: serverTimestamp(),
        status: 'available'
    });
};

export const deleteListing = async (id) => {
    await deleteDoc(doc(db, 'listings', id));
};

export const updateListingStatus = async (id, status) => {
    await updateDoc(doc(db, 'listings', id), { status });
};

export const closeAuction = async (id) => {
    await updateDoc(doc(db, 'listings', id), { auctionActive: false });
};

export const subscribeToMyListings = (uid, callback) => {
    const q = query(
        collection(db, 'listings'),
        where('farmerId', '==', uid)
    );
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
};

export const subscribeToAllListings = (callback) => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
};
