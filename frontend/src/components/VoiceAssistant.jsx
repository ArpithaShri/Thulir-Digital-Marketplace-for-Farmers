import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function VoiceAssistant() {
    const { t, i18n } = useTranslation();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = i18n.language === 'en' ? 'en-IN' : (i18n.language === 'ta' ? 'ta-IN' : 'hi-IN');
        window.speechSynthesis.speak(utterance);
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support voice recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = i18n.language === 'en' ? 'en-IN' : (i18n.language === 'ta' ? 'ta-IN' : 'hi-IN');
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            speak(t('listening'));
        };

        recognition.onresult = (event) => {
            const currentTranscript = event.results[0][0].transcript;
            setTranscript(currentTranscript);
            processCommand(currentTranscript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.start();
    };

    const processCommand = (command) => {
        const cmd = command.toLowerCase();
        if (cmd.includes('price') || cmd.includes('விலை') || cmd.includes('कीमत')) {
            speak("Showing the latest price predictions and historical trends on your dashboard.");
        } else if (cmd.includes('crop') || cmd.includes('பயிர்') || cmd.includes('फसल')) {
            speak(t('post_crop') + " module loading.");
        } else {
            speak("I heard " + command + ". Can you repeat that?");
        }
    };

    return (
        <div className="voice-assistant-container">
            <button
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={startListening}
                title={t('voice_search')}
            >
                <span className="icon">{isListening ? '🛑' : '🎙️'}</span>
            </button>
            {transcript && <p className="transcript-preview">"{transcript}"</p>}
        </div>
    );
}
