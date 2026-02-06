import React, { useMemo } from 'react';
import { getEligibleSchemes, getRelevantAdvisories } from '../../services/advisoryService';
import { useTranslation } from 'react-i18next';

const FinancialAdvisory = ({ userData, listings = [] }) => {
    const { t } = useTranslation();
    // Determine unique crops from listings
    const farmerCrops = useMemo(() => {
        const crops = listings.map(l => l.cropType.toLowerCase());
        return [...new Set(crops)];
    }, [listings]);

    const farmerLocation = userData?.location || '';

    // Rule-Based Eligibility Engine
    const eligibleSchemes = useMemo(() => {
        return getEligibleSchemes(farmerLocation, farmerCrops);
    }, [farmerCrops, farmerLocation]);

    // Advisory Logic
    const relevantAdvisories = useMemo(() => {
        return getRelevantAdvisories(farmerCrops);
    }, [farmerCrops]);

    return (
        <div className="financial-advisory-section">
            <h4 className="section-title">{t('financial_advisory')}</h4>

            {/* Subsidy & Scheme Alerts */}
            <div className="advisory-group" style={{ marginBottom: '24px' }}>
                <h5 style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {t('eligible_schemes')} ({eligibleSchemes.length})
                </h5>
                {eligibleSchemes.length === 0 ? (
                    <div className="glass-card" style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {t('add_crops_to_see')}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {eligibleSchemes.map(scheme => (
                            <div key={scheme.schemeId} className="glass-card animate-slide-up" style={{ padding: '16px', borderLeft: '4px solid var(--accent)', background: 'rgba(245, 158, 11, 0.05)' }}>
                                <h6 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--text-main)' }}>{scheme.schemeName}</h6>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{scheme.description}</p>
                                <button style={{ marginTop: '8px', padding: '4px 10px', fontSize: '0.7rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{t('apply_details')}</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Advisory Messages */}
            <div className="advisory-group">
                <h5 style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {t('smart_advisory')}
                </h5>
                <div style={{ display: 'grid', gap: '12px' }}>
                    {relevantAdvisories.length > 0 ? (
                        relevantAdvisories.map(adv => (
                            <div key={adv.messageId} className="glass-card animate-fade-in" style={{ padding: '16px', borderLeft: '4px solid var(--primary)', background: 'var(--panel)' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)' }}>INFO</span>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                                        {adv.messageText}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="glass-card" style={{ padding: '16px', background: 'var(--panel)' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>STATUS</span>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                    {t('stable_weather')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinancialAdvisory;
