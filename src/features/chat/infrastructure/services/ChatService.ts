import { getConfig } from '../../../../config';
import type { MessageRequest } from '../../application/dto/chatModels';

interface ChatService {
    sendMessage(conversationId: string, message: MessageRequest): Promise<Response>;
}

const appConfig = getConfig();

export class ChatServiceRemote implements ChatService {
    async sendMessage(conversationId: string, request: MessageRequest): Promise<Response> {
        const res = await fetch(`${appConfig.API_HOST}/api/v1/conversations/${conversationId}/messages`, {
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
    async sendMessage(_conversationId: string, message: MessageRequest): Promise<Response> {
        const content = message.content.toLowerCase();

        let steps: Array<{ step: string; step_title?: string; content: string }> = [];
        let responseContent = 'This is a mock response for local development.';

        if (content.includes('multi-step')) {
            steps = [
                {
                    step: 'analysis',
                    step_title: 'Analyzing the Problem',
                    content: "Breaking down the user's request to understand the core requirements and constraints.",
                },
                {
                    step: 'planning',
                    step_title: 'Creating a Strategy',
                    content: 'Developing a structured approach to address each component of the problem systematically.',
                },
                {
                    step: 'reasoning',
                    step_title: 'Logical Processing',
                    content: 'Applying logical reasoning to evaluate different solutions and their potential outcomes.',
                },
                { step: 'synthesis', step_title: 'Combining Ideas', content: 'Integrating various concepts and approaches to form a comprehensive solution.' },
                {
                    step: 'evaluation',
                    step_title: 'Quality Assessment',
                    content: 'Reviewing the proposed solution for accuracy, completeness, and effectiveness.',
                },
            ];
            responseContent = `Based on my multi-step analysis, here's a comprehensive response that addresses your request through systematic thinking and evaluation.

## Key Findings

- **Systematic Approach**: Used structured thinking methodology
- **Comprehensive Analysis**: Evaluated multiple perspectives
- **Quality Assurance**: Reviewed for accuracy and completeness

This demonstrates the power of **multi-step reasoning** in problem-solving!`;
        } else if (content.includes('code')) {
            steps = [{ step: 'analysis', content: 'Looking for a good Python example...' }];
            responseContent = `Here's a simple Python function:

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Example usage
print(fibonacci(10))  # Output: 55
\`\`\``;
        } else if (content.includes('joke')) {
            steps = [{ step: 'analysis', content: 'Searching my joke database...' }];
            responseContent = `Here's a programming joke for you:

**Why do programmers prefer dark mode?**

*Because light attracts bugs!* 🐛

---

**Bonus joke:**

A SQL query goes into a bar, walks up to two tables and asks:

*"Can I join you?"* 😄`;
        } else {
            steps = [{ step: 'analysis', content: 'Analyzing your request...' }];
        }

        const mockResponse = new Response(
            new ReadableStream({
                start(controller) {
                    const encoder = new TextEncoder();
                    let stepIndex = 0;

                    const sendNextStep = () => {
                        if (stepIndex < steps.length) {
                            controller.enqueue(
                                encoder.encode(
                                    `data: ${JSON.stringify({
                                        step: steps[stepIndex].step,
                                        step_title: steps[stepIndex].step_title,
                                        content: steps[stepIndex].content,
                                    })}\n\n`,
                                ),
                            );
                            stepIndex++;
                            setTimeout(sendNextStep, 800);
                        } else {
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ step: 'final_response', content: responseContent })}\n\n`));
                            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                            controller.close();
                        }
                    };

                    sendNextStep();
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
