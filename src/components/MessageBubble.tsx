import React from 'react';
import { Message } from '../types';
import { formatTime } from '../utils/formatTime';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isCurrentUser
            ? 'bg-emerald-500 text-white rounded-tr-none'
            : 'bg-white text-gray-800 rounded-tl-none'
        }`}
      >
        <p className="break-words">{message.text}</p>
        <div className={`flex items-center justify-end mt-1 text-xs ${
          isCurrentUser ? 'text-emerald-100' : 'text-gray-500'
        }`}>
          <span>{formatTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;