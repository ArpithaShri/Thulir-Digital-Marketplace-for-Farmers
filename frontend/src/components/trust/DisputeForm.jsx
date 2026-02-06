import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const DisputeForm = ({ listingId, reportedAgainstId, reportedAgainstName, onClose }) => {
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, 'disputes'), {
                listingId: listingId || 'N/A',
                reportedBy: auth.currentUser.uid,
                reportedByName: auth.currentUser.displayName || 'Anonymous User',
                reportedAgainst: reportedAgainstId,
                reportedAgainstName: reportedAgainstName,
                reason: reason,
                status: 'OPEN',
                createdAt: serverTimestamp()
            });
            setSuccess(true);
            setTimeout(() => {
                if (onClose) onClose();
            }, 2000);
        } catch (err) {
            console.error("Error submitting dispute:", err);
            alert("Failed to submit dispute. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="glass-card animate-fade-in" style={{ padding: '24px', textAlign: 'center', borderColor: '#22c55e' }}>
                <span style={{ fontSize: '48px' }}>✅</span>
                <h3>Dispute Submitted</h3>
                <p>Our team will review your report shortly.</p>
            </div>
        );
    }

    return (
        <div className="glass-card animate-slide-down" style={{ padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>Report an Issue</h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Reporting against: <strong>{reportedAgainstName}</strong>
            </p>

            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Reason for Dispute</label>
                    <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Please describe the issue in detail (e.g., quality mismatch, payment delay, etc.)"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'inherit' }}
                    ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ flex: 2, backgroundColor: '#ef4444', borderColor: '#ef4444' }}
                        disabled={submitting || !reason.trim()}
                    >
                        {submitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DisputeForm;
