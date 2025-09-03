import '@/styles/globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-provider';

export const metadata: Metadata = {
  title: 'FurryFrame - Cat Photo Challenges on Farcaster',
  description: 'Your Farcaster frame for crafting and sharing purrfect cat moments.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

