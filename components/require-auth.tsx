"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for user in localStorage (from login-signup)
    const user = typeof window !== "undefined" ? localStorage.getItem("moodsphere_user") : null;
    setIsAuthenticated(!!user);
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Sign In Required</h2>
          <p className="mb-6 text-gray-700">You need to sign in first to access this page.</p>
          <Button className="w-full" onClick={() => router.push("/login")}>Go to Sign In Page</Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 