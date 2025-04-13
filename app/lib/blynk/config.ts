export const blynkConfig = {
    authToken: process.env.BLYNK_AUTH_TOKEN || 'Q-LlybKxVBiCeoZfVPOxO66yH-FgoVlU',
    server: process.env.BLYNK_SERVER || 'blr1.blynk.cloud',
    virtualPins: {
        TEMPERATURE: 'V0',
        HEART_RATE: 'V2',
        BLOOD_PRESSURE: 'V3',
        SPO2: 'V4'
    },
    apiEndpoints: {
        get: (pin: string) => `https://${blynkConfig.server}/external/api/get?token=${blynkConfig.authToken}&${pin}`,
        update: (pin: string, value: string | number) => `https://${blynkConfig.server}/external/api/update?token=${blynkConfig.authToken}&${pin}=${value}`
    }
}; 