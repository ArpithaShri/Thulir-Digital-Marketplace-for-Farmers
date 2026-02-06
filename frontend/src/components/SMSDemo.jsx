import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SMSDemo() {
    const { t } = useTranslation();
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('');
    const [isSending, setIsSending] = useState(false);

    const simulateSMS = (e) => {
        e.preventDefault();
        if (!phone) return;

        setIsSending(true);
        setStatus('syncing');

        setTimeout(() => {
            setIsSending(false);
            setStatus('success');
        }, 2000);
    };

    return (
        <div className="sms-widget glass-card">
            <div className="widget-header">
                <div className="widget-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>📟</div>
                <div className="widget-title">
                    <h4 style={{ fontFamily: 'Outfit' }}>{t('sms_demo')}</h4>
                    <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)' }}>OFFLINE ACCESS BRIDGE</span>
                </div>
            </div>

            <div className="widget-body">
                <p className="widget-description">
                    Provide price transparency even in zero-data zones via automated SMS alerts.
                </p>

                <form onSubmit={simulateSMS} className="sms-form">
                    <div className="input-with-label">
                        <label style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>RECIPIENT NUMBER</label>
                        <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={isSending}
                            style={{ padding: '12px 20px', borderRadius: '16px' }}
                        />
                    </div>

                    <button
                        className={`btn sms-btn ${isSending ? 'loading' : ''}`}
                        disabled={isSending || !phone}
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            height: '48px',
                            boxShadow: '0 4px 12px rgba(30, 77, 43, 0.2)'
                        }}
                    >
                        {isSending ? (
                            <span className="spinner-small" style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#fff' }}></span>
                        ) : (
                            'Send Price Update'
                        )}
                    </button>
                </form>

                {status === 'success' && (
                    <div className="sms-response animate-slide-up">
                        <div className="message-bubble">
                            <strong>Thulir SMS:</strong> Current Rice price in your region is ₹42.50/kg. Trend: Up (+2%)
                        </div>
                        <span className="timestamp">Delivered • Just now</span>
                    </div>
                )}
            </div>
        </div>
    );
}
