'use client'

import React from 'react'
import { createConfig, WagmiProvider } from 'wagmi'
import { mainnet, polygon, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injected, metaMask } from 'wagmi/connectors'
import { http } from 'viem'

// Setup queryClient
const queryClient = new QueryClient()

// Create wagmi config with minimal dependencies
const config = createConfig({
  chains: [mainnet, polygon, sepolia],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [sepolia.id]: http(),
  },
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
