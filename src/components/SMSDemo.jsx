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
                <div className="widget-icon">📟</div>
                <div className="widget-title">
                    <h4>{t('sms_demo')}</h4>
                    <span>Offline Access Bridge</span>
                </div>
            </div>

            <div className="widget-body">
                <p className="widget-description">
                    Provide price transparency even in zero-data zones via automated SMS alerts.
                </p>

                <form onSubmit={simulateSMS} className="sms-form">
                    <div className="input-with-label">
                        <label>Recipient Number</label>
                        <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={isSending}
                        />
                    </div>

                    <button
                        className={`btn btn-secondary sms-btn ${isSending ? 'loading' : ''}`}
                        disabled={isSending || !phone}
                    >
                        {isSending ? (
                            <span className="spinner-small"></span>
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
