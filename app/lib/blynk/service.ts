import { blynkConfig } from './config';

class BlynkService {
    private isConnected = false;
    private pollingInterval: NodeJS.Timeout | null = null;
    private pollingIntervalMs = 5000; // Poll every 5 seconds

    constructor() {
        this.startPolling();
    }

    private async fetchVirtualPin(pin: string): Promise<string | null> {
        try {
            const response = await fetch(blynkConfig.apiEndpoints.get(pin));
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.text();
            return data;
        } catch (error) {
            console.error(`Error fetching pin ${pin}:`, error);
            return null;
        }
    }

    private async pollData() {
        try {
            // Fetch all virtual pins
            const [temp, heartRate, bloodPressure, spo2] = await Promise.all([
                this.fetchVirtualPin(blynkConfig.virtualPins.TEMPERATURE),
                this.fetchVirtualPin(blynkConfig.virtualPins.HEART_RATE),
                this.fetchVirtualPin(blynkConfig.virtualPins.BLOOD_PRESSURE),
                this.fetchVirtualPin(blynkConfig.virtualPins.SPO2)
            ]);

            // Process the data
            if (temp !== null) {
                this.handleData(blynkConfig.virtualPins.TEMPERATURE, temp);
            }
            if (heartRate !== null) {
                this.handleData(blynkConfig.virtualPins.HEART_RATE, heartRate);
            }
            if (bloodPressure !== null) {
                this.handleData(blynkConfig.virtualPins.BLOOD_PRESSURE, bloodPressure);
            }
            if (spo2 !== null) {
                this.handleData(blynkConfig.virtualPins.SPO2, spo2);
            }

            this.isConnected = true;
        } catch (error) {
            console.error('Error polling data:', error);
            this.isConnected = false;
        }
    }

    private handleData(pin: string, value: string) {
        // You can add custom data handling here
        console.log(`Received data for pin ${pin}:`, value);
    }

    private startPolling() {
        this.pollingInterval = setInterval(() => {
            this.pollData();
        }, this.pollingIntervalMs);
    }

    public async writeVirtualPin(pin: string, value: string | number) {
        try {
            const response = await fetch(blynkConfig.apiEndpoints.update(pin, value));
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return true;
        } catch (error) {
            console.error(`Error writing to pin ${pin}:`, error);
            return false;
        }
    }

    public async readVirtualPin(pin: string) {
        return this.fetchVirtualPin(pin);
    }

    public disconnect() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
        this.isConnected = false;
    }
}

export const blynkService = new BlynkService(); 