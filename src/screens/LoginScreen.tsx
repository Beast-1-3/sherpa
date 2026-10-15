// src/screens/LoginScreen.tsx
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col min-h-full bg-[#F2F2F7] px-6 pt-12 pb-8">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="/sherpa-logo-clean.png"
          alt="Sherpa AI"
          className="w-28 h-auto object-contain"
          onError={e => {
            (e.currentTarget as HTMLImageElement).src = '/sherpa-logo.png';
          }}
        />
      </div>

      {/* Sign In heading */}
      <h1 className="text-[28px] font-bold text-gray-900 mb-1">Sign In</h1>
      <p className="text-sm text-gray-500 mb-8">
        To sign in to an account in the application, enter your credentials
      </p>

      {/* Username */}
      <label className="text-sm font-medium text-gray-700 mb-1.5">Username</label>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm mb-4 outline-none focus:border-[#5B5BD6] focus:ring-2 focus:ring-[#5B5BD6]/20 transition-all"
      />

      {/* Password */}
      <label className="text-sm font-medium text-gray-700 mb-1.5">Password</label>
      <div className="relative mb-6">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm outline-none focus:border-[#5B5BD6] focus:ring-2 focus:ring-[#5B5BD6]/20 transition-all"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>

      {/* Continue button */}
      <button
        onClick={onLogin}
        className="w-full h-12 rounded-xl bg-[#5B5BD6] text-white font-semibold text-base mb-6 active:bg-[#4848B8] transition-colors shadow-md shadow-[#5B5BD6]/30"
      >
        Continue
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">Don't have an account yet?</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google */}
      <button className="w-full h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center gap-2 text-gray-700 font-medium text-sm mb-auto active:bg-gray-50 transition-colors">
        {/* Google G */}
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400 leading-relaxed">
          By clicking "Continue", I have read and agree with the{' '}
          <span className="text-[#5B5BD6]">Term Sheet, Privacy Policy</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">v1.2.1 (62)</p>
      </div>
    </div>
  );
}
