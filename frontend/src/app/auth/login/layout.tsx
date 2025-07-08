import React from "react";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), // Local geliştirme için
  // Railway deployunda: NEXT_PUBLIC_SITE_URL=https://web3apis.up.railway.app
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
