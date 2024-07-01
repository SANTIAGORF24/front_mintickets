"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ProtectedLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push("/");
    }
  }, [router]);

  return <>{children}</>;
}
