'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Prescription {
  id: string;
  date: string;
  medications: string[];
  instructions: string;
  doctor: string;
  patientName?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load prescriptions from localStorage
    const loadPrescriptions = () => {
      const savedPrescriptions = localStorage.getItem('prescriptions');
      if (savedPrescriptions) {
        const parsedPrescriptions = JSON.parse(savedPrescriptions);
        // Ensure all prescriptions have the correct status type
        const typedPrescriptions = parsedPrescriptions.map((p: any) => ({
          ...p,
          status: p.status as 'pending' | 'approved' | 'rejected'
        }));
        setPrescriptions(typedPrescriptions);
      }
      setLoading(false);
    };

    loadPrescriptions();
  }, []);

  const handleApprove = (id: string) => {
    const updatedPrescriptions = prescriptions.map(prescription => {
      if (prescription.id === id) {
        return { ...prescription, status: 'approved' as const };
      }
      return prescription;
    });
    setPrescriptions(updatedPrescriptions);
    localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
  };

  const handleReject = (id: string) => {
    const updatedPrescriptions = prescriptions.map(prescription => {
      if (prescription.id === id) {
        return { ...prescription, status: 'rejected' as const };
      }
      return prescription;
    });
    setPrescriptions(updatedPrescriptions);
    localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <div className="flex space-x-4">
            <Link href="/doctor/dashboard" className="text-blue-600 hover:text-blue-800">
              Back to Dashboard
            </Link>
            <Link href="/ai-health" className="text-green-600 hover:text-green-800">
              AI Health Assistant
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="space-y-6">
              {prescriptions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No prescriptions found</p>
                  <Link href="/ai-health" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                    Generate a new prescription with AI
                  </Link>
                </div>
              ) : (
                prescriptions.map((prescription) => (
                  <div key={prescription.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">Prescription #{prescription.id}</h3>
                        <p className="text-sm text-gray-500">{new Date(prescription.date).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          prescription.status === 'approved' ? 'bg-green-100 text-green-800' :
                          prescription.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Medications</h4>
                      <ul className="list-disc list-inside mt-2">
                        {prescription.medications.map((medication, index) => (
                          <li key={index} className="text-gray-600">{medication}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Instructions</h4>
                      <p className="mt-2 text-gray-600">{prescription.instructions}</p>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Prescribed by</h4>
                      <p className="mt-2 text-gray-600">{prescription.doctor}</p>
                    </div>

                    {prescription.status === 'pending' && (
                      <div className="mt-6 flex space-x-4">
                        <button
                          onClick={() => handleApprove(prescription.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(prescription.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 