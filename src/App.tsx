// src/App.tsx
import { useState } from 'react';
import { SessionProvider } from './store/sessionStore';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import LiveAssistScreen from './screens/LiveAssistScreen';

type Screen = 'login' | 'home' | 'live-assist';

function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-300 flex items-start justify-center">
      <div
        className="relative w-full max-w-[400px] min-h-screen bg-white overflow-hidden"
        style={{ boxShadow: '0 0 40px rgba(0,0,0,0.2)' }}
      >
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');

  return (
    <SessionProvider>
      <MobileShell>
        {screen === 'login' && (
          <LoginScreen onLogin={() => setScreen('home')} />
        )}
        {screen === 'home' && (
          <HomeScreen onStartLiveAssist={() => setScreen('live-assist')} />
        )}
        {screen === 'live-assist' && (
          <LiveAssistScreen onBack={() => setScreen('home')} />
        )}
      </MobileShell>
    </SessionProvider>
  );
}
