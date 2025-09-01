'use client';

import React from 'react';

interface Suggestion {
  id: string;
  text: string;
  type: 'destination' | 'activity' | 'accommodation' | 'transport';
  icon?: string;
}

interface SuggestionsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: Suggestion) => void;
  className?: string;
  visible?: boolean;
}

const Suggestions: React.FC<SuggestionsProps> = ({ 
  suggestions, 
  onSuggestionClick, 
  className = '',
  visible = true 
}) => {
  if (!visible || suggestions.length === 0) return null;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'destination':
        return '🌍';
      case 'activity':
        return '🎯';
      case 'accommodation':
        return '🏨';
      case 'transport':
        return '✈️';
      default:
        return '💡';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'destination':
        return 'border-blue-400/50 bg-blue-400/10';
      case 'activity':
        return 'border-green-400/50 bg-green-400/10';
      case 'accommodation':
        return 'border-purple-400/50 bg-purple-400/10';
      case 'transport':
        return 'border-orange-400/50 bg-orange-400/10';
      default:
        return 'border-white/20 bg-white/10';
    }
  };

  return (
    <div className={`fixed bottom-40 right-8 w-80 max-h-96 overflow-y-auto ${className}`}>
      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            onClick={() => onSuggestionClick(suggestion)}
            className={`p-4 rounded-xl border backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${getTypeColor(suggestion.type)}`}
            style={{
              boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
            }}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl flex-shrink-0">
                {suggestion.icon || getIconForType(suggestion.type)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm leading-relaxed">
                  {suggestion.text}
                </p>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white/80 bg-white/20`}>
                    {suggestion.type}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Scrollbar styling */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Suggestions; 