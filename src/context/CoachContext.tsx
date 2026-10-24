import React, { createContext, useContext, useState, useEffect } from 'react';
import { CoachMessage } from '../data/types';
import { coachRepository } from '../data/repositories/coachRepository';
import { aiService } from '../services/aiService';
import { detectCrisis } from '../domain/crisisDetector';
import { useAuth } from './AuthContext';

interface CoachContextType {
  messages: CoachMessage[];
  loading: boolean;
  isTyping: boolean;
  remainingQuota: number;
  maxQuota: number;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => Promise<void>;
  isCrisisModalOpen: boolean;
  closeCrisisModal: () => void;
  openCrisisModal: () => void;
}

const CoachContext = createContext<CoachContextType | null>(null);

export const CoachProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { heroName } = useAuth();
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [remainingQuota, setRemainingQuota] = useState(5);
  const [maxQuota, setMaxQuota] = useState(5);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const msgs = await coachRepository.getMessages();
      const quota = await coachRepository.getDailyQuota();
      setMessages(msgs);
      setRemainingQuota(quota.remaining);
      setMaxQuota(quota.max);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const time = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: CoachMessage = {
      id: 'm_' + Date.now(),
      sender: 'user',
      text: trimmed,
      time,
    };

    // Append user message immediately
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    await coachRepository.addMessage(userMsg);

    // Crisis Check in service layer!
    const crisisCheck = detectCrisis(trimmed);
    if (crisisCheck.isCrisis) {
      // Do NOT deduct quota!
      setIsCrisisModalOpen(true);

      const aiCrisisMsg: CoachMessage = {
        id: 'm_' + (Date.now() + 1),
        sender: 'ai',
        text: `نگرانت شدم رفیق. من «${heroName}» هستم و همیشه در کنارت، ولی وقتی فشار روحی اینقدر زیاد میشه بهترین کار صحبت با یه مشاور متخصص یا شماره‌های پشتیبانی اورژانسیه. زندگی و آرامش تو بالاتر از هر عادتیه.`,
        time,
        isCrisis: true,
      };

      setMessages((prev) => [...prev, aiCrisisMsg]);
      await coachRepository.addMessage(aiCrisisMsg);
      return;
    }

    // Check quota
    if (remainingQuota <= 0) {
      const aiQuotaMsg: CoachMessage = {
        id: 'm_' + (Date.now() + 1),
        sender: 'ai',
        text: `سهمیه پیام‌های رایگان امروز به پایان رسیده رفیق! فردا با انرژی دوباره کنارتم تا با هم ادامه بدیم.`,
        time,
      };
      setMessages((prev) => [...prev, aiQuotaMsg]);
      await coachRepository.addMessage(aiQuotaMsg);
      return;
    }

    // Deduct quota
    const newRemaining = await coachRepository.decrementQuota();
    setRemainingQuota(newRemaining);

    // AI thinking state
    setIsTyping(true);
    try {
      // Simulated natural delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const aiRes = await aiService.generateResponse(trimmed, { heroName });
      const aiReply: CoachMessage = {
        id: 'm_' + (Date.now() + 1),
        sender: 'ai',
        text: aiRes.text,
        time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        isCrisis: aiRes.isCrisis,
      };

      setMessages((prev) => [...prev, aiReply]);
      await coachRepository.addMessage(aiReply);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = async () => {
    await coachRepository.clearMessages();
    const fresh = await coachRepository.getMessages();
    setMessages(fresh);
  };

  return (
    <CoachContext.Provider
      value={{
        messages,
        loading,
        isTyping,
        remainingQuota,
        maxQuota,
        sendMessage,
        clearChat,
        isCrisisModalOpen,
        closeCrisisModal: () => setIsCrisisModalOpen(false),
        openCrisisModal: () => setIsCrisisModalOpen(true),
      }}
    >
      {children}
    </CoachContext.Provider>
  );
};

export const useCoach = () => {
  const ctx = useContext(CoachContext);
  if (!ctx) throw new Error('useCoach must be used within CoachProvider');
  return ctx;
};
