import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { subscribeToDisputes, resolveDispute } from '../../services/disputeService';
import { useTranslation } from 'react-i18next';

const DisputesList = ({ isAdmin = false }) => {
    const { t } = useTranslation();
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) return;

        setLoading(true);
        const unsubscribe = subscribeToDisputes(isAdmin, auth.currentUser.uid, (data) => {
            setDisputes(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAdmin]);

    const handleResolve = async (id) => {
        try {
            await resolveDispute(id);
        } catch (err) {
            console.error("Error resolving dispute:", err);
            alert("Failed to resolve dispute.");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>{t('loading_disputes')}</div>;

    return (
        <div className="disputes-container">
            <h3 style={{ marginBottom: '16px' }}>{isAdmin ? t('admin_dispute_mgmt') : t('my_reported_issues')}</h3>

            {disputes.length === 0 ? (
                <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p>{t('no_disputes')}</p>
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
                                    <h4 style={{ margin: '8px 0 4px 0' }}>{t('issue_with')} {dispute.reportedAgainstName}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                                        ID: {dispute.id.slice(0, 8)}... • {dispute.createdAt?.toDate().toLocaleDateString()}
                                    </p>
                                </div>
                                {isAdmin && dispute.status === 'OPEN' && (
                                    <button
                                        onClick={() => handleResolve(dispute.id)}
                                        className="btn btn-primary"
                                        style={{ fontSize: '0.8rem', padding: '6px 12px', width: 'auto' }}
                                    >
                                        {t('mark_resolved')}
                                    </button>
                                )}
                            </div>

                            <div style={{ backgroundColor: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                                <strong>{t('reason')}:</strong> {dispute.reason}
                            </div>

                            {isAdmin && (
                                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {t('reported_by')}: {dispute.reportedByName} ({dispute.reportedBy})
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
