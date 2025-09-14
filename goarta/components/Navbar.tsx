"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

// User Avatar Component
const UserAvatar = ({ user }: { user: any }) => {
    const getInitials = () => {
        if (user.first_name && user.last_name) {
            return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
        } else if (user.first_name) {
            return user.first_name.charAt(0).toUpperCase();
        } else if (user.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return 'U';
    };

    const getDisplayName = () => {
        if (user.first_name) {
            return user.first_name;
        } else if (user.email) {
            return user.email.split('@')[0];
        }
        return 'User';
    };

    return (
        <div className="flex items-center gap-2">
            {/* User Avatar Circle */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {getInitials()}
            </div>

            {/* User Name (hidden on mobile) */}
            <span className="text-sm text-gray-700 font-medium hidden sm:inline">
                {/* Hi, {getDisplayName()} */}
            </span>
        </div>
    );
};

export default function Navbar() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        // Optionally redirect to home page or login page
        window.location.href = "/";
    };

    return (
        <>
            <header className="navbar px-4 sm:px-6 lg:px-8 py-4">
                <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between">

                    {/* Logo */}
                    <a className="block text-teal-600" href="#">
                        <Image
                            src="/Logo.png"
                            alt="Logo"
                            width={95}
                            height={95}
                            className="
                w-[70px] h-[70px]   /* default (mobile ~375px like iPhone SE) */
                sm:w-[90px] sm:h-[90px] 
                md:w-[110px] md:h-[110px] md:mt-10
                lg:w-[100px] lg:h-[100px] lg:mt-8
                             "
                        />
                    </a>

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
                                {/* User Avatar Component */}
                                <Link href='/dashboard'>
                                    <UserAvatar user={user} />
                                </Link>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="block rounded-md bg-red-600 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-white transition hover:bg-red-700"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <Link href="/login"
                                className="block rounded-md bg-blue-900 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-white transition hover:bg-blue-800"
                            >
                                Log in
                            </Link>
                        )}
                    </div>

                </div>
            </header>
        </>
    );
}