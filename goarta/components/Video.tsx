export default function VideoSection() {
  // Array of three video paths (update with your actual video URLs or paths)
  const videos = [
    { src: '/1.mp4' },
    { src: '/2.mp4' },
    { src: '/3.mp4' },
  ];

  // Define unique border radii for each box's corners (top-left, top-right, bottom-right, bottom-left)
  const borderRadii = [
    '10px 20px 30px 40px', // Box 1: 10px TL, 20px TR, 30px BR, 40px BL
    '15px 25px 35px 45px', // Box 2: 15px TL, 25px TR, 35px BR, 45px BL
    '50px 55px 60px 65px', // Box 3: 50px TL, 55px TR, 60px BR, 65px BL
  ];

  // Define unique width and height for each box at each breakpoint
  const boxSizes = [
    // Box 1
    ' -ml-1 w-44 h-96 sm:w-68 sm:h-38 md:w-80 md:h-[500px] lg:w-88 lg:h-[500px] lg:-ml-12',
    // Box 2
    ' w-[170px] h-48 sm:w-72 sm:h-40 md:w-96 md:h-60 md:-ml-8 lg:w-[430px] lg:h-58 lg:-ml-0',
    // Box 3
    '-mt-48 ml-[182px] w-[168px] h-44 sm:w-76 sm:h-42 md:-mt-64 md:ml-84 md:w-96 md:h-60 lg:w-[430px] lg:h-[243px] lg:-mt-64 lg:ml-[330px]',
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Side: Text */}
        <div className="lg:w-1/2 lg:-ml-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Experience Unforgettable Events
          </h2>
      <p className="hidden lg:block text-lg text-gray-700 mb-6">
            Cultural festivals bring people together through vibrant traditions, dance, and storytelling. They celebrate heritage with color, music, and shared joy, creating moments that connect generations. <br /><br />
            Musical events offer high-energy experiences and soulful performances. From electronic beats to acoustic sets, they create spaces where rhythm and emotion take center stage. <br /><br />
            Tourist experiences blend history and beauty—whether through heritage walks, architectural wonders, or scenic escapes. Each moment invites reflection, discovery, and delight.
          </p>
        </div>

        {/* Right Side: Video Boxes */}
        <div className="-mt-6 lg:w-1/2 grid grid-cols-2 gap-4">
          {videos.map((video, index) => (
            <div
              key={index}
              className={`overflow-hidden shadow-lg border border-gray-200 ${boxSizes[index]}`}
              style={{ borderRadius: borderRadii[index] }}
            >
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={video.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}