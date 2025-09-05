'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import CloseButton from '@/components/CloseButton';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

interface FormattedChat {
  id: string;
  title: string;
  date: string;
}

interface RiveInstance {
  cleanup: () => void;
  resizeDrawingSurfaceToCanvas: () => void;
}

interface PastChatsDisplayProps {
  onClose: () => void;
  onLoadConversation?: (id: string) => void;
}

const PastChatsDisplay: React.FC<PastChatsDisplayProps> = ({ onClose, onLoadConversation }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveInstanceRef = useRef<RiveInstance | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

    const [pastChats, setPastChats] = useState<FormattedChat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Fetch actual conversations from the API
        const response = await fetch('/api/conversations');
        
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }
        
        const data: Conversation[] = await response.json();
        
        // Format the data for display
        const formattedChats: FormattedChat[] = data.map((conv) => ({
          id: conv.id,
          title: conv.title,
          date: new Date(conv.created_at).toLocaleDateString()
        }));
        
        setPastChats(formattedChats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        // Fallback to dummy data if API fails
        const dummyConversations: FormattedChat[] = [
          { id: '1', title: 'Trip to Goa', date: '10/26/2023' },
          { id: '2', title: 'Weekend in the mountains', date: '10/25/2023' },
          { id: '3', title: 'Beach vacation planning', date: '10/24/2023' },
          { id: '4', title: 'Another Goa Trip', date: '10/23/2023' },
          { id: '5', title: 'Exploring North India', date: '10/22/2023' },
          { id: '6', title: 'South India Temple Tour', date: '10/21/2023' },
        ];
        setPastChats(dummyConversations);
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const loadRiveScript = async () => {
      if (typeof window === 'undefined') return;

      if (window.rive) {
        initializeRive();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@rive-app/canvas';
      script.onload = () => {
        console.log('Rive script loaded for PastChatsDisplay');
        initializeRive();
      };
      script.onerror = (error) => {
        console.error('Failed to load Rive script for PastChatsDisplay:', error);
      };
      document.head.appendChild(script);
    };

    const initializeRive = () => {
      if (!canvasRef.current || !window.rive) return;

      console.log("Attempting to start Rive for PastChatsDisplay...");

      try {
        riveInstanceRef.current = new window.rive.Rive({
          src: "/animations/past_chats.riv", // Assuming this path
          canvas: canvasRef.current,
          stateMachines: ["compass hover state machine", "panjim church hover state machine"],
          animations: ["clouds animation"],
          autoplay: true,
          layout: new window.rive.Layout({
            fit: window.rive.Fit.Contain,
            alignment: window.rive.Alignment.Center
          }),
          onLoad: () => {
            console.log("PastChatsDisplay Rive loaded successfully!");
            riveInstanceRef.current?.resizeDrawingSurfaceToCanvas();
          },
          onError: (error: Error) => {
            console.error("PastChatsDisplay Rive Error:", error);
          }
        });
        console.log("PastChatsDisplay Rive constructor called.");
      } catch (e) {
        console.error("Error creating PastChatsDisplay Rive instance:", e);
      }
    };

    loadRiveScript();

    return () => {
      if (riveInstanceRef.current) {
        try {
          riveInstanceRef.current.cleanup();
        } catch (e) {
          console.error("Error cleaning up PastChatsDisplay Rive instance:", e);
        }
      }
    };
  }, [isMounted]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        {isMounted && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        )}
        {/* Past Chats List */}
        <div className="relative z-10 w-full max-w-[18rem] p-4 md:max-w-xs lg:max-w-sm md:p-6 -translate-x-[10vw] md:-translate-x-[14vw] lg:-translate-x-[10vw] md:translate-y-0 lg:-translate-y-5">
          <h2 className="text-xl md:text-2xl font-bold text-[#663620] text-center mb-4">
            Past Conversations
          </h2>
          {loading ? (
            <div className="text-center py-4 text-[#663620]">Loading conversations...</div>
          ) : (
            <div
              className="max-h-96 md:max-h-72 lg:max-h-96 overflow-y-auto space-y-4 pr-2"
              onMouseLeave={() => setHoveredId(null)}
            >
              {pastChats.map(chat => (
                <motion.div
                  key={chat.id}
                  className="relative p-4 border border-[#663620] rounded-lg cursor-pointer"
                  onMouseEnter={() => setHoveredId(chat.id)}
                  onClick={() => onLoadConversation && onLoadConversation(chat.id)} // Add click handler
                >
                  {hoveredId === chat.id && (
                    <motion.div
                      className="absolute inset-0 border-4 border-[#a56a43] bg-[#a56a43]/20 rounded-lg"
                      layoutId="hover-box"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <h3
                    className={`relative text-[#663620] transition-all duration-200 ${
                      hoveredId === chat.id ? 'font-bold' : 'font-semibold'
                    }`}
                  >
                    {chat.title}
                  </h3>
                  <p
                    className={`relative text-sm text-[#663620] transition-all duration-200 ${
                      hoveredId === chat.id ? 'font-medium' : ''
                    }`}
                  >
                    {chat.date}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <CloseButton onClick={onClose} />
    </div>
  );
};

export default PastChatsDisplay;