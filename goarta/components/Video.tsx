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
    'w-60 h-34 sm:w-68 sm:h-38 md:w-76 md:h-42 lg:w-88 lg:h-[500px] lg:-ml-12',
    // Box 2
    'w-64 h-36 sm:w-72 sm:h-40 md:w-80 md:h-44 lg:w-[430px] lg:h-58',
    // Box 3
    'w-68 h-38 sm:w-76 sm:h-42 md:w-84 md:h-46 lg:w-[430px] lg:h-[243px] lg:-mt-64 lg:ml-[330px]',
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Side: Text */}
        <div className="lg:w-1/2 lg:-ml-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Experience Unforgettable Events
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Dive into the heart of culture and entertainment with our curated events.
            From vibrant festivals like Shigmo and electrifying music experiences
            like Sunburn to serene heritage walks in Fontainhas, there’s something
            for everyone. Book your tickets and share the joy with friends!
          </p>
        </div>

        {/* Right Side: Video Boxes */}
        <div className="lg:w-1/2 grid grid-cols-2 gap-4">
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