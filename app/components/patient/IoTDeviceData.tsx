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

    useEffect(() => {
        // Set up interval to read data from Blynk
        const interval = setInterval(() => {
            blynkService.readVirtualPin(blynkConfig.virtualPins.TEMPERATURE);
            blynkService.readVirtualPin(blynkConfig.virtualPins.HEART_RATE);
            blynkService.readVirtualPin(blynkConfig.virtualPins.BLOOD_PRESSURE);
            blynkService.readVirtualPin(blynkConfig.virtualPins.SPO2);

            // Update historical data
            const now = new Date();
            const timeLabel = `${now.getHours()}:${now.getMinutes()}`;
            
            setHistoricalData(prev => {
                const newData = { ...prev };
                
                // Keep only last 7 data points
                if (newData.heartRate.length >= 7) {
                    newData.heartRate.shift();
                    newData.bloodPressure.systolic.shift();
                    newData.bloodPressure.diastolic.shift();
                    newData.spo2.shift();
                    newData.pulse.shift();
                    newData.labels.shift();
                }

                // Add new data points
                newData.heartRate.push(data.heartRate);
                newData.bloodPressure.systolic.push(data.bloodPressure.systolic);
                newData.bloodPressure.diastolic.push(data.bloodPressure.diastolic);
                newData.spo2.push(data.spo2);
                newData.pulse.push(data.heartRate); // Using heart rate as pulse
                newData.labels.push(timeLabel);

                return newData;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [data]);

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