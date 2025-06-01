import { useState } from 'react'

const prefix = "http://localhost:8000/api/v1/chatbot"

interface StreamChunk {
    step: "thinking" | "final_response" | "loading" | "error"
    content: string
}

export function useChatbotSSE() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [thinkingResponse, setThinkingResponse] = useState<StreamChunk>({content: '', step: 'thinking'})
    const [finalResponse, setFinalResponse] = useState<StreamChunk>({content: '', step: 'loading'})

    async function askChatbot(request: { message: string, timestamp?: string }) {
        setLoading(true)
        setError(null)
        setThinkingResponse({content: '', step: 'thinking'})
        setFinalResponse({content: '', step: 'loading'})
        try {
            const res = await fetch(`${prefix}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                },
                body: JSON.stringify(request),
            })
            if (!res.body) throw new Error('No response body')
            const reader = res.body.getReader()
            const decoder = new TextDecoder('utf-8')
            let done = false
            while (!done) {
                const { value, done: doneReading } = await reader.read()
                if (value) {
                    const chunk = decoder.decode(value)
                    const jsonData = chunk.substring(5).trimStart() // Remove "data: " prefix
                    const streamChunk = JSON.parse(jsonData) as StreamChunk
                    if (streamChunk.step === 'thinking') {
                         setThinkingResponse(prev => ({...streamChunk, content: prev.content + streamChunk.content, step: streamChunk.step}))
                    }

                    if (streamChunk.step === 'final_response') {
                        setFinalResponse(prev => ({...streamChunk, content: prev.content + streamChunk.content, step: streamChunk.step}))
                    }
                }
                done = doneReading
            }
        } catch (err: { message: string }) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { askChatbot, loading, error, finalResponse, thinkingResponse}
}


