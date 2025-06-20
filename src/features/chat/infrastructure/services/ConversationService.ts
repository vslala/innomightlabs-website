import { getConfig } from '../../../../config';
import type { Conversation, Message } from '../../application/dto/chatModels';

const appConfig = getConfig();

interface ConversationService {
    getAllConversations(): Promise<Array<Conversation>>;
    getMessages(conversationId: string): Promise<Array<Message>>;
}

class ConversationServiceRemote implements ConversationService {
    async getMessages(conversationId: string): Promise<Array<Message>> {
        const res = await fetch(`${appConfig.API_HOST}/api/v1/conversations/${conversationId}/messages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Forwarded-User': 'vslala',
            },
        });

        const data = (await res.json()) as Array<Message>;
        return data;
    }

    async getAllConversations(): Promise<Array<Conversation>> {
        const res = await fetch(`${appConfig.API_HOST}/api/v1/conversations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Forwarded-User': 'vslala',
            },
        });
        const data = (await res.json()) as Array<Conversation>;
        return data;
    }
}

class ConversationServiceLocal implements ConversationService {
    async getMessages(_conversationId: string): Promise<Array<Message>> {
        if (!_conversationId) {
            return [];
        }

        return [
            {
                id: '1',
                role: 'user',
                content: 'Hello, how can I help you today?',
                timestamp: new Date('2023-12-11T00:00:00Z'),
            },
            {
                id: '2',
                role: 'assistant',
                content: "Hi! I'm here to help. What questions do you have?",
                timestamp: new Date('2023-12-11T00:00:00Z'),
            },
            {
                id: '3',
                role: 'user',
                content: 'I need help with my code',
                timestamp: new Date('2023-12-11T00:00:00Z'),
            },
        ];
    }

    async getAllConversations(): Promise<Array<Conversation>> {
        return [
            {
                id: '58792226-20c5-4421-b6ec-52e64a2b33ae',
                title: 'Mock Conversation',
                status: 'completed',
                summary: 'This is a mock conversation for local development.',
                created_at: new Date('2023-12-11T00:00:00Z'),
                updated_at: new Date('2023-12-11T00:00:00Z'),
            },
        ];
    }
}

const getConversationService = () => {
    if (appConfig.NODE_ENV == 'development') {
        return new ConversationServiceLocal();
    } else {
        return new ConversationServiceRemote();
    }
};

export type { ConversationService };
export { getConversationService };
