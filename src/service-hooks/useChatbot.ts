import { createParser, type EventSourceMessage, type ParseError } from 'eventsource-parser';
import { useCallback, useMemo, useState } from 'react';
import type { MessageRequest, StreamChunk } from '../features/chat/application/dto/chatModels';
import { getChatService } from '../features/chat/infrastructure/services/chatService';

export function useChatbotSSE() {
    const chatbotService = useMemo(() => getChatService(), []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [thoughts, setThoughts] = useState<string>('');
    const [finalResponse, setFinalResponse] = useState<string>('');

    const askChatbot = useCallback(
        async (request: MessageRequest) => {
            setLoading(true);
            setError(null);
            setThoughts('');
            setFinalResponse('');

            try {
                const res = await chatbotService.sendMessage(request);
                const reader = res.body!.getReader();
                const decoder = new TextDecoder('utf-8');

                // set up the SSE parser
                const parser = createParser({
                    onEvent(event: EventSourceMessage) {
                        // OpenAI-style “[DONE]” sentinel?
                        if (event.data === '[DONE]') {
                            return;
                        }
                        const chunk = JSON.parse(event.data) as StreamChunk;

                        if (chunk.step === 'thought') {
                            setThoughts((prev) => prev + chunk.content);
                        } else if (chunk.step === 'final_response') {
                            setFinalResponse((prev) => prev + chunk.content);
                        }
                    },
                    onError(err: ParseError) {
                        console.error('SSE parse error:', err);
                    },
                    onRetry: (intervalMs: number) => {
                        console.info(`Server asked to retry in ${intervalMs}ms`);
                    },
                });

                // read & feed loop
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    // feed chunked text into the parser
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
        thoughts,
        finalResponse,
    };
}
