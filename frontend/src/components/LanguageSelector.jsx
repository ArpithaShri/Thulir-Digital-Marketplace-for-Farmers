import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'ta', label: 'தமிழ்' },
        { code: 'hi', label: 'हिंदी' },
        { code: 'te', label: 'తెలుగు' },
        { code: 'kn', label: 'ಕನ್ನಡ' },
        { code: 'ml', label: 'മലയാളം' }
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-selector-wrapper">
            <div className="language-selector">
                {languages.map((lng) => (
                    <button
                        key={lng.code}
                        className={i18n.language === lng.code ? 'active' : ''}
                        onClick={() => changeLanguage(lng.code)}
                    >
                        {lng.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
