import { getConfig } from '../../../../config';
import type { Conversation } from '../../application/dto/chatModels';

const appConfig = getConfig();

interface ConversationService {
    getAllConversations(): Promise<Array<Conversation>>;
}

class ConversationServiceRemote implements ConversationService {
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
