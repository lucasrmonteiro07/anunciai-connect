import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from './button';
import Chat from '../Chat';

interface FloatingChatProps {
  receiverId?: string;
  receiverName?: string;
  isVip?: boolean;
}

const FloatingChat = ({ receiverId, receiverName, isVip = false }: FloatingChatProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Só mostrar se tiver receiverId válido
  if (!receiverId || receiverId.trim() === '') {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className={`h-14 w-14 rounded-full shadow-lg ${
              isVip 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-2 border-orange-400/50 shadow-orange-500/20' 
                : 'bg-primary hover:bg-primary/90'
            }`}
            size="sm"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 w-80 h-96 bg-card rounded-lg shadow-xl flex flex-col ${
          isVip 
            ? 'border-2 border-orange-500/50 shadow-lg shadow-orange-500/20' 
            : 'border border-border'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            isVip ? 'border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10' : 'border-border'
          }`}>
            <h3 className="font-semibold text-sm flex items-center gap-2">
              {isVip && <span className="text-orange-500">🔥</span>}
              Chat {isVip ? 'VIP ' : ''}com {receiverName || 'Anunciante'}
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
              receiverName={receiverName || 'Anunciante'}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;