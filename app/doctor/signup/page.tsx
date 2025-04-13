'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DoctorSignup() {
    const [role, setRole] = useState<'doctor' | 'patient'>('doctor');
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        specialization: '',
        licenseNumber: '',
        phoneNumber: '',
        role: 'doctor'
    });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Add role to formData
            const dataToSend = {
                ...formData,
                role: 'doctor' 
            };

            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed'); 
            }

            localStorage.setItem('user', JSON.stringify(data));
            router.push('/doctor/dashboard');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    };

    const handleRoleAndPathChange = (newRole: 'doctor' | 'patient') => {
        setRole(newRole);
        if (newRole === 'doctor') {
            router.push('/doctor/signup');
        } else {
            router.push('/patient/signup');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-600">
                    Doctor Registration
                </h2>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="flex justify-center space-x-4">
                    <button
                        type="button"
                        onClick={() => handleRoleAndPathChange('patient')}
                        className={`px-4 py-2 rounded-md ${
                            role === 'patient' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        Patient
                    </button>
                    <button
                        type="button"
                        onClick={() => handleRoleAndPathChange('doctor')}
                        className={`px-4 py-2 rounded-md ${
                            role === 'doctor' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        Doctor
                    </button>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                                    Specialization
                                </label>
                                <input
                                    type="text"
                                    name="specialization"
                                    id="specialization"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                                    License Number
                                </label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    id="licenseNumber"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Already have an account?{' '}
                                        <Link href="/" className="font-medium text-blue-600 hover:text-indigo-500">
                                            Sign in
                                        </Link>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
