import { SendOutlined, RobotOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import type { RefObject } from 'react';
import type { AiMessage } from '../../../types/types';
import styles from './AiChat.module.css';

const { Title } = Typography;

const SUGGESTED_QUESTIONS = [
  'Znajdź wolny kort tenisowy jutro',
  'Gdzie mogę pograć w squasha dziś?',
  'Pływalnia rano w weekend',
];

interface AiChatProps {
  messages: AiMessage[];
  input: string;
  isLoading: boolean;
  error: string | null;
  messagesEndRef: RefObject<HTMLDivElement>;
  textAreaRef: RefObject<HTMLTextAreaElement>;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onSuggestedClick: (question: string) => void;
}

const AiChat = ({
  messages,
  input,
  isLoading,
  error,
  messagesEndRef,
  textAreaRef,
  onInputChange,
  onSend,
  onSuggestedClick,
}: AiChatProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <div className={styles.section}>
      <Title level={3} className={styles.sectionTitle}>
        Czat z Asystentem AI
      </Title>

      <div className={styles.chatWindow}>
        {/* nagłówek chatu */}
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderLeft}>
            <div className={styles.avatarIcon}>
              <RobotOutlined />
            </div>
            <div>
              <p className={styles.chatHeaderName}>PlayFlex AI</p>
              <p className={styles.chatHeaderStatus}>
                <span className={styles.statusDot} /> Online – gotowy do pomocy
              </p>
            </div>
          </div>
        </div>

        {/* obszar wiadomości */}
        <div className={styles.messagesArea}>
          {isEmpty && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrap}>
                <RobotOutlined className={styles.emptyIcon} />
              </div>
              <p className={styles.emptyTitle}>Jak mogę Ci pomóc?</p>
              <p className={styles.emptySubtitle}>
                Zapytaj o dostępne obiekty, godziny czy ceny – odpiszę od razu.
              </p>
              <div className={styles.emptyChips}>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    className={styles.emptyChip}
                    onClick={() => onSuggestedClick(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageRowUser : ''}`}
            >
              {msg.role === 'ai' && (
                <div className={styles.avatarAi}>
                  <RobotOutlined />
                </div>
              )}

              <div className={styles.bubbleWrapper}>
                <div
                  className={`${styles.bubble} ${msg.role === 'ai' ? styles.bubbleAi : styles.bubbleUser}`}
                >
                  {msg.text}
                </div>
                <span
                  className={`${styles.timestamp} ${msg.role === 'user' ? styles.timestampRight : ''}`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className={styles.messageRow}>
              <div className={styles.avatarAi}>
                <RobotOutlined />
              </div>
              <div className={styles.typingBubble}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.inputBar}>
          <textarea
            ref={textAreaRef}
            className={styles.textArea}
            rows={1}
            value={input}
            onChange={handleTextAreaChange}
            onKeyDown={handleKeyDown}
            placeholder="Napisz wiadomość… (Enter aby wysłać, Shift+Enter nowa linia)"
            disabled={isLoading}
          />
          <button
            className={styles.sendButton}
            onClick={() => onSend()}
            disabled={isLoading || !input.trim()}
            aria-label="Wyślij"
          >
            <SendOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
