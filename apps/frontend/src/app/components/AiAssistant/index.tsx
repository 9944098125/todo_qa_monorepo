import React, { useRef, useState } from 'react';
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
import { api as todoApi } from '@/app/pages/Todo/slice';
import { api as qaApi, qaActions } from '@/app/pages/Qa/slice';
import { api as adminApi } from '@/app/pages/Users/slice';
import { api as profileApi } from '@/app/pages/Profile/slice';
import { globalActions } from '@/app/slice';

export function AiAssistant() {
  const { actions, useSendChatMessageMutation } = useAiSlice();
  const [sendChatMessage, { isLoading: isAiThinking }] =
    useSendChatMessageMutation();

  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsAiDrawerOpen);
  const messages = useSelector(selectAiMessages);
  const themeState = useSelector(selectTheme);
  const [presetPrompt, setPresetPrompt] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const isDark = themeState === 'dark';

  const handleOpenChange = (open: boolean) => {
    dispatch(actions.toggleDrawer(open));
    inputRef.current?.focus();
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
      // Live Cache Invalidation: Refresh the screen automatically if something was executed in DB
      if (response?.data?.data?.executed) {
        const mod = response.data.data.executedModule;
        if (mod === 'TODO') dispatch(todoApi.util.invalidateTags(['Todo']));
        if (mod === 'TOOL') dispatch(qaApi.util.invalidateTags(['Tools']));
        if (mod === 'QA') dispatch(qaApi.util.invalidateTags(['Qa']));
        if (mod === 'USER') {
          dispatch(adminApi.util.invalidateTags(['Users']));
          dispatch(profileApi.util.invalidateTags(['Profile']));
          const updatedUser = response?.data?.data?.updatedUser;
          if (updatedUser) {
            dispatch(globalActions.setUser(updatedUser));
          }
        }
      }

      // Live UI Filter Sync: Update QA sort/importance filters if AI changed them
      const qaFilters = response?.data?.data?.qaFilters;
      if (qaFilters) {
        if (qaFilters.sort) {
          dispatch(qaActions.setSortOrder(qaFilters.sort));
        }
        if (qaFilters.importance) {
          dispatch(qaActions.setImportanceFilter(qaFilters.importance));
        }
      }

      // Live UI Theme Sync: Switch or toggle theme if AI instructed
      const nextTheme = response?.data?.data?.theme;
      if (nextTheme) {
        if (nextTheme === 'toggle') {
          dispatch(
            globalActions.setTheme(themeState === 'dark' ? 'light' : 'dark'),
          );
        } else {
          dispatch(globalActions.setTheme(nextTheme));
        }
      }
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
    inputRef.current?.focus();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className={`w-full md:max-w-[80rem] p-0 flex flex-col h-full shadow-[-4px_0_0_0_#16a34a] ${
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
            <div className="w-20 h-20 rounded-xl bg-green-600/10 border border-green-600/30 flex items-center justify-center">
              <Sparkles className="w-15 h-15 text-green-600" />
            </div>
            <div>
              <SheetTitle className="text-[1.8rem] font-bold flex items-center gap-2">
                TodoQA AI Assistant
                {/* <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-green-600/10 text-green-600 border border-green-600/20">
                  Live
                </span> */}
              </SheetTitle>
              <p
                className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                Connected via OpenRouter (LLaMA 3.1)
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
          isOpen={isOpen}
        />
      </SheetContent>
    </Sheet>
  );
}
