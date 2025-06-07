import { useState } from 'react';

export function useLLMStream<T>(url: string, payload: T, headers?: Record<string, string>) {
    const [data, setData] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    async function fetchStream() {
        setLoading(true);
        setData('');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(headers || {}),
            },
            body: JSON.stringify(payload),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) return;

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            setData((prev) => prev + decoder.decode(value, { stream: true }));
        }
        setLoading(false);
    }

    return { data, loading, fetchStream };
}
