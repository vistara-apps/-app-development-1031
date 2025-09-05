import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LegalShield AI - Navigate legal encounters with confidence',
  description: 'Your rights, in your pocket. Instant legal guidance for police interactions.',
  keywords: ['legal rights', 'police interactions', 'constitutional rights', 'legal advice', 'emergency'],
  authors: [{ name: 'LegalShield AI Team' }],
  creator: 'LegalShield AI',
  publisher: 'LegalShield AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://legalshield-ai.vercel.app'),
  openGraph: {
    title: 'LegalShield AI',
    description: 'Navigate legal encounters with confidence. Your rights, in your pocket.',
    url: 'https://legalshield-ai.vercel.app',
    siteName: 'LegalShield AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LegalShield AI - Your rights, in your pocket',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LegalShield AI',
    description: 'Navigate legal encounters with confidence. Your rights, in your pocket.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div className="min-h-full bg-bg">
          {children}
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'white',
              color: 'hsl(210, 30%, 8%)',
              border: '1px solid hsl(210, 30%, 90%)',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: 'hsl(130, 70%, 45%)',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: 'hsl(0, 80%, 50%)',
                secondary: 'white',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
