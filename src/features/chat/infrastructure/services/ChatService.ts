import { getConfig } from '../../../../config';
import type { MessageRequest } from '../../application/dto/chatModels';

interface ChatService {
    sendMessage(message: MessageRequest): Promise<Response>;
}

const appConfig = getConfig();
const conversation_id = '58792226-20c5-4421-b6ec-52e64a2b33ae';

export class ChatServiceRemote implements ChatService {
    async sendMessage(request: MessageRequest): Promise<Response> {
        const res = await fetch(`${appConfig.API_HOST}/api/v1/conversations/${conversation_id}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Forwarded-User': 'vslala',
                Accept: 'text/event-stream',
            },
            body: JSON.stringify(request),
        });

        if (!res.body) throw new Error('No response body');
        return res;
    }
}

class ChatServiceLocal implements ChatService {
    async sendMessage(message: MessageRequest): Promise<Response> {
        const content = message.content.toLowerCase();

        let thoughtContent = 'Analyzing your request...';
        let responseContent = 'This is a mock response for local development.';

        if (content.includes('code')) {
            thoughtContent = 'Looking for a good Python example...';
            responseContent =
                "Here's a simple Python function:\n\n```python\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# Example usage\nprint(fibonacci(10))  # Output: 55\n```";
        } else if (content.includes('joke')) {
            thoughtContent = 'Searching my joke database...';
            responseContent =
                'Here\'s a programming joke for you:\n\n**Why do programmers prefer dark mode?**\n\n*Because light attracts bugs!* 🐛\n\n---\n\n**Bonus joke:**\n\nA SQL query goes into a bar, walks up to two tables and asks:\n\n*"Can I join you?"* 😄';
        }

        const mockResponse = new Response(
            new ReadableStream({
                start(controller) {
                    const encoder = new TextEncoder();

                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ step: 'thought', content: thoughtContent })}\n\n`));

                    setTimeout(() => {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ step: 'final_response', content: responseContent })}\n\n`));
                        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                        controller.close();
                    }, 1000);
                },
            }),
            {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                },
            },
        );

        return mockResponse;
    }
}

const getChatService = (): ChatService => {
    const env = appConfig.NODE_ENV;
    if (env === 'development') {
        return new ChatServiceLocal();
    } else {
        return new ChatServiceRemote();
    }
};

export { getChatService };

export type { ChatService };
