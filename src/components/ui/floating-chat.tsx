import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from './button';
import Chat from '../Chat';

interface FloatingChatProps {
  receiverId?: string;
  receiverName?: string;
}

const FloatingChat = ({ receiverId, receiverName }: FloatingChatProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Só mostrar se tiver receiverId
  if (!receiverId) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
            size="sm"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-card border border-border rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-sm">
              Chat com {receiverName || 'Anunciante'}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden">
            <Chat 
              receiverId={receiverId}
              receiverName={receiverName}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;