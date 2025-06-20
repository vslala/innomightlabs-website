import { createParser, type EventSourceMessage, type ParseError } from 'eventsource-parser';
import { useCallback, useMemo, useState } from 'react';
import type { MessageRequest } from '../features/chat/application/dto/chatModels';
import { getChatService } from '../features/chat/infrastructure/services/ChatService';

interface ThoughtStep {
    step: string;
    step_title?: string;
    content: string;
}

export function useChatbotSSE() {
    const chatbotService = useMemo(() => getChatService(), []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [thoughtSteps, setThoughtSteps] = useState<ThoughtStep[]>([]);
    const [finalResponse, setFinalResponse] = useState<string>('');

    const askChatbot = useCallback(
        async (conversationId: string, request: MessageRequest) => {
            setLoading(true);
            setError(null);
            setThoughtSteps([]);
            setFinalResponse('');

            try {
                const res = await chatbotService.sendMessage(conversationId, request);
                const reader = res.body!.getReader();
                const decoder = new TextDecoder('utf-8');

                const parser = createParser({
                    onEvent(event: EventSourceMessage) {
                        if (event.data === '[DONE]') {
                            return;
                        }
                        const chunk = JSON.parse(event.data) as any;

                        if (chunk.step === 'final_response') {
                            setFinalResponse((prev) => prev + chunk.content);
                        } else if (chunk.step !== 'final_response') {
                            setThoughtSteps((prev) => {
                                const existingStepIndex = prev.findIndex((s) => s.step === chunk.step);
                                if (existingStepIndex >= 0) {
                                    const updated = [...prev];
                                    updated[existingStepIndex] = {
                                        ...updated[existingStepIndex],
                                        content: updated[existingStepIndex].content + chunk.content,
                                    };
                                    return updated;
                                } else {
                                    return [
                                        ...prev,
                                        {
                                            step: chunk.step,
                                            step_title: chunk.step_title,
                                            content: chunk.content,
                                        },
                                    ];
                                }
                            });
                        }
                    },
                    onError(err: ParseError) {
                        console.error('SSE parse error:', err);
                    },
                    onRetry: (intervalMs: number) => {
                        console.info(`Server asked to retry in ${intervalMs}ms`);
                    },
                });

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    parser.feed(decoder.decode(value, { stream: true }));
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        },
        [chatbotService],
    );

    return {
        askChatbot,
        loading,
        error,
        thoughtSteps,
        finalResponse,
    };
}
