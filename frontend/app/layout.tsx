import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/AuthContext'; // Phase II Auth Provider
import { Toaster } from '@/components/ui/toaster'; // For Auth notifications

// Define a fallback font configuration to avoid Turbopack issues with next/font/google
const inter = { className: 'font-sans' };

export const metadata: Metadata = {
  title: 'BetterTasks - AI-Powered Todo Platform',
  description: 'A modern, secure, and animated task management platform',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased`}>
        {/* AuthProvider must wrap everything for JWT flow */}
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark" // Always default to dark for tech aesthetic
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="relative min-h-screen flex flex-col">
              {/* Navbar removed from here to prevent overlap with Dashboard Sidebar */}
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}