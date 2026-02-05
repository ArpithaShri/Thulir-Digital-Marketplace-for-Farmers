import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

import VoiceAssistant from './components/VoiceAssistant';
import LanguageSelector from './components/LanguageSelector';

function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (initializing) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <LanguageSelector />
      {user ? (
        <Dashboard user={user} />
      ) : (
        <Login />
      )}
      <VoiceAssistant />
    </div>
  );
}

export default App;
