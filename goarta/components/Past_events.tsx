import React from "react";

const FestivalCard: React.FC = () => {
  // Multiple dummy festivals
  const festivalData = [
    {
      imageUrl: "https://via.placeholder.com/300x200?text=Shigmo+Festival",
      title: "Shigmo Festival",
      date: "18 March 2025",
      location: "Panaji",
      buttonText: "Read more",
    },
    {
      imageUrl: "https://via.placeholder.com/300x200?text=Diwali+Festival",
      title: "Diwali Festival",
      date: "12 November 2025",
      location: "Mapusa",
      buttonText: "Read more",
    },
    {
      imageUrl: "https://via.placeholder.com/300x200?text=Holi+Festival",
      title: "Holi Festival",
      date: "6 March 2025",
      location: "Margao",
      buttonText: "Read more",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {festivalData.map((festival, index) => (
        <a
          key={index}
          href="#"
          className="group relative block overflow-hidden rounded-xl shadow-md w-full sm:w-64 md:w-72 lg:w-80 bg-white"
          style={{ border: "2px solid #0055FF" }} // 👈 custom border color
        >
          {/* Image Wrapper */}
          <div className="p-4">
            <img
              src={festival.imageUrl}
              alt={festival.title}
              className="h-56 w-full object-cover rounded-lg transition duration-500 group-hover:scale-105 sm:h-64"
            />
          </div>

          {/* Content Section */}
          <div
            className="relative bg-white p-5 text-center 
                       -mt-6 sm:-mt-8 md:-mt-10"
          >
            <h3 className="mt-1 text-lg font-semibold text-gray-900">
              {festival.title}
            </h3>

            <p className="mt-1 text-sm text-gray-700">
              {festival.date} · {festival.location}
            </p>

            <form className="mt-3">
              <button
                className="mx-auto block rounded-md px-6 py-2 text-sm font-medium text-white transition hover:scale-105"
                style={{
                  background: "linear-gradient(90deg, #6D74FF 0%, #414699 100%)",
                }} // 👈 gradient button bg
              >
                {festival.buttonText}
              </button>
            </form>
          </div>
        </a>
      ))}
    </div>
  );
};

export default FestivalCard;
