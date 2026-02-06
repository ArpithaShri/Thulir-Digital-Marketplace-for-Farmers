import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInAnonymously } from 'firebase/auth';
import { createUserProfile } from '../services/userService';
import { useTranslation } from 'react-i18next';
import { seedDemoData } from '../services/seedService';

export default function Login() {
    const { t, i18n } = useTranslation();
    const [name, setName] = useState('');
    const [role, setRole] = useState('farmer');
    const [entityType, setEntityType] = useState('retailer');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!name || !location) {
            setError(t('fill_fields'));
            return;
        }
        setError('');
        setLoading(true);

        try {
            const { user } = await signInAnonymously(auth);

            await createUserProfile(user.uid, {
                name,
                role,
                location,
                entityType: role === 'buyer' ? entityType : null,
                language: i18n.language,
                verified: true
            });

        } catch (err) {
            console.error(err);
            setError(`${t('login_failed')}: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass-card">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{t('welcome')}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>{t('login_as')}</label>
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
                                    <span>{t('farmer')}</span>
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
                                    <span>{t('buyer')}</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {role === 'buyer' && (
                        <div className="form-group animate-slide-down">
                            <label>{t('entity_type')}</label>
                            <select value={entityType} onChange={(e) => setEntityType(e.target.value)}>
                                <option value="retailer">{t('retailer')}</option>
                                <option value="cooperative">{t('cooperative')}</option>
                                <option value="institutional">{t('institutional')}</option>
                                <option value="community">{t('community')}</option>
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label>{t('name_label')}</label>
                        <input
                            type="text"
                            placeholder={t('name_label')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('location_label')}</label>
                        <input
                            type="text"
                            placeholder="e.g. Coimbatore, Tamil Nadu"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p style={{ color: 'var(--error)', marginBottom: '16px', fontSize: '0.875rem' }}>{error}</p>}

                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? t('entering') : t('join_btn')}
                    </button>

                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px border-subtle var(--border-color)', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                            {t('demo_msg')}
                        </p>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid var(--primary)' }}
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    // Trigger login first to get UID
                                    const { user } = await signInAnonymously(auth);

                                    // Seed data with THIS user as farmer
                                    await seedDemoData(user.uid);

                                    // Create/Update profile
                                    await createUserProfile(user.uid, {
                                        name: 'Rajesh Kumar (Demo Farmer)',
                                        role: 'farmer',
                                        location: 'Karnal, Haryana',
                                        verified: true,
                                        createdAt: new Date().toISOString()
                                    });
                                } catch (err) {
                                    console.error(err);
                                    setError(t('demo_failed'));
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            {t('demo_btn')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
