import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../providers/AuthProvider';

export const metadata: Metadata = {
  title: 'ServerMG Dashboard',
  description: 'Manage your SaaS hosting platform',
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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
