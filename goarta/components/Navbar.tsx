// components/Navbar.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import UserIcon from "./UserIcon";

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/"); // client-side redirect
  };

  if (isLoading) return null; // Don't render until auth state is ready

  // Null-safe initials and display name
  const initials = user ? 
  ((user.fname?.[0] || user.email?.[0] || "U") + (user.lname?.[0] || "")).toUpperCase()
  : "U";



  return (    <header className="navbar px-4 sm:px-6 lg:px-8 py-4">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/Logo.png"
            alt="Logo"
            width={95}
            height={95}
            className="
              w-[70px] h-[70px]
              sm:w-[90px] sm:h-[90px]
              md:w-[110px] md:h-[110px] md:mt-10
              lg:w-[100px] lg:h-[100px] lg:mt-8
            "
          />
        </Link>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2 md:mt-5">
          <Link
            className="block rounded-md bg-green-900 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-white transition hover:bg-green-800"
            href="/dashboard"
          >
            About us
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <UserIcon initials={initials} />

              <button
                onClick={handleLogout}
                className="block rounded-md bg-red-600 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-white transition hover:bg-red-700"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="block rounded-md bg-blue-900 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-white transition hover:bg-blue-800"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}