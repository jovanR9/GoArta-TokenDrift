import Image from "next/image";
export default function Navbar() {
    return (
        <>
            <header className="navbar m-8 rounded-lg ">
                <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
                    <a className="block text-teal-600" href="#">
                        <Image
                            className="h-8"
                            src="/Logo.png"
                            alt="Logo"
                            width={32}
                            height={48}
                            style={{ width: "95px", height: "95px" }}
                        />
                    </a>

                    <div className="flex flex-1 items-center justify-end md:justify-between">
                        <nav aria-label="Global" className="hidden md:block">
                        </nav>

                        <div className="flex items-center gap-4">
                            <div className="sm:flex sm:gap-4">
                                <a
                                    className="block rounded-md bg-green-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-800"
                                    href="#"
                                >
                                    About us
                                </a>

                                <a
                                    className=" font-medium text-white hidden rounded-md bg-blue-900 px-5 py-2.5 text-sm 
                                    transition hover:bg-blue-800
                                    sm:block"
                                    href="#"
                                >
                                    Sign in
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}