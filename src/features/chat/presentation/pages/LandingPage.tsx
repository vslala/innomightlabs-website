import { Box, Container, Flex } from '@mantine/core';
import React, { useEffect, useRef } from 'react';
import { useChatbotSSE } from '../../../../service-hooks/useChatbot.ts';
import { useConversation } from '../../../../service-hooks/useConversation.ts';
import DisplayResponse from '../components/displayresponse/index.tsx';
import type { FormValues } from '../components/inputarea/index.tsx';
import InputArea from '../components/inputarea/index.tsx';
import SideNav from '../components/sidenav/index.tsx';

const LandingPage: React.FC = () => {
    const { askChatbot, loading, thoughts, finalResponse } = useChatbotSSE();
    const { messages, addUserMessage, addAssistantMessage } = useConversation();
    const savedResponse = useRef(false);

    useEffect(() => {
        if (!loading && finalResponse && !savedResponse.current) {
            addAssistantMessage(finalResponse, thoughts);
            savedResponse.current = true;
        }
        if (loading) {
            savedResponse.current = false;
        }
    }, [loading, finalResponse, thoughts, addAssistantMessage]);

    const handleFormSubmit = (values: FormValues) => {
        addUserMessage(values.userQuery);
        askChatbot({
            content: values.userQuery,
        });
    };
    return (
        <Container
            fluid
            size="100%"
            p={0}
            style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            {/* Side navigation (fixed width) */}
            <SideNav title="Conversations"></SideNav>

            {/* Main chat area: flex column, fills all leftover space */}
            <Flex
                direction="column"
                style={{
                    flex: 1,
                    height: '100%',
                    padding: '16px',
                    boxSizing: 'border-box',
                }}
            >
                {/* ------ Chat history (scrollable) ------ */}
                <Box
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        marginBottom: '16px',
                    }}
                >
                    {messages.map((message) =>
                        message.role === 'assistant' ? (
                            <DisplayResponse key={message.id} thinkingResponse={message.thoughts || ''} finalResponse={message.content} />
                        ) : (
                            <Box key={message.id} style={{ marginBottom: '16px', padding: '12px', background: '#e3f2fd', borderRadius: '8px' }}>
                                {message.content}
                            </Box>
                        ),
                    )}
                    {loading && (thoughts || finalResponse) && <DisplayResponse thinkingResponse={thoughts} finalResponse={finalResponse} />}
                </Box>

                {/* ------ Input area (fixed at bottom) ------ */}
                <InputArea onSubmit={handleFormSubmit} loading={loading}></InputArea>
            </Flex>
        </Container>
    );
};

export default LandingPage;
