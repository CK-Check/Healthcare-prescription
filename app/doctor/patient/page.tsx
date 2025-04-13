'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { IoTDeviceData } from '../../components/patient/IoTDeviceData';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  lastVisit: string;
  nextAppointment: string;
  status: 'stable' | 'critical' | 'monitoring';
  vitals: {
    heartRate: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    temperature: number;
    spo2: number;
    timestamp: string;
  } | null;
}

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
}

// Hardcoded doctor data
const doctorData: Doctor = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@hospital.com',
  specialty: 'Cardiology'
};

// Hardcoded patient data
const patientsData: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    condition: 'Hypertension',
    lastVisit: '2024-03-15',
    nextAppointment: '2024-04-15',
    status: 'stable',
    vitals: {
      heartRate: 72,
      bloodPressure: {
        systolic: 120,
        diastolic: 80
      },
      temperature: 36.8,
      spo2: 98,
      timestamp: '2024-03-20T10:30:00Z'
    }
  },
  {
    id: '2',
    name: 'Emily Davis',
    age: 32,
    gender: 'Female',
    condition: 'Diabetes Type 2',
    lastVisit: '2024-03-18',
    nextAppointment: '2024-04-18',
    status: 'monitoring',
    vitals: {
      heartRate: 85,
      bloodPressure: {
        systolic: 130,
        diastolic: 85
      },
      temperature: 37.1,
      spo2: 97,
      timestamp: '2024-03-20T11:15:00Z'
    }
  },
  {
    id: '3',
    name: 'Michael Brown',
    age: 58,
    gender: 'Male',
    condition: 'Cardiac Arrhythmia',
    lastVisit: '2024-03-20',
    nextAppointment: '2024-04-20',
    status: 'critical',
    vitals: {
      heartRate: 110,
      bloodPressure: {
        systolic: 145,
        diastolic: 95
      },
      temperature: 37.3,
      spo2: 95,
      timestamp: '2024-03-20T09:45:00Z'
    }
  },
  {
    id: '4',
    name: 'Lisa Wilson',
    age: 29,
    gender: 'Female',
    condition: 'Asthma',
    lastVisit: '2024-03-19',
    nextAppointment: '2024-04-19',
    status: 'stable',
    vitals: {
      heartRate: 78,
      bloodPressure: {
        systolic: 115,
        diastolic: 75
      },
      temperature: 36.9,
      spo2: 99,
      timestamp: '2024-03-20T10:00:00Z'
    }
  },
  {
    id: '5',
    name: 'Robert Taylor',
    age: 62,
    gender: 'Male',
    condition: 'Chronic Heart Failure',
    lastVisit: '2024-03-17',
    nextAppointment: '2024-04-17',
    status: 'monitoring',
    vitals: {
      heartRate: 92,
      bloodPressure: {
        systolic: 140,
        diastolic: 90
      },
      temperature: 37.0,
      spo2: 96,
      timestamp: '2024-03-20T11:30:00Z'
    }
  }
];

export default function DoctorPatientsPage() {
  const [doctor] = useState<Doctor>(doctorData);
  const [patients] = useState<Patient[]>(patientsData);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'bg-green-100 text-green-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'monitoring':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">My Patients</h1>
            <p className="text-gray-600">
              {doctor.name} - {doctor.specialty}
            </p>
          </div>
          <Link
            href="/doctor/dashboard"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patients List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Patient List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedPatient?.id === patient.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-white border border-gray-200'
                      }`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{patient.name}</h3>
                          <p className="text-sm text-gray-600">
                            {patient.age} years • {patient.gender}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            patient.status
                          )}`}
                        >
                          {patient.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Condition: {patient.condition}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Details */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{selectedPatient.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Age</p>
                        <p className="font-medium">{selectedPatient.age} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gender</p>
                        <p className="font-medium">{selectedPatient.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Condition</p>
                        <p className="font-medium">{selectedPatient.condition}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Visit</p>
                        <p className="font-medium">
                          {new Date(selectedPatient.lastVisit).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Next Appointment</p>
                        <p className="font-medium">
                          {new Date(selectedPatient.nextAppointment).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Real-time Vital Signs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <IoTDeviceData />
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-4">
                  <Link
                    href={`/doctor/prescriptions?patientId=${selectedPatient.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    View Prescriptions
                  </Link>
                  <Link
                    href={`/ai-health?patientId=${selectedPatient.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    AI Health Analysis
                  </Link>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-gray-500">Select a patient to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
