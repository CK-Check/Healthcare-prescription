import * as tf from '@tensorflow/tfjs';

// Define the model architecture
const createModel = () => {
  const model = tf.sequential();
  
  // Input layer
  model.add(tf.layers.dense({
    units: 64,
    activation: 'relu',
    inputShape: [5] // [heartRate, bloodPressure, temperature, spo2, symptoms]
  }));
  
  // Hidden layers
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
  
  // Output layer
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
  
  // Compile the model
  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });
  
  return model;
};

// Normalize input data
const normalizeData = (data: number[]) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return data.map(x => (x - min) / (max - min));
};

// Health conditions mapping
const conditions = [
  'Normal',
  'Potential Respiratory Infection',
  'Cardiovascular Concern',
  'Fever',
  'Hypoxia'
];

export class HealthPredictionModel {
  private model: tf.Sequential;
  private isTrained: boolean = false;

  constructor() {
    this.model = createModel();
  }

  async train(trainingData: number[][], labels: number[]) {
    const normalizedData = trainingData.map(normalizeData);
    const xs = tf.tensor2d(normalizedData);
    const ys = tf.tensor1d(labels);

    await this.model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
        }
      }
    });

    this.isTrained = true;
    xs.dispose();
    ys.dispose();
  }

  predict(vitals: {
    heartRate: number;
    bloodPressure: number;
    temperature: number;
    spo2: number;
    symptoms: number;
  }) {
    if (!this.isTrained) {
      throw new Error('Model needs to be trained before making predictions');
    }

    const input = normalizeData([
      vitals.heartRate,
      vitals.bloodPressure,
      vitals.temperature,
      vitals.spo2,
      vitals.symptoms
    ]);

    const prediction = this.model.predict(tf.tensor2d([input])) as tf.Tensor;
    const result = prediction.dataSync()[0];
    prediction.dispose();

    return {
      condition: conditions[Math.floor(result * (conditions.length - 1))],
      probability: result,
      recommendations: this.generateRecommendations(result)
    };
  }

  private generateRecommendations(probability: number): string[] {
    const recommendations = [
      'Monitor your condition closely',
      'Stay hydrated and get adequate rest',
      'Take prescribed medications as directed',
      'Maintain a healthy diet',
      'Exercise regularly as tolerated',
      'Keep track of your symptoms',
      'Follow up with your healthcare provider',
      'Practice good hygiene',
      'Get plenty of sleep',
      'Avoid strenuous activities'
    ];

    // Return more recommendations for higher probability of issues
    const numRecommendations = Math.ceil(probability * 5) + 2;
    return recommendations.slice(0, numRecommendations);
  }
}

// Example training data
export const trainingData = [
  [72, 120, 36.5, 98, 0], // Normal
  [85, 130, 37.8, 95, 1], // Mild respiratory
  [95, 140, 38.5, 92, 2], // Moderate respiratory
  [110, 150, 39.2, 90, 3], // Severe respiratory
  [65, 110, 36.2, 99, 0], // Normal
  [80, 125, 37.5, 96, 1], // Mild respiratory
  [90, 135, 38.2, 93, 2], // Moderate respiratory
  [100, 145, 39.0, 91, 3], // Severe respiratory
];

export const trainingLabels = [0, 0.25, 0.5, 0.75, 0, 0.25, 0.5, 0.75]; 