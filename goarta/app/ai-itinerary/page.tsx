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