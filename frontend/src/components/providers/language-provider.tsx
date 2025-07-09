"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const defaultLang = typeof window !== "undefined" ? localStorage.getItem("lang") || "en" : "en";

const LanguageContext = createContext({
  lang: defaultLang,
  setLang: (lang: string) => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<string>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // SSR/CSR farkını önlemek için dili client'ta localStorage'dan al
    const storedLang = localStorage.getItem("lang") || "en";
    setLangState(storedLang);
    setHydrated(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const setLang = (newLang: string) => {
    setLangState(newLang);
  };

  if (!hydrated) return null; // İlk renderda SSR/CSR farkını önle

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
