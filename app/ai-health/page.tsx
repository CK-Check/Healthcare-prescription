'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HealthPredictionModel, trainingData, trainingLabels } from '../lib/healthModel';
import Link from 'next/link';

interface HealthPrediction {
  condition: string;
  probability: number;
  recommendations: string[];
}

interface Prescription {
  id: string;
  date: string;
  medications: string[];
  instructions: string;
  doctor: string;
}

export default function AIHealthPage() {
  const [vitals, setVitals] = useState({
    heartRate: '',
    bloodPressure: '',
    temperature: '',
    spo2: '',
    symptoms: '',
  });
  const [prediction, setPrediction] = useState<HealthPrediction | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [model, setModel] = useState<HealthPredictionModel | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeModel = async () => {
      try {
        const healthModel = new HealthPredictionModel();
        await healthModel.train(trainingData, trainingLabels);
        setModel(healthModel);
        setIsModelLoading(false);
      } catch (err) {
        setError('Failed to initialize AI model. Please try again later.');
        console.error('Model initialization error:', err);
      }
    };

    initializeModel();
  }, []);

  const predictHealth = async () => {
    if (!model || isModelLoading) {
      setError('Model is still loading. Please wait...');
      return;
    }

    try {
      // Validate inputs
      if (!vitals.heartRate || !vitals.bloodPressure || !vitals.temperature || !vitals.spo2) {
        setError('Please fill in all vital signs');
        return;
      }

      const bloodPressure = vitals.bloodPressure.split('/').map(Number);
      if (bloodPressure.length !== 2 || isNaN(bloodPressure[0]) || isNaN(bloodPressure[1])) {
        setError('Please enter blood pressure in the format "systolic/diastolic"');
        return;
      }

      const prediction = model.predict({
        heartRate: parseFloat(vitals.heartRate),
        bloodPressure: bloodPressure[0], // Use systolic pressure
        temperature: parseFloat(vitals.temperature),
        spo2: parseFloat(vitals.spo2),
        symptoms: vitals.symptoms.split(',').length
      });

      setPrediction(prediction);
      setError(null);
    } catch (error) {
      console.error('Prediction error:', error);
      setError('Error making prediction. Please check your input values.');
    }
  };

  const generatePrescription = async () => {
    if (!prediction) {
      setError('Please analyze health first to generate a prescription');
      return;
    }

    const newPrescription: Prescription = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      medications: getMedicationsForCondition(prediction.condition),
      instructions: `Take medications as prescribed. Follow up in 7 days. ${prediction.recommendations.join(' ')}`,
      doctor: 'AI Assistant',
    };
    setPrescriptions([...prescriptions, newPrescription]);
    
    // Redirect to prescriptions page
    router.push('/doctor/prescriptions');
  };

  const getMedicationsForCondition = (condition: string): string[] => {
    switch (condition) {
      case 'Potential Respiratory Infection':
        return ['Amoxicillin 500mg - 3 times daily', 'Ibuprofen 400mg - as needed for pain'];
      case 'Cardiovascular Concern':
        return ['Aspirin 81mg - once daily', 'Lisinopril 10mg - once daily'];
      case 'Fever':
        return ['Acetaminophen 500mg - every 6 hours as needed'];
      case 'Hypoxia':
        return ['Supplemental Oxygen as needed', 'Albuterol inhaler - 2 puffs every 4 hours'];
      default:
        return ['No specific medications recommended'];
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    // Add user message to chat history
    setChatHistory([...chatHistory, { role: 'user', content: chatMessage }]);

    // Generate AI response based on prediction and chat history
    let aiResponse = '';
    if (prediction) {
      aiResponse = `Based on your symptoms and vitals, I recommend:
      1. ${prediction.recommendations[0]}
      2. ${prediction.recommendations[1]}
      3. ${prediction.recommendations[2]}

      Your current condition: ${prediction.condition}
      Probability: ${Math.round(prediction.probability * 100)}%`;
    } else {
      aiResponse = 'Please analyze your health first to get personalized recommendations.';
    }

    setChatHistory([
      ...chatHistory,
      { role: 'user', content: chatMessage },
      { role: 'assistant', content: aiResponse }
    ]);
    setChatMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Health Assistant</h1>
          <div className="flex space-x-4">
            <Link href="/doctor/dashboard" className="text-blue-600 hover:text-blue-800">
              Back to Dashboard
            </Link>
            <Link href="/doctor/prescriptions" className="text-green-600 hover:text-green-800">
              View Prescriptions
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isModelLoading ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Initializing AI model...</p>
          </div>
        ) : (
          <>
            {/* Vitals Input Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Enter Your Vitals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Heart Rate (BPM)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                    placeholder="e.g., 72"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Blood Pressure (mmHg)</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={vitals.bloodPressure}
                    onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                    placeholder="e.g., 120/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={vitals.temperature}
                    onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                    placeholder="e.g., 36.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SpO2 (%)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={vitals.spo2}
                    onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                    placeholder="e.g., 98"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Symptoms (comma-separated)</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  value={vitals.symptoms}
                  onChange={(e) => setVitals({ ...vitals, symptoms: e.target.value })}
                  placeholder="e.g., fever, cough, headache"
                />
              </div>
              <button
                onClick={predictHealth}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                disabled={isModelLoading}
              >
                {isModelLoading ? 'Analyzing...' : 'Analyze Health'}
              </button>
            </div>

            {/* Health Prediction Section */}
            {prediction && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Health Prediction</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Condition</h3>
                    <p className="text-lg">{prediction.condition}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Probability</h3>
                    <p className="text-lg">{Math.round(prediction.probability * 100)}%</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Recommendations</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {prediction.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Interface */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">AI Health Assistant Chat</h2>
              <div className="h-96 overflow-y-auto mb-4 border rounded-lg p-4">
                {chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ask about your health..."
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Send
                </button>
              </form>
            </div>

            {/* Prescriptions Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Prescriptions</h2>
                <button
                  onClick={generatePrescription}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  disabled={!prediction}
                >
                  Generate Prescription
                </button>
              </div>
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Prescription #{prescription.id}</h3>
                        <p className="text-sm text-gray-500">{prescription.date}</p>
                      </div>
                      <p className="text-sm text-gray-500">By: {prescription.doctor}</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Medications</h4>
                      <ul className="list-disc list-inside mt-2">
                        {prescription.medications.map((med, index) => (
                          <li key={index}>{med}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Instructions</h4>
                      <p className="mt-2">{prescription.instructions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 