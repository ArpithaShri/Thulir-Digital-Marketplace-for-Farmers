import React from 'react';
import { useTranslation } from 'react-i18next';

const VerificationBadge = ({ verified, size = 'sm' }) => {
    const { t } = useTranslation();
    if (!verified) return null;

    const styles = {
        sm: { fontSize: '0.75rem', padding: '2px 8px' },
        md: { fontSize: '0.85rem', padding: '4px 12px' },
        lg: { fontSize: '1rem', padding: '6px 16px' }
    };

    return (
        <span
            className="verification-badge"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: '#16a34a',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '99px',
                fontWeight: '600',
                ...styles[size]
            }}
            title={t('verified')}
        >
            <span style={{ fontSize: size === 'sm' ? '12px' : '16px' }}>✔</span>
            {t('verified')}
        </span>
    );
};

export default VerificationBadge;
