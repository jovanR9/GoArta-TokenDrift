// what is goarta section
import Image from "next/image";
export default function Info() {
    return (
        <>
            <section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2">
                <div className="p-8 md:p-12 lg:px-16 lg:py-24">
                    <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
                        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                            What is GoArta?
                        </h1>

                        <p className="hidden text-gray-500 text-sm md:mt-4 md:block md:text-base lg:text-xl">
                            GoArta is a digital platform that curates Goa’s rich cultural heritage, local art, food, and events into an interactive, easy-to-explore experience. We connect locals and travelers with authentic cultural stories, hidden gems, and vibrant activities—helping them discover Goa beyond the beaches. <br /> <br />

                            From age-old traditions and heritage sites to contemporary art, music festivals, and local cuisines, GoArta brings together everything that makes Goa unique. Whether you’re a traveler seeking authentic experiences or a Goan wanting to reconnect with your roots, GoArta is your cultural companion. <br /> <br />

                            Our mission is to celebrate and preserve Goa’s essence while making it accessible through modern technology. With GoArta, every journey becomes more than just a visit—it becomes a story, a memory, and a connection to the heart of Goa.
                        </p>
                    </div>
                </div>

                <Image
                    alt=""
                    src="/Logo.png"
                    width={600}
                    height={100}
                    className="w-full h-[40px] object-contain sm:h-auto"
                />

            </section>
        </>
    );
}