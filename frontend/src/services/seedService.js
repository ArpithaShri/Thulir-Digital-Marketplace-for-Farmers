import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const seedDemoData = async (targetFarmerUid) => {
    console.log(`Starting demo data seeding for UID: ${targetFarmerUid}...`);

    try {
        // 1. Create Demo Buyer (Fixed identity for the marketplace)
        const DEMO_BUYER_UID = 'demo-buyer-id';
        await setDoc(doc(db, 'users', DEMO_BUYER_UID), {
            name: 'GrainCorp India (Demo Buyer)',
            role: 'buyer',
            location: 'Gurugram, HR',
            entityType: 'buyer',
            verified: true,
            createdAt: new Date().toISOString()
        });

        // 2. Create a Crop Listing (Owned by the current user to show in dashboard)
        await addDoc(collection(db, 'listings'), {
            cropType: 'Basmati Rice',
            quantity: '1000 kg',
            grade: 'grade_a',
            location: 'Karnal, Haryana',
            expectedPrice: '₹85/kg',
            status: 'available',
            farmerId: targetFarmerUid,
            farmerName: 'Rajesh Kumar (Demo Farmer)',
            farmerVerified: true,
            createdAt: serverTimestamp(),
            auctionActive: true,
            highestBid: 82,
            highestBidder: 'Ancient Grains'
        });

        // 3. Create a Demand (From someone else to show in farmer's "Demands" tab)
        await addDoc(collection(db, 'demands'), {
            cropType: 'Wheat',
            quantity: '5 Tons',
            urgency: 'urgent',
            buyerName: 'GrainCorp India',
            buyerVerified: true,
            entityType: 'buyer',
            targetPrice: '₹28/kg',
            location: 'Amritsar, Punjab',
            createdAt: serverTimestamp(),
            status: 'open'
        });

        console.log("Demo data seeding completed successfully.");
        return true;
    } catch (error) {
        console.error("Error seeding demo data:", error);
        return false;
    }
};
