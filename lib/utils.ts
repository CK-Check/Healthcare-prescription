import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// IoT Data Utilities
export function formatBloodPressure(systolic: number, diastolic: number): string {
  return `${systolic}/${diastolic} mmHg`
}

export function formatTemperature(temp: number): string {
  return `${temp.toFixed(1)}°C`
}

export function formatHeartRate(rate: number): string {
  return `${rate} BPM`
}

export function formatSpO2(spo2: number): string {
  return `${spo2}%`
}

