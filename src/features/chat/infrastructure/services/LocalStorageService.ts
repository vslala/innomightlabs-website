interface ThoughtStep {
    step: string;
    step_title?: string;
    content: string;
}

interface ChatMessage {
    id: string;
    content: string;
    thoughts?: string;
    thoughtSteps?: ThoughtStep[];
    timestamp: Date;
    role: 'user' | 'assistant';
}

interface LocalStorageService {
    saveMessage(conversationId: string, message: ChatMessage): void;
    getMessages(conversationId: string): ChatMessage[];
    clearMessages(conversationId?: string): void;
}

class LocalStorageServiceImpl implements LocalStorageService {
    private readonly STORAGE_KEY = 'chat_conversations';
    private readonly MAX_CONVERSATIONS = 5;

    saveMessage(conversationId: string, message: ChatMessage): void {
        const allConversations = this.getAllConversations();
        const messages = allConversations[conversationId] || [];
        messages.push(message);
        allConversations[conversationId] = messages;

        // Keep only last 5 conversations
        const conversationIds = Object.keys(allConversations);
        if (conversationIds.length > this.MAX_CONVERSATIONS) {
            const oldestId = conversationIds[0];
            delete allConversations[oldestId];
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allConversations));
    }

    getMessages(conversationId: string): ChatMessage[] {
        const allConversations = this.getAllConversations();
        const messages = allConversations[conversationId] || [];

        return messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
        }));
    }

    clearMessages(conversationId?: string): void {
        if (conversationId) {
            const allConversations = this.getAllConversations();
            delete allConversations[conversationId];
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allConversations));
        } else {
            localStorage.removeItem(this.STORAGE_KEY);
        }
    }

    private getAllConversations(): Record<string, ChatMessage[]> {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    }
}

const getLocalStorageService = (): LocalStorageService => {
    return new LocalStorageServiceImpl();
};

export { getLocalStorageService };
export type { LocalStorageService, ChatMessage };
