import React from 'react';
import { Card, Text, Divider, Stack } from '@mantine/core';
import Markdown from 'react-markdown';

export interface ChatMessageProps {
    content: string;
}
const ChatMessage: React.FC<ChatMessageProps> = (props) => {
    return (
        <Card mt="md" shadow="xs" p="lg" withBorder>
            <Stack>
                <Text>Assistant:</Text>
                <Divider />
                <Text>
                    <Markdown>{props.content}</Markdown>
                </Text>
            </Stack>
        </Card>
    );
};

export default ChatMessage;
