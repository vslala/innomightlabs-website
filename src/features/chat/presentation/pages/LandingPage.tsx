import { Box, Container, Flex } from '@mantine/core';
import React from 'react';
import { useChatbotSSE } from '../../../../service-hooks/useChatbot.ts';
import DisplayResponse from '../components/displayresponse/index.tsx';
import type { FormValues } from '../components/inputarea/index.tsx';
import InputArea from '../components/inputarea/index.tsx';
import SideNav from '../components/sidenav/index.tsx';

const LandingPage: React.FC = () => {
    const { askChatbot, loading, thinkingResponse, finalResponse } = useChatbotSSE();
    const handleFormSubmit = (values: FormValues) => {
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
                    {/* Only render if we have something to show */}
                    {(thinkingResponse || finalResponse) && <DisplayResponse thinkingResponse={thinkingResponse} finalResponse={finalResponse} />}
                </Box>

                {/* ------ Input area (fixed at bottom) ------ */}
                <InputArea onSubmit={handleFormSubmit} loading={loading}></InputArea>
            </Flex>
        </Container>
    );
};

export default LandingPage;
