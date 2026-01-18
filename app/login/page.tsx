"use client";
import React, { useState } from 'react';
import { User, Lock, ChevronDown, Eye, EyeOff, Shield } from 'lucide-react';
import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/app/ui/home.module.css';
import clsx from 'clsx';
export const inter = Inter({ subsets: ['latin'] });
import { useEffect } from "react";

// Removed server-side imports and API handler as per instructions

// Removed the first handleSubmit function before export default App

// In your Next.js app, uncomment the line below:
import { useRouter } from 'next/navigation';


export default function App() {
  // In your real app, use the router hook:
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // Removed role state as per instructions
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // State for preview purposes only (to show the logged-in view)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
  if (isLoggedIn) {
    router.push("/dashboard");
  }
}, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setIsLoggedIn(true);
    } catch (err: any) {
      setError(err.message || 'Login error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-white">
      <div className="flex w-full h-full">
        
        {/* Left Side - Visual/Image Area */}
        <div className="hidden md:flex w-[380px] bg-blue-600 flex-col justify-between p-12 text-white">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
             {/* Abstract decorative circles */}
             <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full border-[60px] border-white/20"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-white/20 blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-0 mb-6">
              <Image
                        src="/logo.png"
                        alt="AGS Student Council Logo"
                        width={40}
                        height={40}
                        className="mr-3"
                      />
              <span className="text-xl font-bold tracking-tight">AGS Student Council</span>
            </div>
            
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Freshly faced. <br/> Fluid experience.
            </h1>
            <p className="text-blue-100 text-lg opacity-90 max-w-sm">
              An all new experience for a secure and reliable student council organization system for task management and event coordination.
            </p>
          </div>

          <div className="relative z-10 text-sm text-blue-200">
            Made by SMAK Penabur Gading Serpong Student Council &nbsp;
            <ArrowRightIcon className="inline-block w-4 h-4 ml-" />
          </div>

          
        </div>

        

        {/* Right Side - Form Area */}
       <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            
            <div className="text-center md:text-left mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Start working.</h2>
              <p className="text-gray-500">Please enter your active council member credentials to sign in as provided by admin.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selector removed */}

              {/* Username Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input 
                    type="text"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 flex items-center gap-2 animate-pulse">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <a
  href="https://api.whatsapp.com/send/?phone=6285161287729&text&type=phone_number&app_absent=0"
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 hover:underline"
>
  Contact admin
</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}