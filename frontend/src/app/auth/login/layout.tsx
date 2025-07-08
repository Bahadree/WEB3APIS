import React from "react";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
