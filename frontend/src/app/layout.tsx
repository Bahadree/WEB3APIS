import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Web3Provider } from '@/components/providers/web3-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from '@/components/providers/language-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Web3APIs - Modern Gaming Platform',
  description: 'Connect your games to Web3. Manage NFTs, earnings, and player authentication with our comprehensive gaming platform.',
  keywords: ['web3', 'gaming', 'nft', 'blockchain', 'apis', 'oauth', 'authentication'],
  authors: [{ name: 'Web3APIs Team' }],
  openGraph: {
    title: 'Web3APIs - Modern Gaming Platform',
    description: 'Connect your games to Web3. Manage NFTs, earnings, and player authentication.',
    type: 'website',
    url: 'https://web3apis.com',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Web3APIs Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web3APIs - Modern Gaming Platform',
    description: 'Connect your games to Web3. Manage NFTs, earnings, and player authentication.',
    images: ['/images/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Web3Provider>
              <AuthProvider>
                <LanguageProvider>
                  {children}
                </LanguageProvider>
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'hsl(var(--card))',
                      color: 'hsl(var(--card-foreground))',
                      border: '1px solid hsl(var(--border))',
                    },
                  }}
                />
              </AuthProvider>
            </Web3Provider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
