'use client';
import { ChatShell } from "@/components/medical";

export default function AskMedicalGuidePage() {
  return (
    <div className="page-container">
      <div className="chat-header">
        <h1>Ask the Medical Guide</h1>
        <p className="subtitle">
          Chat with our AI assistant to find medical facilities, emergency
          contacts, and health information for Posada Concepción
        </p>
      </div>

      <div className="chat-wrapper">
        <ChatShell />
      </div>

      <style jsx>{`
        .page-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--color-white);
        }

        .chat-header {
          background: linear-gradient(
            135deg,
            var(--color-sea) 0%,
            var(--color-sea-light) 100%
          );
          color: var(--color-white);
          padding: var(--sp-5) var(--sp-4);
          border-bottom: 2px solid var(--color-sea-dark);
        }

        .chat-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 var(--sp-2) 0;
        }

        .subtitle {
          font-size: 15px;
          margin: 0;
          opacity: 0.95;
          max-width: 600px;
          line-height: 1.5;
        }

        .chat-wrapper {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 640px) {
          .chat-header {
            padding: var(--sp-6);
          }

          .chat-header h1 {
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  );
}
