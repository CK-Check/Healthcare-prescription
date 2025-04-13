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

interface IoTData {
  temperature: number;
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  spo2: number;
}

export default function AIHealthPage() {
  const [prediction, setPrediction] = useState<HealthPrediction | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [model, setModel] = useState<HealthPredictionModel | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVitals, setCurrentVitals] = useState<IoTData | null>(null);
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

  // Check for Blynk data updates
  useEffect(() => {
    const checkBlynkData = () => {
      const vitalsData = localStorage.getItem('currentVitals');
      if (vitalsData) {
        setCurrentVitals(JSON.parse(vitalsData));
      }
    };

    // Check immediately
    checkBlynkData();

    // Set up interval to check for updates
    const interval = setInterval(checkBlynkData, 5000);

    return () => clearInterval(interval);
  }, []);

  const predictHealth = async () => {
    if (!model || isModelLoading) {
      setError('Model is still loading. Please wait...');
      return;
    }

    if (!currentVitals) {
      setError('No vital signs data available from Blynk. Please wait for data...');
      return;
    }

    try {
      const prediction = model.predict({
        heartRate: currentVitals.heartRate,
        bloodPressure: currentVitals.bloodPressure.systolic,
        temperature: currentVitals.temperature,
        spo2: currentVitals.spo2,
        symptoms: 0 // We'll add symptoms later if needed
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
          <h1 className="text-3xl font-bold text-blue-600">AI Health Assistant</h1>
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
            {/* Current Vitals Display */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Current Vitals from Blynk</h2>
              {currentVitals ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="text-lg font-semibold">{currentVitals.temperature}°C</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Heart Rate</p>
                    <p className="text-lg font-semibold">{currentVitals.heartRate} BPM</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Blood Pressure</p>
                    <p className="text-lg font-semibold">
                      {currentVitals.bloodPressure.systolic}/{currentVitals.bloodPressure.diastolic} mmHg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">SpO2</p>
                    <p className="text-lg font-semibold">{currentVitals.spo2}%</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Waiting for Blynk data...</p>
              )}
              <button
                onClick={predictHealth}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                disabled={!currentVitals}
              >
                Analyze Health
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
              <div className="h-64 overflow-y-auto mb-4 border rounded-lg p-4">
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