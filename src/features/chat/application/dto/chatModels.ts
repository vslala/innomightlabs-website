export interface StreamChunk {
    step: 'thought' | 'final_response' | 'loading' | 'error' | 'end';
    content: string;
    timestamp?: Date;
}

export interface MessageRequest {
    content: string;
    parent_message_id?: string;
}

export interface Conversation {
    id: string;
    title: string;
    summary: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}

export type Role = 'user' | 'assistant';

export interface Message {
    id: string;
    content: string;
    role: Role;
    timestamp: Date;
}
