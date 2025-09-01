'use client';

import Background from '@/components/ai-itenarary com/background';
import ChatBubble from '@/components/ai-itenarary com/right_chat_bubble';
import LeftChatBubble from '@/components/ai-itenarary com/left_chat_bubble';
import PastHistoryButton from '@/components/ai-itenarary com/PastHistoryButton';
import ChatInput from '@/components/ChatInput';
import { useRouter } from 'next/navigation';

export default function AIItineraryPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="relative min-h-screen">
      <PastHistoryButton />
      {/* Background Animation */}
      <Background className="fixed inset-0" />
      
      {/* Header */}
      <div className="relative z-30 p-6">
        <div className="flex items-center justify-between">
          <div></div>
          <button 
            onClick={handleBack}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="relative z-20 min-h-screen flex flex-col justify-end px-6 pb-4">
        <div className="w-full max-w-4xl mx-auto space-y-4 flex flex-col">
            <div className="max-w-2xl self-end">
              <ChatBubble />
            </div>
            <div className="max-w-2xl self-start">
              <LeftChatBubble />
            </div>
        </div>
        <div className="w-full max-w-4xl mx-auto mt-4">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}