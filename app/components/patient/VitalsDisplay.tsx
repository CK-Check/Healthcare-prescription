import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VitalProps {
  heartRate: number[];
  bloodPressure: { systolic: number[]; diastolic: number[] };
  spo2: number[];
  pulse: number[];
  labels: string[];
}

export default function VitalsDisplay({
  heartRate,
  bloodPressure,
  spo2,
  pulse,
  labels,
}: VitalProps) {
  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Heart Rate</h3>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: 'BPM',
                data: heartRate,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
            ],
          }}
          options={commonOptions}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Blood Pressure</h3>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: 'Systolic',
                data: bloodPressure.systolic,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
              {
                label: 'Diastolic',
                data: bloodPressure.diastolic,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
              },
            ],
          }}
          options={commonOptions}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">SpO2</h3>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: 'Percentage',
                data: spo2,
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
              },
            ],
          }}
          options={commonOptions}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Pulse</h3>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: 'BPM',
                data: pulse,
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
              },
            ],
          }}
          options={commonOptions}
        />
      </div>
    </div>
  );
} 