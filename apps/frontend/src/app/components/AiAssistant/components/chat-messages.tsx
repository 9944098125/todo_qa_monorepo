import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectAiMessages, selectAiLoading } from '../slice/selectors';
import { selectTheme, selectUser } from '../../../slice/selectors';
import { Sparkles, User as UserIcon, Bot, ArrowRight } from 'lucide-react';
import { Icons } from '../../ui/icons';

type Props = {
  onSelectSuggestion?: (prompt: string) => void;
};

export function ChatMessages({ onSelectSuggestion }: Props) {
  const messages = useSelector(selectAiMessages);
  const isLoading = useSelector(selectAiLoading);
  const user = useSelector(selectUser);
  const themeState = useSelector(selectTheme);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic suggestions tailored to user role and features
  const suggestions = [
    'Create 3 urgent tasks for payment gateway',
    'Create a new Tool category: Docker',
    'Add a React QA question: What is useMemo?',
    ...(user?.isAdmin
      ? ['Show all registered users in the system']
      : ['Show all my pending todos due this week']),
  ];

  // Auto-scroll to the bottom whenever a message arrives or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const isDark = themeState === 'dark';

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-600/10 border border-green-600/30 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-green-600 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold mb-2">TodoQA AI Assistant</h3>
        <p
          className={`text-sm max-w-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
        >
          Ask me to create, update, delete, or retrieve your Todo and QA items
          using natural language.
        </p>

        <div className="w-full max-w-sm flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600 text-left mb-1">
            Try asking:
          </p>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSelectSuggestion?.(suggestion)}
              type="button"
              className={`w-full text-left p-3 text-sm rounded-xl border transition-all flex items-center justify-between group ${
                isDark
                  ? 'border-gray-800 bg-gray-950/60 hover:border-green-600/50 hover:bg-gray-900'
                  : 'border-gray-200 bg-white hover:border-green-600/50 hover:bg-green-50/50'
              }`}
            >
              <span className="truncate pr-2">{suggestion}</span>
              <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-green-600 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(msg => {
        const isUser = msg.role === 'user';
        return (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold overflow-hidden ${
                isUser
                  ? 'bg-green-600 text-white'
                  : isDark
                    ? 'bg-gray-800 text-green-400 border border-green-600/30'
                    : 'bg-green-100 text-green-700 border border-green-300'
              }`}
            >
              {isUser ? (
                user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-4 h-4" />
                )
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                isUser
                  ? 'bg-green-600 text-white rounded-tr-none'
                  : isDark
                    ? 'bg-gray-900 border border-gray-800 text-gray-100 rounded-tl-none'
                    : 'bg-white border border-gray-200 text-gray-900 rounded-tl-none shadow-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <div
                className={`text-[10px] mt-1 text-right ${
                  isUser
                    ? 'text-green-200'
                    : isDark
                      ? 'text-gray-500'
                      : 'text-gray-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        );
      })}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-start gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              isDark
                ? 'bg-gray-800 text-green-400'
                : 'bg-green-100 text-green-700'
            }`}
          >
            <Bot className="w-4 h-4" />
          </div>
          <div
            className={`rounded-2xl rounded-tl-none p-3.5 text-sm flex items-center gap-2 ${
              isDark
                ? 'bg-gray-900 border border-gray-800'
                : 'bg-white border border-gray-200 shadow-sm'
            }`}
          >
            <Icons.Spinner className="w-4 h-4 animate-spin text-green-600" />
            <span
              className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Thinking...
            </span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
