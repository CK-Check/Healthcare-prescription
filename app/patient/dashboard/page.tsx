'use client';

import { useState } from 'react';
import VitalsDisplay from '../../components/patient/VitalsDisplay';
import { useRouter } from 'next/navigation';

// Mock data - replace with actual API calls
const mockData = {
  patientInfo: {
    name: 'Kaylene Pavard',
    age: 39,
    gender: 'Male',
    bloodGroup: 'AB+ (ve)',
  },
  vitals: {
    heartRate: [72, 75, 68, 70, 73, 75, 71],
    bloodPressure: {
      systolic: [130, 128, 125, 130, 128, 130, 127],
      diastolic: [80, 82, 78, 80, 79, 81, 80],
    },
    spo2: [98, 97, 98, 99, 97, 98, 98],
    pulse: [72, 75, 70, 73, 71, 74, 72],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  prescriptions: [
    {
      date: '2024-02-26',
      doctor: 'Dr. Alison',
      medications: [
        'Amoxicillin 500mg - 3 times daily',
        'Ibuprofen 400mg - as needed for pain',
      ],
      notes: 'Take with food. Complete full course of antibiotics.',
    },
    {
      date: '2024-02-20',
      doctor: 'Dr. Matric',
      medications: ['Loratadine 10mg - once daily'],
      notes: 'Take for allergies as needed.',
    },
  ],
};

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState<'vitals' | 'prescriptions'>('vitals');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/ai-health')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                AI Health Assistant
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="text-lg font-semibold">{mockData.patientInfo.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Patient Info Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-semibold">{mockData.patientInfo.age}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-semibold">{mockData.patientInfo.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Blood Group</p>
              <p className="font-semibold">{mockData.patientInfo.bloodGroup}</p>
            </div>
          </div>
        </div>

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
          <VitalsDisplay {...mockData.vitals} />
        ) : (
          <div className="space-y-6">
            {mockData.prescriptions.map((prescription, index) => (
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