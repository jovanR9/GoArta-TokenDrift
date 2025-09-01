'use client';

import React, { useState, useRef, useEffect } from 'react';
import Background from '@/components/ai-itenarary com/background';
import ChatBubble from '@/components/ai-itenarary com/right_chat_bubble';
import LeftChatBubble from '@/components/ai-itenarary com/left_chat_bubble';
import PastHistoryButton from '@/components/ai-itenarary com/PastHistoryButton';
import ChatInput, { ChatInputRef } from '@/components/ChatInput';
import SendButton from '@/components/SendButton';
import { useRouter } from 'next/navigation';

export default function AIItineraryPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ type: 'user' | 'ai', text: string }[]>([
    { type: 'ai', text: 'Hello! How can I help you plan your trip?' }
  ]);
  const chatInputRef = useRef<ChatInputRef>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleBack = () => {
    router.push('/');
  };

  const handleSendMessage = (text: string) => {
    if (text.trim() === '') return;

    // Add user message
    setMessages((prevMessages) => [...prevMessages, { type: 'user', text }]);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'ai', text: 'This is a simulated AI response to: "' + text + '"' },
      ]);
    }, 1000);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="relative min-h-screen">
      <PastHistoryButton />
      {/* Background Animation */}
      <Background className="fixed inset-0" />
      
      

      {/* Chat Interface */}
      <div className="relative z-20 min-h-screen flex flex-col justify-end px-6 pb-4 pt-24">
        <div className="w-full max-w-4xl mx-auto space-y-4 flex flex-col overflow-y-auto flex-grow">
            {messages.map((msg, index) => (
                msg.type === 'user' ? (
                    <div key={index} className="max-w-2xl self-end">
                        <ChatBubble text={msg.text} />
                    </div>
                ) : (
                    <div key={index} className="max-w-2xl self-start">
                        <LeftChatBubble text={msg.text} />
                    </div>
                )
            ))}
            <div ref={messagesEndRef} />
        </div>
        <div className="w-full max-w-4xl mx-auto mt-4 flex items-center gap-4">
          <div className="flex-grow">
            <ChatInput onSendMessage={handleSendMessage} ref={chatInputRef} />
          </div>
          <SendButton onClick={() => chatInputRef.current?.handleSend()} />
        </div>
      </div>
    </div>
  );
}
