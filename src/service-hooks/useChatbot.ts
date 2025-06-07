import { useState, useCallback } from 'react';
import { createParser, type EventSourceMessage, type ParseError } from 'eventsource-parser';
import { getConfig } from '../config';

const appConfig = getConfig();
const conversation_id = '58792226-20c5-4421-b6ec-52e64a2b33ae';

export interface StreamChunk {
    step: 'thinking' | 'final_response' | 'loading' | 'error' | 'end';
    content: string;
    timestamp?: Date;
}

export interface MessageRequest {
    content: string;
    parent_message_id?: string;
}

export function useChatbotSSE() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [thinkingResponse, setThinkingResponse] = useState<string>('');
    const [finalResponse, setFinalResponse] = useState<string>('');

    const askChatbot = useCallback(async (request: MessageRequest) => {
        setLoading(true);
        setError(null);
        setThinkingResponse('');
        setFinalResponse('');

        try {
            const res = await fetch(`${appConfig.API_HOST}/api/v1/conversation/${conversation_id}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Forwarded-User': 'vslala',
                    Accept: 'text/event-stream',
                },
                body: JSON.stringify(request),
            });
            if (!res.body) throw new Error('No response body');

            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');

            // set up the SSE parser
            const parser = createParser({
                onEvent(event: EventSourceMessage) {
                    // OpenAI-style “[DONE]” sentinel?
                    if (event.data === '[DONE]') {
                        return;
                    }
                    const chunk = JSON.parse(event.data) as StreamChunk;

                    if (chunk.step === 'thinking') {
                        setThinkingResponse((prev) => prev + chunk.content);
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
    }, []);

    return {
        askChatbot,
        loading,
        error,
        thinkingResponse,
        finalResponse,
    };
}
