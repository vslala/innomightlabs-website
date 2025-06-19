import { useState, useCallback, useEffect, useMemo } from 'react';
import { getLocalStorageService, type ChatMessage } from '../features/chat/infrastructure/services/LocalStorageService';

interface ThoughtStep {
    step: string;
    step_title?: string;
    content: string;
}

export function useConversation() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const localStorageService = useMemo(() => getLocalStorageService(), []);

    useEffect(() => {
        setMessages(localStorageService.getMessages());
    }, [localStorageService]);

    const addUserMessage = useCallback(
        (content: string) => {
            const userMessage: ChatMessage = {
                id: crypto.randomUUID(),
                content,
                role: 'user',
                timestamp: new Date(),
            };

            localStorageService.saveMessage(userMessage);
            setMessages((prev) => [...prev, userMessage]);
            return userMessage.id;
        },
        [localStorageService],
    );

    const addAssistantMessage = useCallback(
        (content: string, thoughts?: string, thoughtSteps?: ThoughtStep[]) => {
            const assistantMessage: ChatMessage = {
                id: crypto.randomUUID(),
                content,
                thoughts,
                thoughtSteps,
                role: 'assistant',
                timestamp: new Date(),
            };

            localStorageService.saveMessage(assistantMessage);
            setMessages((prev) => [...prev, assistantMessage]);
            return assistantMessage.id;
        },
        [localStorageService],
    );

    const clearConversation = useCallback(() => {
        localStorageService.clearMessages();
        setMessages([]);
    }, [localStorageService]);

    return {
        messages,
        addUserMessage,
        addAssistantMessage,
        clearConversation,
    };
}
