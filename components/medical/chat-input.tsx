'use client';

import { useState, useRef } from 'react';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about medical services, facilities, or emergency contacts..."
        className="input-field"
        aria-label="Message input"
        disabled={disabled}
      />

      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className="send-button"
        aria-label="Send message"
      >
        <span className="send-icon" aria-hidden="true">→</span>
      </button>

      <style jsx>{`
        .chat-input {
          display: flex;
          gap: var(--sp-2);
          align-items: center;
        }

        .input-field {
          flex: 1;
          padding: var(--sp-3) var(--sp-3);
          border: 1px solid var(--color-desert);
          border-radius: var(--radius-md);
          font-size: 14px;
          font-family: var(--font-body);
          color: var(--color-night);
          background: var(--color-white);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input-field::placeholder {
          color: var(--color-desert);
        }

        .input-field:focus {
          outline: none;
          border-color: var(--color-sea);
          box-shadow: 0 0 0 3px var(--color-sea-faint);
        }

        .input-field:disabled {
          background: var(--color-sand);
          cursor: not-allowed;
          opacity: 0.6;
        }

        .send-button {
          padding: var(--sp-3) var(--sp-3);
          background: var(--color-sea);
          color: var(--color-white);
          border: none;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .send-button:hover:not(:disabled) {
          background: #1560a0;
          transform: translateY(-1px);
        }

        .send-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .send-icon {
          font-size: 16px;
          line-height: 1;
        }
      `}</style>
    </div>
  );
}
