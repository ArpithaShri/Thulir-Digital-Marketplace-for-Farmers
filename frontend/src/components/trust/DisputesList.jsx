import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';

const DisputesList = ({ isAdmin = false }) => {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) return;

        let q;
        if (isAdmin) {
            // Mock Admin: Show all disputes
            q = query(collection(db, 'disputes'), orderBy('createdAt', 'desc'));
        } else {
            // User: Show only their reported disputes
            q = query(
                collection(db, 'disputes'),
                where('reportedBy', '==', auth.currentUser.uid),
                orderBy('createdAt', 'desc')
            );
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setDisputes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAdmin]);

    const resolveDispute = async (id) => {
        try {
            await updateDoc(doc(db, 'disputes', id), {
                status: 'RESOLVED',
                resolvedAt: new Date()
            });
        } catch (err) {
            console.error("Error resolving dispute:", err);
            alert("Failed to resolve dispute.");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading disputes...</div>;

    return (
        <div className="disputes-container">
            <h3 style={{ marginBottom: '16px' }}>{isAdmin ? 'System Dispute Management (Admin Mock)' : 'My Reported Issues'}</h3>

            {disputes.length === 0 ? (
                <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p>No disputes found.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {disputes.map(dispute => (
                        <div key={dispute.id} className="glass-card" style={{ padding: '16px', borderLeft: dispute.status === 'OPEN' ? '4px solid #ef4444' : '4px solid #22c55e' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <div>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: dispute.status === 'OPEN' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                        color: dispute.status === 'OPEN' ? '#ef4444' : '#22c55e',
                                        textTransform: 'uppercase'
                                    }}>
                                        {dispute.status}
                                    </span>
                                    <h4 style={{ margin: '8px 0 4px 0' }}>Issue with {dispute.reportedAgainstName}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                                        ID: {dispute.id.slice(0, 8)}... • {dispute.createdAt?.toDate().toLocaleDateString()}
                                    </p>
                                </div>
                                {isAdmin && dispute.status === 'OPEN' && (
                                    <button
                                        onClick={() => resolveDispute(dispute.id)}
                                        className="btn btn-primary"
                                        style={{ fontSize: '0.8rem', padding: '6px 12px', width: 'auto' }}
                                    >
                                        Mark Resolved
                                    </button>
                                )}
                            </div>

                            <div style={{ backgroundColor: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                                <strong>Reason:</strong> {dispute.reason}
                            </div>

                            {isAdmin && (
                                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    Reported by: {dispute.reportedByName} ({dispute.reportedBy})
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DisputesList;
