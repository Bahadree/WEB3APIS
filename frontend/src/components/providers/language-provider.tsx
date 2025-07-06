"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const defaultLang = typeof window !== "undefined" ? localStorage.getItem("lang") || "en" : "en";

const LanguageContext = createContext({
  lang: defaultLang,
  setLang: (lang: string) => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<string>(defaultLang);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const setLang = (newLang: string) => {
    setLangState(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
