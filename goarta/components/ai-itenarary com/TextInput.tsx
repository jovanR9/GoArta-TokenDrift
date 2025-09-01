'use client';

import React, { useState, useImperativeHandle, forwardRef } from 'react';

interface TextInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

export interface TextInputRef {
  getValue: () => string;
  setValue: (value: string) => void;
  clearValue: () => void;
  sendMessage: () => void;
}

const TextInput = forwardRef<TextInputRef, TextInputProps>(({ 
  onSend, 
  placeholder = "Describe your dream vacation...", 
  className = '',
  initialValue = ''
}, ref) => {
  const [message, setMessage] = useState(initialValue);
  
  // Dummy variable for demonstration
  const dummyText = "I want to go on a tropical vacation with beautiful beaches, clear water, and lots of sunshine. I'd love to stay in a beachfront resort and enjoy water activities like snorkeling and swimming.";

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getValue: () => message,
    setValue: (value: string) => setMessage(value),
    clearValue: () => setMessage(''),
    sendMessage: () => {
      if (message.trim()) {
        onSend(message.trim());
        setMessage('');
      }
    }
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleDummyClick = () => {
    setMessage(dummyText);
  };

  return (
    <div className={`fixed bottom-24 right-8 w-80 ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full p-4 pr-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
          rows={3}
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        />
        
        {/* Dummy text button */}
        <button
          type="button"
          onClick={handleDummyClick}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cyan-400/20 hover:bg-cyan-400/30 flex items-center justify-center text-cyan-400 text-xs transition-all duration-300"
          title="Fill with dummy text"
        >
          💡
        </button>
      </form>
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
