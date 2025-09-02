import React from "react";
import ReactMarkdown from 'react-markdown';

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
      <img
        src="/ai_itinerary_images/crab.png"
        alt="crab"
        className="absolute top-2 left-2 w-12 h-12"
      />

      {/* Castle - top right */}
      <img
        src="/ai_itinerary_images/castle.png"
        alt="castle"
        className="absolute top-2 right-2 w-12 h-12"
      />

      {/* Beach ball - bottom left */}
      <img
        src="/ai_itinerary_images/ball.png"
        alt="beach ball"
        className="absolute bottom-2 left-2 w-12 h-12"
      />

      {/* Shell - bottom right */}
      <img
        src="/ai_itinerary_images/shell.png"
        alt="shell"
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
