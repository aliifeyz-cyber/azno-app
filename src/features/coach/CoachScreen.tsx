import React, { useState, useRef, useEffect } from 'react';
import { useCoach } from '../../context/CoachContext';
import { useAuth } from '../../context/AuthContext';
import { toPersianDigits } from '../../lib/persianDigits';
import { AznoHero } from '../../components/ui/AznoHero';
import { CrisisModal } from './CrisisModal';

const QUICK_PROMPTS = [
  'امروز اصلاً انگیزه ندارم...',
  'چطور با وسوسه شدید مقابله کنم؟',
  'لغزیدم و حالم بده، چیکار کنم؟',
  'برای شروع یک عادت جدید راهنماییم کن.',
];

export const CoachScreen: React.FC = () => {
  const {
    messages,
    sendMessage,
    isTyping,
    remainingQuota,
    maxQuota,
    clearChat,
    isCrisisModalOpen,
    openCrisisModal,
    closeCrisisModal,
  } = useCoach();
  const { heroName } = useAuth();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isTyping) return;
    sendMessage(text);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-lg mx-auto pb-16">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <AznoHero pose="confident" size={38} name={heroName} />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-gray-800">مربی «{heroName}»</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[10px] text-gray-500">
              سهمیه پیام امروز: {toPersianDigits(remainingQuota)} از {toPersianDigits(maxQuota)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openCrisisModal}
            className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl hover:bg-rose-100 transition-colors"
          >
            کمک فوری
          </button>
          <button
            type="button"
            onClick={clearChat}
            className="text-[11px] text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg"
            title="پاک کردن تاریخچه گفتگو"
          >
            پاک کردن
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && <AznoHero pose={msg.isCrisis ? 'calm' : 'cheer'} size={28} name={heroName} />}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#2F7D6D] text-white rounded-br-xs'
                    : msg.isCrisis
                    ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-bl-xs'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`text-[9px] mt-1 block text-left ${
                    isUser ? 'text-white/70' : 'text-gray-400'
                  }`}
                >
                  {toPersianDigits(msg.time)}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-end gap-2 justify-start">
            <AznoHero pose="confident" size={28} name={heroName} />
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-xs px-3.5 py-2.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts (if chat is short) */}
      {messages.length <= 3 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-1.5 overflow-x-auto shrink-0">
          {QUICK_PROMPTS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(p)}
              className="text-[11px] whitespace-nowrap bg-white border border-gray-200 text-gray-600 hover:border-[#2F7D6D] hover:text-[#2F7D6D] px-2.5 py-1 rounded-full transition-colors shrink-0"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="p-3 bg-white border-t border-gray-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`با «${heroName}» مشورت کن...`}
            className="flex-1 px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F7D6D]"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2.5 bg-[#2F7D6D] text-white rounded-xl hover:bg-[#256658] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>

      {/* Crisis Modal */}
      <CrisisModal isOpen={isCrisisModalOpen} onClose={closeCrisisModal} />
    </div>
  );
};
