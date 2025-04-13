import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HealthOrbit',
  description: 'Healthcare Management System - Your Digital Health Companion',
  keywords: ['healthcare', 'medical', 'prescription', 'telemedicine'],
  authors: [{ name: 'HealthOrbit Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <main className="flex min-h-screen flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
