'use client';

import { useEffect, useState } from 'react';
import { blynkService } from '../../lib/blynk/service';
import { blynkConfig } from '../../lib/blynk/config';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
    formatTemperature,
    formatHeartRate, 
    formatBloodPressure, 
    formatSpO2,
    cn
} from '@/lib/utils';
import VitalsDisplay from './VitalsDisplay';

interface IoTData {
    temperature: number;
    heartRate: number;
    bloodPressure: {
        systolic: number;
        diastolic: number;
    };
    spo2: number;
}

interface HistoricalData {
    heartRate: number[];
    bloodPressure: {
        systolic: number[];
        diastolic: number[];
    };
    spo2: number[];
    pulse: number[];
    labels: string[];
}

interface RecentReadings {
    temperature: number[];
    heartRate: number[];
    bloodPressure: {
        systolic: number[];
        diastolic: number[];
    };
    spo2: number[];
}

interface RecentAvgReadings {
    temperature: number;
    heartRate: number;
    bloodPressure: {
        systolic: number;
        diastolic: number;
    };
    spo2: number;
}

export function IoTDeviceData() {
    const [data, setData] = useState<IoTData>({
        temperature: 0,
        heartRate: 0,
        bloodPressure: { systolic: 0, diastolic: 0 },
        spo2: 0
    });

    const [historicalData, setHistoricalData] = useState<HistoricalData>({
        heartRate: [],
        bloodPressure: { systolic: [], diastolic: [] },
        spo2: [],
        pulse: [],
        labels: []
    });

    const [recentReadings, setRecentReadings] = useState<RecentReadings>({
        temperature: [],
        heartRate: [],
        bloodPressure: { systolic: [], diastolic: [] },
        spo2: []
    });

    const calculateAverage = (values: number[]): number => {
        if (values.length === 0) return 0;
        const sum = values.reduce((acc, curr) => acc + curr, 0);
        return sum / values.length;
    };

    useEffect(() => {
        // Set up interval to read data from Blynk
        const interval = setInterval(async () => {
            try {
                // Read all virtual pins
                const [temp, heartRate, bloodPressure, spo2] = await Promise.all([
                    blynkService.readVirtualPin(blynkConfig.virtualPins.TEMPERATURE),
                    blynkService.readVirtualPin(blynkConfig.virtualPins.HEART_RATE),
                    blynkService.readVirtualPin(blynkConfig.virtualPins.BLOOD_PRESSURE),
                    blynkService.readVirtualPin(blynkConfig.virtualPins.SPO2)
                ]);

                // Parse and update data
                const newData: IoTData = {
                    temperature: temp ? parseFloat(temp) : 37,
                    heartRate: heartRate ? parseFloat(heartRate) : 0,
                    bloodPressure: bloodPressure ? {
                        systolic: parseFloat(bloodPressure.split('/')[0]),
                        diastolic: parseFloat(bloodPressure.split('/')[1])
                    } : { systolic: 0, diastolic: 0 },
                    spo2: spo2 ? parseFloat(spo2) : 0
                };

                console.log('Received data:', newData); // Debug log

                setData(newData);
// Update recent readings
setRecentReadings(prev => {
    const newReadings = { ...prev };
    
    // Add new readings
    newReadings.temperature.push(newData.temperature);
    newReadings.heartRate.push(newData.heartRate);
    newReadings.bloodPressure.systolic.push(newData.bloodPressure.systolic);
    newReadings.bloodPressure.diastolic.push(newData.bloodPressure.diastolic);
    newReadings.spo2.push(newData.spo2);

    // Keep only last 5 readings
    if (newReadings.temperature.length > 5) {
        newReadings.temperature.shift();
        newReadings.heartRate.shift();
        newReadings.bloodPressure.systolic.shift();
        newReadings.bloodPressure.diastolic.shift();
        newReadings.spo2.shift();
    }

    return newReadings;
});

const averageData: IoTData = {
    temperature: calculateAverage(recentReadings.temperature),
    heartRate: calculateAverage(recentReadings.heartRate),
    bloodPressure: {
        systolic: calculateAverage(recentReadings.bloodPressure.systolic),
        diastolic: calculateAverage(recentReadings.bloodPressure.diastolic)
    },
    spo2: calculateAverage(recentReadings.spo2)
};

setData(averageData);


                // Update historical data
                const now = new Date();
                const timeLabel = `${now.getHours()}:${now.getMinutes()}`;
                
                setHistoricalData(prev => {
                    const newHistoricalData = { ...prev };
                    
                    // Keep only last 7 data points
                    if (newHistoricalData.heartRate.length >= 7) {
                        newHistoricalData.heartRate.shift();
                        newHistoricalData.bloodPressure.systolic.shift();
                        newHistoricalData.bloodPressure.diastolic.shift();
                        newHistoricalData.spo2.shift();
                        newHistoricalData.pulse.shift();
                        newHistoricalData.labels.shift();
                    }

                    // Add new data points
                    newHistoricalData.heartRate.push(newData.heartRate);
                    newHistoricalData.bloodPressure.systolic.push(newData.bloodPressure.systolic);
                    newHistoricalData.bloodPressure.diastolic.push(newData.bloodPressure.diastolic);
                    newHistoricalData.spo2.push(newData.spo2);
                    newHistoricalData.pulse.push(newData.heartRate);
                    newHistoricalData.labels.push(timeLabel);

                    return newHistoricalData;
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []); // Remove data dependency to prevent infinite loop

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Temperature</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatTemperature(data.temperature)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            Raw value: {data.temperature}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Heart Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatHeartRate(data.heartRate)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Blood Pressure</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatBloodPressure(data.bloodPressure.systolic, data.bloodPressure.diastolic)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>SpO2</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatSpO2(data.spo2)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <VitalsDisplay {...historicalData} />
        </div>
    );
} 