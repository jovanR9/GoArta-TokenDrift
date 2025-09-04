import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export interface ChatInputRef {
  handleSend: () => void;
}



const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
        '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
    '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓',
    '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺',
    '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
    '😞', '😓', '😩', '😫', '😤', '😡', '😠', '🤬', '😈', '👿',
    '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖',
    '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'
];



const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({ onSendMessage }, ref) => {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    
    if (value.includes(":")) {
      setShowEmojiPicker(true);
    } else {
      setShowEmojiPicker(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    onSendMessage(text);
    setText("");
    setShowEmojiPicker(false);
  };

  useImperativeHandle(ref, () => ({
    handleSend: handleSend,
  }));

  const addEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto'; // Reset height to auto to get accurate scrollHeight
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [text]);

  return (
    <div className="relative w-full flex flex-col items-center">
      

      {/* Text Input */}
      <motion.textarea
        ref={textareaRef}
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="
          w-full overflow-y-auto
          text-white text-base outline-none
          rounded-[51px]
          border-[5px] border-white
          shadow-lg
          backdrop-blur-[60px]
          bg-[rgba(217,217,217,0.1)]
          transition-all
          relative z-10
        "
        rows={1}
      />

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div
          className="
            absolute bottom-16 left-0 w-full flex justify-center
            z-20
          "
        >
          <motion.div
            className="
              rounded-2xl p-3 
              backdrop-blur-[60px] bg-[rgba(217,217,217,0.1)]
              border border-white/20 shadow-xl
              grid grid-cols-8 gap-2
              overflow-y-auto max-h-60
            "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => addEmoji(emoji)}
                className="p-1 rounded hover:bg-white/20 text-xl"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;