import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Login() {
    const [name, setName] = useState('');
    const [role, setRole] = useState('farmer');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!name || !location) {
            setError('Please fill in all fields');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const { user } = await signInAnonymously(auth);

            // Auto-create user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name,
                role,
                location,
                verified: true,
                createdAt: new Date().toISOString()
            });

        } catch (err) {
            console.error(err);
            setError(`Login failed: ${err.code || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass-card">
                <h1>Welcome to Thulir</h1>
                <p className="subtitle">Digital Marketplace for Farmers</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Arpitha Shri"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            placeholder="e.g. Coimbatore, Tamil Nadu"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>I want to join as</label>
                        <div className="role-selector">
                            <label className="role-option">
                                <input
                                    type="radio"
                                    name="role"
                                    value="farmer"
                                    checked={role === 'farmer'}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                                <div className="role-card">
                                    <span className="icon">👨‍🌾</span>
                                    <span>Farmer</span>
                                </div>
                            </label>

                            <label className="role-option">
                                <input
                                    type="radio"
                                    name="role"
                                    value="buyer"
                                    checked={role === 'buyer'}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                                <div className="role-card">
                                    <span className="icon">🛒</span>
                                    <span>Buyer</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {error && <p style={{ color: 'var(--error)', marginBottom: '16px', fontSize: '0.875rem' }}>{error}</p>}

                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Entering...' : 'Join Marketplace'}
                    </button>
                </form>
            </div>
        </div>
    );
}
