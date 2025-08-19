import Image from "next/image";

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
                md:w-[110px] md:h-[110px] 
                lg:w-[80px] lg:h-[60px] lg:mt-20
                xl:w-[150px] xl:h-[150px] 
                2xl:w-[170px] 2xl:h-[170px]
              "
                        />
                    </a>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-2">
                        <a
                            className="block rounded-md bg-green-900 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-white transition hover:bg-green-800"
                            href="#"
                        >
                            About us
                        </a>

                        <a
                            className="block rounded-md bg-blue-900 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-white transition hover:bg-blue-800"
                            href="#"
                        >
                            Sign in
                        </a>
                    </div>

                </div>
            </header>
        </>
    );
}
