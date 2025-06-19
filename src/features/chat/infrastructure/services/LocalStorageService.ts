interface ChatMessage {
    id: string;
    content: string;
    thoughts?: string;
    timestamp: Date;
    role: 'user' | 'assistant';
}

interface LocalStorageService {
    saveMessage(message: ChatMessage): void;
    getMessages(): ChatMessage[];
    clearMessages(): void;
}

class LocalStorageServiceImpl implements LocalStorageService {
    private readonly STORAGE_KEY = 'chat_messages';

    saveMessage(message: ChatMessage): void {
        const messages = this.getMessages();
        messages.push(message);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));
    }

    getMessages(): ChatMessage[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) return [];

        return JSON.parse(stored).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
        }));
    }

    clearMessages(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}

const getLocalStorageService = (): LocalStorageService => {
    return new LocalStorageServiceImpl();
};

export { getLocalStorageService };
export type { LocalStorageService, ChatMessage };
