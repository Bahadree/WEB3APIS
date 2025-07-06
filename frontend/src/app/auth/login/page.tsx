'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLanguage } from '@/components/providers/language-provider'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { lang } = useLanguage()
  const [hydratedLang, setHydratedLang] = useState<'en' | 'tr' | 'de' | 'fr' | 'es' | 'ru' | 'zh'>('en')
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setHydratedLang(lang as any)
  }, [lang])

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      toast.success('Giriş başarılı, yönlendiriliyorsunuz...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    }
  }, [searchParams, router])

  type LangKey = 'en' | 'tr' | 'de' | 'fr' | 'es' | 'ru' | 'zh'
  const t: Record<LangKey, {
    welcome: string;
    signIn: string;
    signInDesc: string;
    identifier: string;
    identifierPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    remember: string;
    forgot: string;
    or: string;
    google: string;
    wallet: string;
    noAccount: string;
    signUp: string;
    emailOrUsernameRequired: string;
    passwordRequired: string;
  }> = {
    en: {
      welcome: 'Welcome Back',
      signIn: 'Sign in',
      signInDesc: 'Sign in to your Web3APIs account',
      identifier: 'Email or Username',
      identifierPlaceholder: 'Email or username',
      password: 'Password',
      passwordPlaceholder: 'Password',
      remember: 'Remember me',
      forgot: 'Forgot your password?',
      or: 'Or continue with',
      google: 'Google',
      wallet: '🦊 Wallet',
      noAccount: 
        "Don't have an account? ",
      signUp: 'Sign up',
      emailOrUsernameRequired: 'Email or username is required',
      passwordRequired: 'Password is required',
    },
    tr: {
      welcome: 'Tekrar Hoşgeldiniz',
      signIn: 'Giriş yap',
      signInDesc: 'Web3APIs hesabınıza giriş yapın',
      identifier: 'E-posta veya Kullanıcı Adı',
      identifierPlaceholder: 'E-posta veya kullanıcı adı',
      password: 'Şifre',
      passwordPlaceholder: 'Şifre',
      remember: 'Beni hatırla',
      forgot: 'Şifrenizi mi unuttunuz?',
      or: 'Veya devam et',
      google: 'Google',
      wallet: '🦊 Cüzdan',
      noAccount: 'Hesabınız yok mu? ',
      signUp: 'Kayıt ol',
      emailOrUsernameRequired: 'E-posta veya kullanıcı adı gerekli',
      passwordRequired: 'Şifre gerekli',
    },
    de: {
      welcome: 'Willkommen zurück',
      signIn: 'Anmelden',
      signInDesc: 'Melden Sie sich bei Ihrem Web3APIs-Konto an',
      identifier: 'E-Mail oder Benutzername',
      identifierPlaceholder: 'E-Mail oder Benutzername',
      password: 'Passwort',
      passwordPlaceholder: 'Passwort',
      remember: 'Angemeldet bleiben',
      forgot: 'Passwort vergessen?',
      or: 'Oder weiter mit',
      google: 'Google',
      wallet: '🦊 Wallet',
      noAccount: 'Noch kein Konto? ',
      signUp: 'Registrieren',
      emailOrUsernameRequired: 'E-Mail oder Benutzername erforderlich',
      passwordRequired: 'Passwort erforderlich',
    },
    fr: {
      welcome: 'Bon retour',
      signIn: 'Se connecter',
      signInDesc: 'Connectez-vous à votre compte Web3APIs',
      identifier: 'E-mail ou nom d\'utilisateur',
      identifierPlaceholder: 'E-mail ou nom d\'utilisateur',
      password: 'Mot de passe',
      passwordPlaceholder: 'Mot de passe',
      remember: 'Se souvenir de moi',
      forgot: 'Mot de passe oublié ?',
      or: 'Ou continuer avec',
      google: 'Google',
      wallet: '🦊 Portefeuille',
      noAccount: 'Pas de compte ? ',
      signUp: "S'inscrire",
      emailOrUsernameRequired: 'E-mail ou nom d\'utilisateur requis',
      passwordRequired: 'Mot de passe requis',
    },
    es: {
      welcome: 'Bienvenido de nuevo',
      signIn: 'Iniciar sesión',
      signInDesc: 'Inicia sesión en tu cuenta Web3APIs',
      identifier: 'Correo electrónico o nombre de usuario',
      identifierPlaceholder: 'Correo electrónico o nombre de usuario',
      password: 'Contraseña',
      passwordPlaceholder: 'Contraseña',
      remember: 'Recuérdame',
      forgot: '¿Olvidaste tu contraseña?',
      or: 'O continuar con',
      google: 'Google',
      wallet: '🦊 Billetera',
      noAccount: '¿No tienes una cuenta? ',
      signUp: 'Regístrate',
      emailOrUsernameRequired: 'Correo electrónico o nombre de usuario requerido',
      passwordRequired: 'Contraseña requerida',
    },
    ru: {
      welcome: 'С возвращением',
      signIn: 'Войти',
      signInDesc: 'Войдите в свой аккаунт Web3APIs',
      identifier: 'Эл. почта или имя пользователя',
      identifierPlaceholder: 'Эл. почта или имя пользователя',
      password: 'Пароль',
      passwordPlaceholder: 'Пароль',
      remember: 'Запомнить меня',
      forgot: 'Забыли пароль?',
      or: 'Или продолжить с',
      google: 'Google',
      wallet: '🦊 Кошелек',
      noAccount: 'Нет аккаунта? ',
      signUp: 'Зарегистрироваться',
      emailOrUsernameRequired: 'Требуется эл. почта или имя пользователя',
      passwordRequired: 'Требуется пароль',
    },
    zh: {
      welcome: '欢迎回来',
      signIn: '登录',
      signInDesc: '登录您的 Web3APIs 账户',
      identifier: '邮箱或用户名',
      identifierPlaceholder: '邮箱或用户名',
      password: '密码',
      passwordPlaceholder: '密码',
      remember: '记住我',
      forgot: '忘记密码？',
      or: '或继续使用',
      google: 'Google',
      wallet: '🦊 钱包',
      noAccount: '没有账号？ ',
      signUp: '注册',
      emailOrUsernameRequired: '需要邮箱或用户名',
      passwordRequired: '需要密码',
    },
  }
  const currentT = t[hydratedLang] || t['en']

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      await login(data.identifier, data.password)
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text">{currentT.welcome}</h2>
          <p className="mt-2 text-muted-foreground">
            {currentT.signInDesc}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="sr-only">
                {currentT.identifier}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  {...register('identifier')}
                  type="text"
                  autoComplete="email"
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={currentT.identifierPlaceholder}
                />
              </div>
              {errors.identifier && (
                <p className="mt-1 text-sm text-destructive">
                  {currentT.emailOrUsernameRequired}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                {currentT.password}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="block w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={currentT.passwordPlaceholder}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {currentT.passwordRequired}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                {currentT.remember}
              </label>
            </div>

            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-primary hover:text-primary/80">
                {currentT.forgot}
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                currentT.signIn
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">{currentT.or}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => window.location.href = '/api/auth/google'}
                className="w-full col-span-2 flex justify-center items-center py-2 px-4 border border-border rounded-lg bg-background text-base font-medium text-foreground hover:bg-accent transition-all duration-200"
                style={{ width: '100%' }}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span style={{ flex: 1, textAlign: 'center' }}>{currentT.google} ile Giriş Yap</span>
              </button>

              <button
                type="button"
                onClick={() => window.location.href = '/api/auth/apple'}
                className="w-full col-span-2 flex justify-center items-center py-2 px-4 border border-border rounded-lg bg-background text-base font-medium text-foreground hover:bg-accent transition-all duration-200 mt-2"
                style={{ width: '100%' }}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M16.365 1.43c0 1.14-.93 2.07-2.07 2.07-.04 0-.08 0-.12-.01-.02-.09-.03-.19-.03-.29 0-1.14.93-2.07 2.07-2.07.04 0 .08 0 .12.01.02.09.03.19.03.29zm2.13 4.37c-1.17-.14-2.41.68-3.04.68-.64 0-1.62-.66-2.67-.64-1.37.02-2.64.8-3.34 2.03-1.43 2.48-.37 6.14 1.02 8.15.68.98 1.48 2.08 2.54 2.04 1.03-.04 1.42-.66 2.67-.66 1.25 0 1.6.66 2.67.64 1.1-.02 1.79-1 2.46-1.98.78-1.13 1.1-2.23 1.12-2.29-.02-.01-2.15-.83-2.17-3.29-.02-2.06 1.68-3.04 1.76-3.09-.97-1.41-2.48-1.57-3.01-1.6zm-2.13 13.13c-.01.01-.02.01-.03.01-.09.03-.18.05-.28.05-.1 0-.2-.02-.29-.05-.01 0-.02 0-.03-.01-.09-.03-.18-.07-.26-.13-.08-.06-.15-.13-.21-.21-.06-.08-.1-.17-.13-.26-.03-.09-.05-.18-.05-.28 0-.1.02-.2.05-.29.03-.09.07-.18.13-.26.06-.08.13-.15.21-.21.08-.06.17-.1.26-.13.09-.03.18-.05.28-.05.1 0 .2.02.29.05.09.03.18.07.26.13.08.06.15.13.21.21.06.08.1.17.13.26.03.09.05.18.05.28 0 .1-.02.2-.05.29-.03.09-.07.18-.13.26-.06.08-.13.15-.21.21-.08.06-.17.1-.26.13z"/>
                </svg>
                <span style={{ flex: 1, textAlign: 'center' }}>Apple ile Giriş Yap</span>
              </button>
            </div>
          </div>

          <div className="text-center">
            <span className="text-muted-foreground">{currentT.noAccount}</span>
            <Link href="/auth/register" className="font-medium text-primary hover:text-primary/80">
              {currentT.signUp}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
