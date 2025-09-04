import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export interface ChatInputRef {
  handleSend: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  note: string;
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

const musicNotes = ['♪', '♫', '♬', '♩', '♭', '♯', '𝄞'];

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({ onSendMessage }, ref) => {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const particleIdRef = useRef(0);
  const lastTextLengthRef = useRef(0);

  const createParticle = () => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const rect = textarea.getBoundingClientRect();
    
    // Get cursor position for more precise particle spawning
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = text.substring(0, cursorPosition);
    
    // Estimate cursor position (this is approximate)
    const charWidth = 8; // approximate character width
    const padding = 16; // textarea padding
    const cursorX = Math.min(textBeforeCursor.length * charWidth + padding, rect.width - padding);
    
    const particle: Particle = {
      id: particleIdRef.current++,
      x: cursorX + Math.random() * 20 - 10, // Add some randomness
      y: rect.height / 2,
      note: musicNotes[Math.floor(Math.random() * musicNotes.length)]
    };

    setParticles(prev => [...prev, particle]);

    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== particle.id));
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const currentLength = value.length;
    
    // Only create particles when typing (not deleting)
    if (currentLength > lastTextLengthRef.current && value.trim() !== "") {
      // Create particle for every character typed (with some throttling)
      if (Math.random() >= 0) { // Always create particle for debugging
        createParticle();
      }
    }
    
    lastTextLengthRef.current = currentLength;
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
    setParticles([]);
    lastTextLengthRef.current = 0;
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
      const scrollHeight = textarea.scrollHeight;
      // Ensure a minimum height of 60px, and a maximum of 96px (max-h-24)
      textarea.style.height = `${Math.max(60, Math.min(scrollHeight, 96))}px`;
    }
  }, [text]);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Particle Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute text-2xl text-white/80"
              initial={{ 
                x: particle.x, 
                y: particle.y,
                opacity: 1,
                scale: 0.5
              }}
              animate={{ 
                x: particle.x + (Math.random() - 0.5) * 60,
                y: particle.y - 40, // Reduced vertical movement
                opacity: 0,
                scale: 1
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                duration: 1.5,
                ease: "easeOut"
              }}
              style={{
                filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))"
              }}
            >
              {particle.note}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Text Input */}
      <motion.textarea
        ref={textareaRef}
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="
          w-full h-[60px] max-h-24 resize-none px-4 py-3 scrollbar-hide
          text-white text-base outline-none
          rounded-[51px]
          border-[5px] border-white
          shadow-lg
          backdrop-blur-[60px]
          bg-[rgba(217,217,217,0.1)]
          transition-all
          relative z-10 box-border
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