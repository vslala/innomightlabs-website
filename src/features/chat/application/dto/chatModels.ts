export interface StreamChunk {
    step: 'thought' | 'final_response' | 'loading' | 'error' | 'end';
    content: string;
    timestamp?: Date;
}

export interface MessageRequest {
    content: string;
    parent_message_id?: string;
}
