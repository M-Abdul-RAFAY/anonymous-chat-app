import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex mb-4">
      <div className="bg-gray-200 px-4 py-2 rounded-lg rounded-tl-none max-w-[70%]">
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;