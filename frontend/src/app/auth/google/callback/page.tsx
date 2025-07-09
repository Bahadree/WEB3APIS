"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/oauth/google/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem("token", data.token);
            router.push("/dashboard");
          } else {
            router.push("/auth/login?error=google");
          }
        });
    } else {
      router.push("/auth/login?error=google");
    }
  }, [router]);

  return <div>Giriş yapılıyor, lütfen bekleyin...</div>;
}
