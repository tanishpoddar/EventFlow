import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { AuthProvider } from '@/components/auth/auth-context'; // Import AuthProvider
import { Toaster } from "@/components/ui/toaster"; // Import Toaster


export const metadata: Metadata = {
  title: 'EventFlow',
  description: 'Manage and attend events seamlessly',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <AuthProvider> {/* Wrap with AuthProvider */}
          {children}
          <Toaster /> {/* Add Toaster for notifications */}
        </AuthProvider>
      </body>
    </html>
  );
}
