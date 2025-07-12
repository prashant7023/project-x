import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import DevWarningSupressor from '@/components/DevWarningSupressor';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dashboard App',
  description: 'A modern dashboard application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          defaultTheme="system"
          storageKey="dashboard-theme"
        >
          <DevWarningSupressor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
