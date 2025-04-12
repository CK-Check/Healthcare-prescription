'use client';

import React, { useState } from 'react';
import VitalsDisplay from '../../components/patient/VitalsDisplay';

// Mock data - replace with actual API calls
const mockData = {
  doctorInfo: {
    name: 'Dr. Alison',
    specialty: 'General Physician',
    patients: [
      {
        id: 1,
        name: 'Kaylene Pavard',
        age: 39,
        lastVisit: '2024-02-26',
        condition: 'Heart Disease',
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
      },
      // Add more patients as needed
    ],
  },
};

export default function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(mockData.doctorInfo.patients[0]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome,</p>
              <p className="text-lg font-semibold">{mockData.doctorInfo.name}</p>
              <p className="text-sm text-gray-500">{mockData.doctorInfo.specialty}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Patients</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {mockData.doctorInfo.patients.map((patient) => (
                  <li
                    key={patient.id}
                    className={`cursor-pointer p-4 hover:bg-gray-50 ${
                      selectedPatient.id === patient.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-500">Age: {patient.age}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Last Visit</p>
                        <p className="text-sm text-gray-900">{patient.lastVisit}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Condition: {patient.condition}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Patient Details and Vitals */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedPatient.name}
                </h2>
                <p className="text-gray-500">
                  Patient ID: {selectedPatient.id} | Age: {selectedPatient.age}
                </p>
              </div>
              <VitalsDisplay {...selectedPatient.vitals} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 