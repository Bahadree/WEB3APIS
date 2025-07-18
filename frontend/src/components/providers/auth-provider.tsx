'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { getApiUrl } from '@/utils/getApiUrl'

interface User {
  id: string
  email: string
  username: string
  fullName?: string
  avatarUrl?: string
  isVerified: boolean
  wallets?: Array<{
    walletAddress: string
    walletType: string
    isPrimary: boolean
    isVerified: boolean
  }>
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (identifier: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  walletAuth: (data: WalletAuthData) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

interface RegisterData {
  email: string
  username: string
  password: string
  fullName?: string
  dateOfBirth?: string
  gdprConsent: boolean
  termsConsent: boolean
  privacyConsent: boolean
}

interface WalletAuthData {
  message: string
  signature: string
  walletAddress: string
  walletType: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  // Token ekleme işlemini sadece tarayıcıda ve component içinde yap
  useEffect(() => {
    axios.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        fetchUser();
      } else {
        setIsLoading(false);
      }
    }
  }, [])

  const fetchUser = async () => {
    try {
      let token = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('accessToken');
      }
      const response = await axios.get(getEndpoint('/auth/me'), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } finally {
      setIsLoading(false);
    }
  }

  // API endpoint helper
  const getEndpoint = (path: string) => {
    if (process.env.NODE_ENV === 'production') {
      return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
    }
    return `/api${path}`;
  };

  const login = async (identifier: string, password: string) => {
    try {
      const endpoint = getEndpoint('/auth/login');
      const response = await axios.post(endpoint, { identifier, password });
      const { user, tokens } = response.data.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      setUser(user);
      toast.success('Successfully logged in!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const endpoint = getEndpoint('/auth/register');
      const response = await axios.post(endpoint, data);
      const { user, tokens } = response.data.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      setUser(user);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const walletAuth = async (data: WalletAuthData) => {
    try {
      const endpoint = getEndpoint('/auth/wallet-auth');
      const response = await axios.post(endpoint, data);
      const { user, tokens } = response.data.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      setUser(user);
      toast.success('Wallet connected successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Wallet authentication failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    toast.success('Logged out successfully')
    router.push('/')
  }

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');
    try {
      const endpoint = getEndpoint('/auth/refresh-token');
      const response = await axios.post(endpoint, { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      throw error;
    }
  }

  // Google Auth giriş fonksiyonu
  const googleLogin = () => {
    // Her zaman geçerli bir redirect_uri gönder
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    let backendUrl = '';
    if (process.env.NODE_ENV === 'production') {
      backendUrl = process.env.NEXT_PUBLIC_API_URL || '';
    }
    // Backend'e redirect_uri parametresi ile yönlendir
    window.location.href = `${backendUrl}/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    walletAuth,
    logout,
    refreshToken,
    googleLogin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
