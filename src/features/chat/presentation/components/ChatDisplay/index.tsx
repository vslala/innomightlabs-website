import { Box, Flex } from '@mantine/core';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useChatbotSSE } from '../../../../../service-hooks/useChatbot';
import { useConversationMessages } from '../../../../../service-hooks/useConversationMessages';
import { useConversation } from '../../../../../service-hooks/useConversation';
import DisplayResponse from '../displayresponse';
import type { FormValues } from '../inputarea';
import InputArea from '../inputarea';

const ChatDisplay: React.FC = () => {
    const { conversationId } = useParams<{ conversationId: string }>();
    const { askChatbot, loading, thoughtSteps, finalResponse } = useChatbotSSE();
    const { messages: backendMessages } = useConversationMessages(conversationId);
    const { messages: localMessages, addUserMessage, addAssistantMessage } = useConversation(conversationId);
    const savedResponse = useRef(false);

    useEffect(() => {
        if (!loading && finalResponse && !savedResponse.current) {
            addAssistantMessage(finalResponse, '', thoughtSteps);
            savedResponse.current = true;
        }
        if (loading) {
            savedResponse.current = false;
        }
    }, [loading, finalResponse, thoughtSteps, addAssistantMessage]);

    const handleFormSubmit = (values: FormValues) => {
        if (!conversationId) return;
        addUserMessage(values.userQuery);
        askChatbot(conversationId, {
            content: values.userQuery,
        });
    };

    // Merge backend messages with local messages, prioritizing local thoughtSteps
    const mergedMessages = backendMessages.map((backendMsg) => {
        const localMsg = localMessages.find((local) => local.id === backendMsg.id);
        return localMsg ? { ...backendMsg, thoughtSteps: localMsg.thoughtSteps } : { ...backendMsg, thoughtSteps: [] };
    });

    // Add any local-only messages
    const localOnlyMessages = localMessages.filter((local) => !backendMessages.some((backend) => backend.id === local.id));

    const allMessages = [...mergedMessages, ...localOnlyMessages];

    return (
        <Flex
            direction="column"
            style={{
                flex: 1,
                height: '100%',
                padding: '16px',
                boxSizing: 'border-box',
            }}
        >
            <Box
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    marginBottom: '16px',
                }}
            >
                {allMessages.map((message) =>
                    message.role === 'assistant' ? (
                        <DisplayResponse key={message.id} thoughtSteps={message.thoughtSteps || []} finalResponse={message.content} />
                    ) : (
                        <Box key={message.id} style={{ marginBottom: '16px', padding: '12px', background: '#e3f2fd', borderRadius: '8px' }}>
                            {message.content}
                        </Box>
                    ),
                )}
                {loading && (thoughtSteps.length > 0 || finalResponse) && <DisplayResponse thoughtSteps={thoughtSteps} finalResponse={finalResponse} />}
            </Box>
            <InputArea onSubmit={handleFormSubmit} loading={loading} />
        </Flex>
    );
};

export default ChatDisplay;
