import React from "react";
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

type ChatBubbleProps = {
  text?: string;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ text }) => {
  return (
    <div
      className="relative max-w-md w-full p-12 rounded-2xl text-center text-white"
      style={{
        background:
          "linear-gradient(to bottom right, #54529E 5%, #824A97 54%, #AB3988 100%)",
      }}
    >
      {/* Crab - top left */}
      <Image
        src="/ai_itinerary_images/crab.png"
        alt="crab"
        width={48}
        height={48}
        className="absolute top-2 left-2 w-12 h-12"
      />

      {/* Castle - top right */}
      <Image
        src="/ai_itinerary_images/castle.png"
        alt="castle"
        width={48}
        height={48}
        className="absolute top-2 right-2 w-12 h-12"
      />

      {/* Beach ball - bottom left */}
      <Image
        src="/ai_itinerary_images/ball.png"
        alt="beach ball"
        width={48}
        height={48}
        className="absolute bottom-2 left-2 w-12 h-12"
      />

      {/* Shell - bottom right */}
      <Image
        src="/ai_itinerary_images/shell.png"
        alt="shell"
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

export default ChatBubble;
