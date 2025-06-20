import { useState, useCallback, useEffect, useMemo } from 'react';
import { getConversationService } from '../features/chat/infrastructure/services/ConversationService';
import type { Conversation } from '../features/chat/application/dto/chatModels';

export function useConversations() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const conversationService = useMemo(() => getConversationService(), []);

    const fetchConversations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await conversationService.getAllConversations();
            setConversations(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [conversationService]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    return {
        conversations,
        loading,
        error,
        fetchConversations,
    };
}
