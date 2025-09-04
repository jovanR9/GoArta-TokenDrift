'use client';

import React, { useState, useRef, useEffect } from 'react';
import Background from '@/components/ai-itenarary com/background';
import ChatBubble from '@/components/ai-itenarary com/right_chat_bubble';
import LeftChatBubble from '@/components/ai-itenarary com/left_chat_bubble';
import PastHistoryButton from '@/components/ai-itenarary com/PastHistoryButton';
import ChatInput, { ChatInputRef } from '@/components/ChatInput';
import SendButton from '@/components/SendButton';
import { useRouter } from 'next/navigation';
import PastChatsDisplay from '@/components/PastChatsDisplay';
import BlurOverlay from '@/components/BlurOverlay';
import HeroItinerary from '@/components/ai-itenarary com/HeroItinerary';

export default function AIItineraryPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ type: 'user' | 'ai', text: string }[]>([
    { type: 'ai', text: 'Hello! How can I help you plan your trip?' }
  ]);
  const [currentItineraryId, setCurrentItineraryId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const chatInputRef = useRef<ChatInputRef>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showPastChats, setShowPastChats] = useState(false);
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const [pastChatsKey, setPastChatsKey] = useState(0);
  const [pastHistoryButtonKey, setPastHistoryButtonKey] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]); // New state for Langchain history

  const handleBack = () => {
    router.push('/');
  };

  const handleSendMessage = async (text: string) => {
    if (text.trim() === '') return;

    const userMessage = { type: 'user', text };
    let newHistory = [...conversationHistory, userMessage];

    if (!showChatInterface) {
      setShowChatInterface(true);
      setMessages([
        { type: 'ai', text: 'Great! I\'m here to help you plan your perfect trip. What would you like to know?' },
        userMessage
      ]);
      newHistory = [userMessage];
    } else {
      setMessages((prevMessages) => [...prevMessages, userMessage]);
    }
    setConversationHistory(newHistory);


    try {
      const response = await fetch('/api/ai-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text, history: newHistory }), // Send current history
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'ai', text: data.aiResponse },
      ]);
      setConversationHistory(data.history); // Update history from the API response
    } catch (error) {
      console.error('Error sending message to AI:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'ai', text: 'Sorry, I could not get a response from the AI.' },
      ]);
    }
  };

  const handleShowChat = () => {
    setShowChatInterface(true);
    setConversationHistory([]); // Clear history when switching to chat view
  };

  const handlePastChatsButtonClick = () => {
    setIsBackgroundBlurred(true);
    setTimeout(() => {
      setShowPastChats(true);
    }, 500);
  };

  const handleClosePastChats = () => {
    setShowPastChats(false);
    setIsBackgroundBlurred(false);
    setPastChatsKey(prevKey => prevKey + 1);
    setPastHistoryButtonKey(prevKey => prevKey + 1);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="relative min-h-screen">
      {isBackgroundBlurred && <BlurOverlay />}
      
      {/* PastHistoryButton - Only show when hero section is visible */}
      {!showChatInterface && (
        <div className="animate-in fade-in duration-500">
          <PastHistoryButton onAnimationComplete={handlePastChatsButtonClick} key={`history-${pastHistoryButtonKey}`} />
        </div>
      )}
      
      {/* Hero Section - Only show when chat interface is not visible */}
      {!showChatInterface && (
        <div className="animate-in fade-in duration-500">
          <HeroItinerary 
            onSendMessage={handleSendMessage}
            onShowChat={handleShowChat}
          />
        </div>
      )}
      
      {/* Background Animation */}
      <Background className="fixed inset-0" isBlurred={isBackgroundBlurred} />
      
      {showPastChats && <PastChatsDisplay key={`past-${pastChatsKey}`} onClose={handleClosePastChats} />}

      {/* Chat Interface */}
      {showChatInterface && (
        <div className="relative z-20 min-h-screen flex flex-col justify-end px-6 pb-4 pt-24 animate-in fade-in duration-500">
          <div className="w-full max-w-4xl mx-auto space-y-4 flex flex-col overflow-y-auto flex-grow">
              {messages.map((msg, index) => (
                  msg.type === 'user' ? (
                      <div key={index} className="max-w-2xl self-end animate-in slide-in-from-right duration-300">
                          <ChatBubble text={msg.text} />
                      </div>
                  ) : (
                      <div key={index} className="max-w-2xl self-start animate-in slide-in-from-left duration-300">
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
      )}
    </div>
  );
};