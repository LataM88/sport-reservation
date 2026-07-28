import { useState } from 'react';
import Sidebar from '../../../components/NavLayout/Sidebar';
import AiHero from '../../../components/Ai/AiHero/AiHero';
import AiRecommended from '../../../components/Ai/AiRecommended/AiRecommended';
import AiChat from '../../../components/Ai/AiChat/AiChat';
import FacilityModal from '../../../components/modal/FacilityModal';
import useAiChat from '../../../hooks/useAiChat';
import { useAuth } from '../../../context/AuthContext';
import styles from './AiReservations.module.css';

const AiReservations = () => {
  const { isAuthenticated, token, userId } = useAuth();
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);

  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    messagesEndRef,
    textAreaRef,
    sendMessage,
  } = useAiChat({ token, userId });

  const handleSuggestedClick = (question: string) => {
    setInput(question);
    textAreaRef.current?.focus();
  };

  return (
    <div className={`${styles.wrapper} ${isAuthenticated ? styles.withSidebar : ''}`}>
      {isAuthenticated && <Sidebar />}

      <div className={styles.container}>
        <AiHero
          input={input}
          onInputChange={setInput}
          onSearch={sendMessage}
          onSuggestedClick={handleSuggestedClick}
        />

        <AiRecommended
          onReserveClick={(id) => setSelectedFacilityId(id)}
        />

        <AiChat
          messages={messages}
          input={input}
          isLoading={isLoading}
          error={error}
          messagesEndRef={messagesEndRef}
          textAreaRef={textAreaRef}
          onInputChange={setInput}
          onSend={sendMessage}
          onSuggestedClick={handleSuggestedClick}
        />
      </div>

      {selectedFacilityId && (
        <FacilityModal
          id={selectedFacilityId}
          onClose={() => setSelectedFacilityId(null)}
        />
      )}
    </div>
  );
};

export default AiReservations;
