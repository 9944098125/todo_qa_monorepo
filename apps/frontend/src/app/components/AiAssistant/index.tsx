import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAiSlice } from './slice';
import { selectAiMessages, selectIsAiDrawerOpen } from './slice/selectors';
import { selectTheme } from '@/app/slice/selectors';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/app/components/ui/sheet';
import { Sparkles, Trash2, X } from 'lucide-react';
import { ChatMessages } from './components/chat-messages';
import { ChatInput } from './components/chat-input';

export function AiAssistant() {
  const { actions, useSendChatMessageMutation } = useAiSlice();
  const [sendChatMessage, { isLoading: isAiThinking }] =
    useSendChatMessageMutation();

  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsAiDrawerOpen);
  const messages = useSelector(selectAiMessages);
  const themeState = useSelector(selectTheme);
  const [presetPrompt, setPresetPrompt] = useState<string>('');

  const isDark = themeState === 'dark';

  const handleOpenChange = (open: boolean) => {
    dispatch(actions.toggleDrawer(open));
  };

  const handleSendMessage = async (text: string) => {
    const userMessageId = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // 1. Immediately append the user message to Redux chat history
    dispatch(
      actions.addMessage({
        id: userMessageId,
        role: 'user',
        content: text,
        timestamp,
      }),
    );

    // Sync slice loading indicator with RTK Query
    dispatch(actions.setLoading(true));
    dispatch(actions.setError(null));

    try {
      // 2. Prepare conversation history for the backend
      const history = messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      // 3. Execute the RTK Query mutation
      const response = await sendChatMessage({
        message: text,
        history,
      }).unwrap();

      // 4. Extract response text and any attached proposal from envelope
      const assistantText =
        response?.data?.data?.message ||
        response?.data?.message ||
        'I received your request.';

      const proposal = response?.data?.data?.proposal;

      // 5. Append assistant reply and proposal to Redux chat history
      dispatch(
        actions.addMessage({
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: assistantText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          proposal: proposal || undefined,
        }),
      );
    } catch (err: any) {
      console.error('AI Chat Mutation Error:', err);
      const errorMessage =
        typeof err === 'string'
          ? err
          : err?.data?.message ||
            err?.message ||
            'Could not connect to AI service.';

      dispatch(actions.setError(errorMessage));
      dispatch(
        actions.addMessage({
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Error: ${errorMessage}`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: 'error',
        }),
      );
    } finally {
      dispatch(actions.setLoading(false));
    }
  };

  const handleClearChat = () => {
    dispatch(actions.clearMessages());
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className={`w-full sm:max-w-[48rem] p-0 flex flex-col h-full border-l transition-colors duration-200 ${
          isDark
            ? 'bg-black border-gray-800 text-white'
            : 'bg-white border-gray-200 text-black'
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
            <div className="w-10 h-10 rounded-xl bg-green-600/10 border border-green-600/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold flex items-center gap-2">
                TodoQA Assistant
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-green-600/10 text-green-600 border border-green-600/20">
                  Live
                </span>
              </SheetTitle>
              <p
                className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                Connected via RTK Query & OpenRouter (LLaMA 3.1)
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
              <Trash2 className="w-4 h-4" />
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
              <X className="w-4 h-4" />
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
