import React from "react";
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

type ChatBubbleProps = {
  text?: string;
};

const LeftChatBubble: React.FC<ChatBubbleProps> = ({ text }) => {
  return (
    <div
      className="relative max-w-md w-full p-12 rounded-2xl text-center text-white"
      style={{
        background:
          "linear-gradient(to bottom right, #54529E 5%, #824A97 54%, #AB3988 100%)",
      }}
    >
      {/* Image 1 - top left */}
      <Image
        src="/ai_itinerary_images/image1.png"
        alt="image1"
        width={48}
        height={48}
        className="absolute top-2 left-2 w-12 h-12"
      />

      {/* Image 2 - top right */}
      <Image
        src="/ai_itinerary_images/image2.png"
        alt="image2"
        width={48}
        height={48}
        className="absolute top-2 right-2 w-12 h-12"
      />

      {/* Image 3 - bottom left */}
      <Image
        src="/ai_itinerary_images/image3.png"
        alt="image3"
        width={48}
        height={48}
        className="absolute bottom-2 left-2 w-12 h-12"
      />

      {/* Image 4 - bottom right */}
      <Image
        src="/ai_itinerary_images/image4.png"
        alt="image4"
        width={48}
        height={48}
        className="absolute bottom-2 right-2 w-12 h-12"
      />

      {/* Bubble Text */}
      <div className="text-lg leading-relaxed text-left">
        <ReactMarkdown>{text ?? ""}</ReactMarkdown>
      </div>
    </div>
  );
};

export default LeftChatBubble;
