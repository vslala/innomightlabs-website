import { useState, useCallback, useEffect, useMemo } from 'react';
import { getLocalStorageService, type ChatMessage } from '../features/chat/infrastructure/services/LocalStorageService';

interface ThoughtStep {
    step: string;
    step_title?: string;
    content: string;
}

export function useConversation(conversationId?: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const localStorageService = useMemo(() => getLocalStorageService(), []);

    useEffect(() => {
        if (conversationId) {
            setMessages(localStorageService.getMessages(conversationId));
        }
    }, [conversationId, localStorageService]);

    const addUserMessage = useCallback(
        (content: string) => {
            if (!conversationId) return;
            const userMessage: ChatMessage = {
                id: crypto.randomUUID(),
                content,
                role: 'user',
                timestamp: new Date(),
            };

            localStorageService.saveMessage(conversationId, userMessage);
            setMessages((prev) => [...prev, userMessage]);
            return userMessage.id;
        },
        [conversationId, localStorageService],
    );

    const addAssistantMessage = useCallback(
        (content: string, thoughts?: string, thoughtSteps?: ThoughtStep[]) => {
            if (!conversationId) return;
            const assistantMessage: ChatMessage = {
                id: crypto.randomUUID(),
                content,
                thoughts,
                thoughtSteps,
                role: 'assistant',
                timestamp: new Date(),
            };

            localStorageService.saveMessage(conversationId, assistantMessage);
            setMessages((prev) => [...prev, assistantMessage]);
            return assistantMessage.id;
        },
        [conversationId, localStorageService],
    );

    const clearConversation = useCallback(() => {
        if (conversationId) {
            localStorageService.clearMessages(conversationId);
            setMessages([]);
        }
    }, [conversationId, localStorageService]);

    return {
        messages,
        addUserMessage,
        addAssistantMessage,
        clearConversation,
    };
}
