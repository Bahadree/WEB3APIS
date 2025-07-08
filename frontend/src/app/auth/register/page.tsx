"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { Loader2, Mail, Lock, User, Calendar } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth();
  const { lang } = useLanguage();
  type LangKey = 'en' | 'tr' | 'de' | 'fr' | 'es' | 'ru' | 'zh';
  const t: Record<LangKey, {
    signUp: string;
    join: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    gdpr: string;
    terms: string;
    privacy: string;
    already: string;
    signIn: string;
    passwordsNoMatch: string;
    registrationFailed: string;
  }> = {
    en: {
      signUp: "Sign Up",
      join: "Join the Web3APIs platform!",
      username: "Username",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      dateOfBirth: "Date of Birth (optional)",
      gdpr: "I have read the GDPR Information Notice",
      terms: "I accept the Terms of Service",
      privacy: "I accept the Privacy Policy",
      already: "Already have an account? ",
      signIn: "Sign In",
      passwordsNoMatch: "Passwords do not match",
      registrationFailed: "Registration failed"
    },
    tr: {
      signUp: "Kayıt Ol",
      join: "Web3APIs platformuna katıl!",
      username: "Kullanıcı Adı",
      email: "Email",
      password: "Şifre",
      confirmPassword: "Şifre Tekrar",
      dateOfBirth: "Doğum Tarihi (isteğe bağlı)",
      gdpr: "KVKK Aydınlatma Metni'ni okudum",
      terms: "Kullanım Şartları'nı kabul ediyorum",
      privacy: "Gizlilik Politikasını kabul ediyorum",
      already: "Zaten hesabın var mı? ",
      signIn: "Giriş Yap",
      passwordsNoMatch: "Şifreler eşleşmiyor",
      registrationFailed: "Kayıt başarısız"
    },
    de: {
      signUp: "Registrieren",
      join: "Tritt der Web3APIs-Plattform bei!",
      username: "Benutzername",
      email: "E-Mail",
      password: "Passwort",
      confirmPassword: "Passwort bestätigen",
      dateOfBirth: "Geburtsdatum (optional)",
      gdpr: "Ich habe die DSGVO-Information gelesen",
      terms: "Ich akzeptiere die Nutzungsbedingungen",
      privacy: "Ich akzeptiere die Datenschutzrichtlinie",
      already: "Schon ein Konto? ",
      signIn: "Anmelden",
      passwordsNoMatch: "Passwörter stimmen nicht überein",
      registrationFailed: "Registrierung fehlgeschlagen"
    },
    fr: {
      signUp: "S'inscrire",
      join: "Rejoignez la plateforme Web3APIs !",
      username: "Nom d'utilisateur",
      email: "E-mail",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      dateOfBirth: "Date de naissance (optionnel)",
      gdpr: "J'ai lu la notice d'information RGPD",
      terms: "J'accepte les Conditions d'utilisation",
      privacy: "J'accepte la Politique de confidentialité",
      already: "Vous avez déjà un compte ? ",
      signIn: "Se connecter",
      passwordsNoMatch: "Les mots de passe ne correspondent pas",
      registrationFailed: "Échec de l'inscription"
    },
    es: {
      signUp: "Registrarse",
      join: "¡Únete a la plataforma Web3APIs!",
      username: "Nombre de usuario",
      email: "Correo electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      dateOfBirth: "Fecha de nacimiento (opcional)",
      gdpr: "He leído la información sobre la RGPD",
      terms: "Acepto los Términos de servicio",
      privacy: "Acepto la Política de privacidad",
      already: "¿Ya tienes una cuenta? ",
      signIn: "Iniciar sesión",
      passwordsNoMatch: "Las contraseñas no coinciden",
      registrationFailed: "Registro fallido"
    },
    ru: {
      signUp: "Зарегистрироваться",
      join: "Присоединяйтесь к платформе Web3APIs!",
      username: "Имя пользователя",
      email: "Электронная почта",
      password: "Пароль",
      confirmPassword: "Подтвердите пароль",
      dateOfBirth: "Дата рождения (необязательно)",
      gdpr: "Я прочитал уведомление о GDPR",
      terms: "Я принимаю Условия обслуживания",
      privacy: "Я принимаю Политику конфиденциальности",
      already: "Уже есть аккаунт? ",
      signIn: "Войти",
      passwordsNoMatch: "Пароли не совпадают",
      registrationFailed: "Ошибка регистрации"
    },
    zh: {
      signUp: "注册",
      join: "加入 Web3APIs 平台！",
      username: "用户名",
      email: "电子邮件",
      password: "密码",
      confirmPassword: "确认密码",
      dateOfBirth: "出生日期（可选）",
      gdpr: "我已阅读 GDPR 信息通知",
      terms: "我接受服务条款",
      privacy: "我接受隐私政策",
      already: "已有账号？ ",
      signIn: "登录",
      passwordsNoMatch: "两次输入的密码不一致",
      registrationFailed: "注册失败"
    },
  };
  const currentT = t[(lang as LangKey)] || t['en'];

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
    dateOfBirth: "",
    gdprConsent: false,
    termsConsent: false,
    privacyConsent: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.passwordConfirm) {
      setError(currentT.passwordsNoMatch);
      return;
    }
    try {
      const { passwordConfirm, ...registerData } = form;
      await registerUser(registerData);
    } catch (err: any) {
      setError(err.response?.data?.message || currentT.registrationFailed);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text">{currentT.signUp}</h2>
          <p className="mt-2 text-muted-foreground">{currentT.join}</p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '')}/auth/google`}
              className="w-full flex justify-center items-center py-2 px-4 border border-border rounded-lg bg-background text-base font-medium text-foreground hover:bg-accent transition-all duration-200"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span style={{ flex: 1, textAlign: 'center' }}>Google ile Kayıt Ol</span>
            </button>
            <button
              type="button"
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '')}/auth/apple`}
              className="w-full flex justify-center items-center py-2 px-4 border border-border rounded-lg bg-background text-base font-medium text-foreground hover:bg-accent transition-all duration-200"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M16.365 1.43c0 1.14-.93 2.07-2.07 2.07-.04 0-.08 0-.12-.01-.02-.09-.03-.19-.03-.29 0-1.14.93-2.07 2.07-2.07.04 0 .08 0 .12.01.02.09.03.19.03.29zm2.13 4.37c-1.17-.14-2.41.68-3.04.68-.64 0-1.62-.66-2.67-.64-1.37.02-2.64.8-3.34 2.03-1.43 2.48-.37 6.14 1.02 8.15.68.98 1.48 2.08 2.54 2.04 1.03-.04 1.42-.66 2.67-.66 1.25 0 1.6.66 2.67.64 1.1-.02 1.79-1 2.46-1.98.78-1.13 1.1-2.23 1.12-2.29-.02-.01-2.15-.83-2.17-3.29-.02-2.06 1.68-3.04 1.76-3.09-.97-1.41-2.48-1.57-3.01-1.6zm-2.13 13.13c-.01.01-.02.01-.03.01-.09.03-.18.05-.28.05-.1 0-.2-.02-.29-.05-.01 0-.02 0-.03-.01-.09-.03-.18-.07-.26-.13-.08-.06-.15-.13-.21-.21-.06-.08-.1-.17-.13-.26-.03-.09-.05-.18-.05-.28 0-.1.02-.2.05-.29.03-.09.07-.18.13-.26.06-.08.13-.15.21-.21.08-.06.17-.1.26-.13.09-.03.18-.05.28-.05.1 0 .2.02.29.05.09.03.18.07.26.13.08.06.15.13.21.21.06.08.1.17.13.26.03.09.05.18.05.28 0 .1-.02.2-.05.29-.03.09-.07.18-.13.26-.06.08-.13.15-.21.21-.08.06-.17.1-.26.13z"/>
              </svg>
              <span style={{ flex: 1, textAlign: 'center' }}>Apple ile Kayıt Ol</span>
            </button>
          </div>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Veya devam et</span>
              </div>
            </div>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">{currentT.username}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={currentT.username}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="sr-only">{currentT.email}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={currentT.email}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">{currentT.password}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={currentT.password}
                />
              </div>
            </div>
            <div>
              <label htmlFor="passwordConfirm" className="sr-only">{currentT.confirmPassword}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={currentT.confirmPassword}
                />
              </div>
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="sr-only">{currentT.dateOfBirth}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={currentT.dateOfBirth}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none p-2 rounded-lg transition hover:bg-accent/40">
                <input name="gdprConsent" type="checkbox" checked={form.gdprConsent} onChange={handleChange} required className="form-checkbox h-5 w-5 text-primary border-border rounded focus:ring-2 focus:ring-primary transition-all" />
                <span className="text-muted-foreground">{currentT.gdpr}</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none p-2 rounded-lg transition hover:bg-accent/40">
                <input name="termsConsent" type="checkbox" checked={form.termsConsent} onChange={handleChange} required className="form-checkbox h-5 w-5 text-primary border-border rounded focus:ring-2 focus:ring-primary transition-all" />
                <span className="text-muted-foreground">{currentT.terms}</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none p-2 rounded-lg transition hover:bg-accent/40">
                <input name="privacyConsent" type="checkbox" checked={form.privacyConsent} onChange={handleChange} required className="form-checkbox h-5 w-5 text-primary border-border rounded focus:ring-2 focus:ring-primary transition-all" />
                <span className="text-muted-foreground">{currentT.privacy}</span>
              </label>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              currentT.signUp
            )}
          </button>
        </form>
        <div className="text-center">
          <span className="text-muted-foreground">{currentT.already}</span>
          <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80">
            {currentT.signIn}
          </Link>
        </div>
      </div>
    </div>
  );
}
