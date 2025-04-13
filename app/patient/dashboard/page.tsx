'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoTDeviceData } from '../../components/patient/IoTDeviceData';

// Mock data for patient information
const mockPatientData = {
  name: 'Chetan',
  prescriptions: [
    {
      doctor: 'Dr. Smith',
      date: '2024-04-10',
      medications: [
        'Metformin 500mg - Twice daily',
        'Lisinopril 10mg - Once daily'
      ],
      notes: 'Take with food. Monitor blood pressure regularly.'
    },
    {
      doctor: 'Dr. Johnson',
      date: '2024-04-05',
      medications: [
        'Atorvastatin 20mg - Once daily at bedtime'
      ],
      notes: 'Continue medication as prescribed. Follow up in 3 months.'
    }
  ]
};

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState<'vitals' | 'prescriptions'>('vitals');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-600">Patient Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/ai-health')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                AI Health Assistant
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="text-lg font-semibold">{mockPatientData.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Patient Info Card */}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('vitals')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vitals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vitals
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'prescriptions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Prescriptions
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'vitals' ? (
          <IoTDeviceData />
        ) : (
          <div className="space-y-6">
            {mockPatientData.prescriptions.map((prescription, index) => (
              <div key={index} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {prescription.doctor}
                    </h3>
                    <p className="text-sm text-gray-500">{prescription.date}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Medications
                    </h4>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      {prescription.medications.map((med, idx) => (
                        <li key={idx} className="text-gray-700">
                          {med}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                    <p className="mt-1 text-gray-700">{prescription.notes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 