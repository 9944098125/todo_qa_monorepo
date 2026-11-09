import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../../slice/selectors';
import { selectAiLoading } from '../slice/selectors';

type Props = {
  onSendMessage: (message: string) => void;
  presetText?: string;
  onClearPreset?: () => void;
};

export function ChatInput({ onSendMessage, presetText, onClearPreset }: Props) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const themeState = useSelector(selectTheme);
  const isLoading = useSelector(selectAiLoading);

  const isDark = themeState === 'dark';

  // If a preset suggestion was clicked in ChatMessages, populate the input
  useEffect(() => {
    if (presetText) {
      setInput(presetText);
      onClearPreset?.();
      textareaRef.current?.focus();
    }
  }, [presetText, onClearPreset]);

  // Auto-resize textarea height as the user types
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`p-3 border-t ${
        isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'
      }`}
    >
      <div
        className={`relative rounded-2xl border transition-all ${
          isDark
            ? 'border-gray-800 bg-gray-950 focus-within:border-green-600/70'
            : 'border-gray-300 bg-gray-50 focus-within:border-green-600 focus-within:bg-white'
        }`}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={4}
          placeholder="Ask AI to create, edit or find Todo/Qa items..."
          className={`w-full resize-none bg-transparent px-4 py-3.5 pr-14 text-sm outline-none placeholder:text-gray-400 disabled:opacity-50 max-h-[120px] ${
            isDark ? 'text-white' : 'text-black'
          }`}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          type="button"
          aria-label="Send message"
          className="absolute right-2.5 bottom-2.5 p-2 rounded-xl bg-green-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <CornerDownLeft className="w-3 h-3" /> Press <b>Enter</b> to send,{' '}
          <b>Shift+Enter</b> for new line
        </span>
      </div>
    </div>
  );
}
