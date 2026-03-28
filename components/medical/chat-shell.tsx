'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from './chat-message';
import ChatInput from './chat-input';
import type { ChatMessage as ChatMessageType } from '@/types/medical-chat';

export default function ChatShell() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m the Posada Medical Guide assistant. I can help you find nearby medical facilities, emergency contacts, and health information. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I received your message. In a production environment, this would be connected to a RAG system to provide accurate medical information.',
        timestamp: new Date(),
        sources: [
          {
            chunkId: 'doc-1',
            title: 'Medical Facilities Guide',
            page: 1,
            relevanceScore: 0.85,
            preview: 'Information about local medical facilities...',
          },
        ],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="chat-shell">
      <div className="chat-messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-wrapper">
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>

      <style jsx>{`
        .chat-shell {
          display: flex;
          flex-direction: column;
          height: 500px;
          background: var(--color-white);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: var(--sp-4);
          display: flex;
          flex-direction: column;
          gap: var(--sp-3);
        }

        .loading-indicator {
          display: flex;
          gap: var(--sp-1);
          align-items: center;
        }

        .loading-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-desert);
          animation: bounce 1.4s infinite;
        }

        .loading-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 60%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-8px);
          }
        }

        .chat-input-wrapper {
          padding: var(--sp-4);
          border-top: 1px solid var(--color-sand);
          background: var(--color-sand);
        }

        /* Scrollbar styling */
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: var(--color-sand);
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: var(--color-desert);
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: #b8825a;
        }
      `}</style>
    </div>
  );
}
