'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  type: 'ai' | 'user';
  text: string;
}
import Background from '@/components/ai-itenarary com/background';
import ChatBubble from '@/components/ai-itenarary com/right_chat_bubble';
import LeftChatBubble from '@/components/ai-itenarary com/left_chat_bubble';
import PastHistoryButton from '@/components/ai-itenarary com/PastHistoryButton';
import ChatInput, { ChatInputRef } from '@/components/ChatInput';
import SendButton from '@/components/SendButton';

import PastChatsDisplay from '@/components/PastChatsDisplay';
import BlurOverlay from '@/components/BlurOverlay';
import HeroItinerary from '@/components/ai-itenarary com/HeroItinerary';

export default function AIItineraryPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { type: 'ai', text: 'Hello! How can I help you plan your trip?' }
  ]);
  const [typingMessage, setTypingMessage] = useState<string | null>(null);
  const [displayedTypingMessage, setDisplayedTypingMessage] = useState<string>('');
  const [showChatInterface, setShowChatInterface] = useState(false);
  const chatInputRef = useRef<ChatInputRef>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showPastChats, setShowPastChats] = useState(false);
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const [pastChatsKey, setPastChatsKey] = useState(0);
  const [pastHistoryButtonKey, setPastHistoryButtonKey] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<{ type: string, text: string }[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleBack = () => {
    router.push('/');
  };

  const handleSendMessage = async (text: string) => {
    if (text.trim() === '') return;

    const userMessage: Message = { type: 'user', text };
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
      const currentDateTime = new Date().toISOString();
      const response = await fetch('/api/ai-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: text, 
          history: newHistory, 
          currentDateTime,
          conversationId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTypingMessage(data.aiResponse);
      setConversationHistory(data.history);
      
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      setTypingMessage('Sorry, I could not get a response from the AI.');
    }
  };

  const handleShowChat = () => {
    setShowChatInterface(true);
    setConversationHistory([]);
  };

  const loadConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations?id=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Ensure message types are correctly set
      const formattedMessages: Message[] = data.messages.map((msg: { type: string; text: string }) => ({
        type: msg.type === 'user' ? 'user' : 'ai',
        text: msg.text
      }));
      
      setConversationId(id);
      setConversationHistory(data.messages);
      setMessages(formattedMessages);
      setShowChatInterface(true);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handlePastChatsButtonClick = () => {
    setIsBackgroundBlurred(true);
    setShowPastChats(true);
  };

  const handleClosePastChats = () => {
    setShowPastChats(false);
    setIsBackgroundBlurred(false);
    setPastChatsKey(prevKey => prevKey + 1);
    setPastHistoryButtonKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingMessage]);

  useEffect(() => {
    if (typingMessage) {
      let i = 0;
      setDisplayedTypingMessage('');
      const typingInterval = setInterval(() => {
        setDisplayedTypingMessage((prev) => prev + typingMessage[i]);
        i++;
        if (i === typingMessage.length) {
          clearInterval(typingInterval);
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'ai', text: typingMessage },
          ]);
          setTypingMessage(null);
        }
      }, 1);

      return () => clearInterval(typingInterval);
    }
  }, [typingMessage]);

  // Music note effect on mouse click and spacebar press
  useEffect(() => {
    let noteIndex = 0;
    const musicNotes = ['♪', '♩', '♫', '♬', '♭', '♮', '♯'];

    const handleClick = (e: MouseEvent) => {
      // Create music note animation on click
      createMusicNote(e.clientX, e.clientY, noteIndex);
      // Cycle to next note
      noteIndex = (noteIndex + 1) % musicNotes.length;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if spacebar is pressed
      if (e.key === ' ') {
        // Get the position of the currently focused element
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
          // Get the actual caret position
          const caretPosition = getCaretPosition(activeElement as HTMLInputElement | HTMLTextAreaElement);
          if (caretPosition) {
            createMusicNote(caretPosition.x, caretPosition.y, noteIndex);
            // Cycle to next note
            noteIndex = (noteIndex + 1) % musicNotes.length;
          }
        }
      }
    };

    // Get the actual caret position in an input/textarea
    const getCaretPosition = (element: HTMLInputElement | HTMLTextAreaElement) => {
      const selectionStart = element.selectionStart || 0;
      
      // Create a mirror div to calculate the caret position
      const mirror = document.createElement('div');
      const computedStyle = window.getComputedStyle(element);
      
      // Copy styles to mirror
      mirror.style.position = 'absolute';
      mirror.style.left = '-9999px';
      mirror.style.top = '-9999px';
      mirror.style.visibility = 'hidden';
      mirror.style.whiteSpace = computedStyle.whiteSpace;
      mirror.style.wordWrap = computedStyle.wordWrap;
      mirror.style.overflow = 'hidden';
      mirror.style.fontFamily = computedStyle.fontFamily;
      mirror.style.fontSize = computedStyle.fontSize;
      mirror.style.fontWeight = computedStyle.fontWeight;
      mirror.style.letterSpacing = computedStyle.letterSpacing;
      mirror.style.lineHeight = computedStyle.lineHeight;
      mirror.style.padding = computedStyle.padding;
      mirror.style.border = computedStyle.border;
      mirror.style.width = computedStyle.width;
      mirror.style.height = computedStyle.height;
      mirror.style.boxSizing = computedStyle.boxSizing;
      
      document.body.appendChild(mirror);
      
      try {
        // Insert the element's text up to the caret position
        const text = element.value.substring(0, selectionStart);
        
        // Handle line breaks properly
        mirror.textContent = text;
        
        // Add a zero-width space span to measure the caret position
        const caretSpan = document.createElement('span');
        caretSpan.textContent = '\u200B'; // Zero-width space
        mirror.appendChild(caretSpan);
        
        // Get the element's position on screen
        const rect = element.getBoundingClientRect();
        const caretRect = caretSpan.getBoundingClientRect();
        const mirrorRect = mirror.getBoundingClientRect();
        
        // Calculate the actual position
        const x = rect.left + (caretRect.left - mirrorRect.left) + window.scrollX;
        const y = rect.top + (caretRect.top - mirrorRect.top) + window.scrollY + (caretRect.height / 2);
        
        return { x, y };
      } finally {
        // Clean up
        document.body.removeChild(mirror);
      }
    };

    // Create music note animation
    const createMusicNote = (x: number, y: number, index: number) => {
      const note = document.createElement('div');
      note.innerHTML = musicNotes[index];
      note.style.position = 'fixed';
      note.style.left = `${x}px`;
      note.style.top = `${y}px`;
      note.style.fontSize = '24px';
      note.style.color = 'white';
      note.style.pointerEvents = 'none';
      note.style.zIndex = '9999';
      note.style.transform = 'translate(-50%, -50%)';
      note.style.opacity = '1';
      
      // Add keyframe animation
      const style = document.createElement('style');
      style.id = 'music-note-animation';
      style.innerHTML = `
        @keyframes float-up {
          0% {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -100px);
            opacity: 0;
          }
        }
      `;
      
      // Only add style if it doesn't already exist
      if (!document.getElementById('music-note-animation')) {
        document.head.appendChild(style);
      }
      
      note.style.animation = 'float-up 1s forwards';
      document.body.appendChild(note);
      
      // Remove note after animation completes
      setTimeout(() => {
        if (note.parentNode) {
          note.parentNode.removeChild(note);
        }
      }, 1000);
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-6 right-6 z-30">
        <button
          onClick={handleBack}
          className="bg-[rgba(217,217,217,0.1)] backdrop-blur-[60px] border border-white/20 text-white px-4 py-3 rounded-xl hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg group"
        >
          <span className="transition-all duration-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#54529E] group-hover:via-[#824A97] group-hover:to-[#AB398E]">
            ← Back to Home
          </span>
        </button>
      </div>
      {isBackgroundBlurred && <BlurOverlay />}
      
      <PastHistoryButton onAnimationComplete={handlePastChatsButtonClick} key={`history-${pastHistoryButtonKey}`} />
      
      {!showChatInterface && (
        <div className="animate-in fade-in duration-500">
          <HeroItinerary 
            onSendMessage={handleSendMessage}
            onShowChat={handleShowChat}
          />
        </div>
      )}
      
      <Background className="fixed inset-0" darken={showChatInterface} />
      
      {showPastChats && <PastChatsDisplay key={`past-${pastChatsKey}`} onClose={handleClosePastChats} onLoadConversation={loadConversation} />}

      {showChatInterface && (
        <div className="relative z-20 min-h-screen flex flex-col justify-end px-6 pb-4 pt-24 animate-in fade-in duration-500 overflow-x-hidden">
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
              {typingMessage && (
                <div key="typing-message" className="max-w-2xl self-start">
                  <LeftChatBubble text={displayedTypingMessage} />
                </div>
              )}
              <div ref={messagesEndRef} />
          </div>
          <div className="w-full max-w-2xl mx-auto mt-4 flex items-center gap-4">
            <div className="flex-grow">
              <ChatInput onSendMessage={handleSendMessage} ref={chatInputRef} />
            </div>
            <SendButton onClick={() => chatInputRef.current?.handleSend()} />
          </div>
        </div>
      )}
    <style jsx global>{`
        html, body {
          overflow-x: hidden !important;
        }
      `}</style>
    </div>
  );
}