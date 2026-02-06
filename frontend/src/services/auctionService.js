import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

export const placeBid = async (listingId, bidderUid, bidderName, amount) => {
    // 1. Update listing with new highest bid
    await updateDoc(doc(db, 'listings', listingId), {
        highestBid: amount,
        highestBidder: bidderName
    });

    // 2. Log the bid in subcollection
    return await addDoc(collection(db, 'listings', listingId, 'bids'), {
        bidderId: bidderUid,
        bidderName: bidderName,
        bidAmount: amount,
        timestamp: serverTimestamp()
    });
};
