import { useState, useRef, useEffect, useCallback } from 'react';
import type { AiMessage } from '../types/types';

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string;

const getNow = () =>
  new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

const extractText = (data: unknown): string => {
  if (typeof data === 'string') return data;

  if (Array.isArray(data)) {
    const first = data[0];
    if (first && typeof first === 'object') {
      const obj = first as Record<string, unknown>;
      if (typeof obj.output === 'string') return obj.output;
      if (typeof obj.text === 'string') return obj.text;
      if (typeof obj.message === 'string') return obj.message;
      if (typeof obj.response === 'string') return obj.response;
    }
  }

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (typeof obj.output === 'string') return obj.output;
    if (typeof obj.text === 'string') return obj.text;
    if (typeof obj.message === 'string') return obj.message;
    if (typeof obj.response === 'string') return obj.response;
  }

  return JSON.stringify(data, null, 2);
};

interface UseAiChatOptions {
  token: string | null;
  userId: string | null;
}

const useAiChat = ({ token, userId }: UseAiChatOptions) => {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const idCounter = useRef(0);
  const sessionId = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const trimmed = (text ?? input).trim();
      if (!trimmed || isLoading) return;

      const userMsg: AiMessage = {
        id: ++idCounter.current,
        role: 'user',
        text: trimmed,
        time: getNow(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setError(null);
      setIsLoading(true);

      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
      }

      try {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatInput: trimmed,
            sessionId: sessionId.current,
            token,
            userId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Błąd serwera: ${response.status}`);
        }

        const data = await response.json();

        const aiMsg: AiMessage = {
          id: ++idCounter.current,
          role: 'ai',
          text: extractText(data),
          time: getNow(),
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        console.error('AI fetch error:', err);
        setError('Nie udało się połączyć z asystentem AI. Spróbuj ponownie.');
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, token, userId],
  );

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    messagesEndRef,
    textAreaRef,
    sendMessage,
  };
};

export default useAiChat;
