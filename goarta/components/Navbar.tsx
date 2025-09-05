import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
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
                            href="/past_events"
                        >
                            About us
                        </Link>

                        <Link href = "/login"
                            className="block rounded-md bg-blue-900 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-white transition hover:bg-blue-800"
                        >
                            Log in
                        </Link>
                    </div>

                </div>
            </header>
        </>
    );
}
