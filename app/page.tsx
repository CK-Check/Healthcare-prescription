'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [role, setRole] = useState<'doctor' | 'patient'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    const response = await fetch('/api/login', {
      method: 'GET',
    });
    
    if (role === 'doctor') {
      router.push('/doctor/dashboard');
    } else {
      router.push('/patient/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-4xl font-extrabold text-blue-600">
            HealthOrbit
          </h1>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-3">
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`px-4 py-2 rounded-md ${
                  role === 'patient'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`px-4 py-2 rounded-md ${
                  role === 'doctor'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Doctor
              </button>
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <p>
            Don't have an account?{' '}
            <Link href="/patient/signup" className="font-medium text-blue-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>
        {/* <Image src="/images/login_pic.png" fill={true} alt="Login"/> */}
      </div>
    </div>
  );
} 