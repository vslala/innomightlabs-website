import { useState, useCallback, useEffect, useMemo } from 'react';
import { getConversationService } from '../features/chat/infrastructure/services/ConversationService';
import type { Message } from '../features/chat/application/dto/chatModels';

export function useConversationMessages(conversationId?: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const conversationService = useMemo(() => getConversationService(), []);

    const fetchMessages = useCallback(async () => {
        if (!conversationId) return;

        setLoading(true);
        setError(null);
        try {
            const data = await conversationService.getMessages(conversationId);
            setMessages(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [conversationId, conversationService]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    return {
        messages,
        loading,
        error,
        fetchMessages,
    };
}
