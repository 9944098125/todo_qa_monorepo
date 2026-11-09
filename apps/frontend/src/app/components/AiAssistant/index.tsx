import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAiSlice } from './slice';
import { selectIsAiDrawerOpen } from './slice/selectors';
import { selectTheme } from '../../slice/selectors';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Sparkles, Trash2, X } from 'lucide-react';
import { ChatMessages } from './components/chat-messages';
import { ChatInput } from './components/chat-input';

export function AiAssistant() {
  const { actions } = useAiSlice();
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsAiDrawerOpen);
  const themeState = useSelector(selectTheme);
  const [presetPrompt, setPresetPrompt] = useState<string>('');

  const isDark = themeState === 'dark';

  const handleOpenChange = (open: boolean) => {
    dispatch(actions.toggleDrawer(open));
  };

  const handleSendMessage = (text: string) => {
    const userMessageId = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // 1. Add user message to Redux
    dispatch(
      actions.addMessage({
        id: userMessageId,
        role: 'user',
        content: text,
        timestamp,
      }),
    );

    // 2. Set loading state
    dispatch(actions.setLoading(true));

    // Phase 1 Mock Echo: Simulates AI response to verify UI functionality
    setTimeout(() => {
      dispatch(
        actions.addMessage({
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `I received your command: "${text}". In Phase 2 & 3, this will connect to the backend OpenRouter tool engine!`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }),
      );
      dispatch(actions.setLoading(false));
    }, 800);
  };

  const handleClearChat = () => {
    dispatch(actions.clearMessages());
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className={`w-full md:max-w-[80rem] p-0 flex flex-col h-full border-solid border-l-2 border-green-600 transition-colors duration-200 ${
          isDark ? 'bg-black text-white' : 'bg-white text-black'
        }`}
      >
        {/* Drawer Header */}
        <SheetHeader
          className={`px-5 py-4 border-b flex flex-row items-center justify-between space-y-0 ${
            isDark
              ? 'border-gray-800 bg-gray-950/80'
              : 'border-gray-200 bg-gray-50/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-15 h-15 rounded-xl bg-green-600/10 border border-green-600/30 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold flex items-center gap-2">
                TodoQA Assistant
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-green-600/10 text-green-600 border border-green-600/20">
                  Beta
                </span>
              </SheetTitle>
              <p
                className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                Natural language Todo & QA modules management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearChat}
              title="Clear conversation"
              type="button"
              className={`p-2 rounded-xl border transition-colors ${
                isDark
                  ? 'border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white'
                  : 'border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-black'
              }`}
            >
              <Trash2 className="w-10 h-10" />
            </button>
            <button
              onClick={() => handleOpenChange(false)}
              title="Close drawer"
              type="button"
              className={`p-2 rounded-xl border transition-colors ${
                isDark
                  ? 'border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white'
                  : 'border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-black'
              }`}
            >
              <X className="w-10 h-10" />
            </button>
          </div>
        </SheetHeader>

        {/* Conversation Body */}
        <ChatMessages onSelectSuggestion={prompt => setPresetPrompt(prompt)} />

        {/* Input Area */}
        <ChatInput
          presetText={presetPrompt}
          onClearPreset={() => setPresetPrompt('')}
          onSendMessage={handleSendMessage}
        />
      </SheetContent>
    </Sheet>
  );
}
