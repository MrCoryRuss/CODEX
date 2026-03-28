'use client';

import type { ChatMessage as ChatMessageType } from '@/types/medical-chat';

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`message-container ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-bubble">
        <p className="message-text">{message.content}</p>

        {message.sources && message.sources.length > 0 && (
          <div className="sources-section">
            <p className="sources-label">Sources:</p>
            <ul className="sources-list">
              {message.sources.map((source) => (
                <li key={source.chunkId} className="source-item">
                  <span className="source-title">{source.title}</span>
                  <span className="source-page">p. {source.page}</span>
                  <span className="source-score">
                    {Math.round(source.relevanceScore * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        .message-container {
          display: flex;
          gap: var(--sp-2);
          margin-bottom: var(--sp-1);
        }

        .message-container.user {
          justify-content: flex-end;
        }

        .message-bubble {
          max-width: 80%;
          padding: var(--sp-3) var(--sp-3);
          border-radius: var(--radius-md);
          word-wrap: break-word;
        }

        .message-container.user .message-bubble {
          background: var(--color-sea);
          color: var(--color-white);
        }

        .message-container.assistant .message-bubble {
          background: var(--color-sand);
          color: var(--color-night);
        }

        .message-text {
          font-size: 15px;
          line-height: 1.5;
          margin: 0;
        }

        .sources-section {
          margin-top: var(--sp-3);
          padding-top: var(--sp-3);
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .message-container.user .sources-section {
          border-top-color: rgba(255, 255, 255, 0.2);
        }

        .sources-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin: 0 0 var(--sp-1) 0;
          opacity: 0.8;
        }

        .sources-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--sp-1);
        }

        .source-item {
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--sp-1);
          opacity: 0.85;
        }

        .source-title {
          font-weight: 500;
        }

        .source-page {
          font-family: var(--font-data);
          font-size: 11px;
        }

        .source-score {
          font-family: var(--font-data);
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.1);
        }

        .message-container.user .source-score {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
}
