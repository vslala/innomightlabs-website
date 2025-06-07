import { Box } from '@mantine/core';
import React from 'react';
import ThoughtTimeline from './ThoughtTimeline';
import ChatMessage from './ChatMessage';

interface DisplayResponseProps {
    thinkingResponse: string;
    finalResponse: string;
}

const DisplayResponse: React.FC<DisplayResponseProps> = ({ thinkingResponse, finalResponse }) => {
    return (
        <Box>
            {/* Collapsible Accordion for Thinking Steps */}
            <ThoughtTimeline thoughts={[thinkingResponse]}></ThoughtTimeline>

            {/* Final Response */}
            <ChatMessage content={finalResponse}></ChatMessage>
        </Box>
    );
};

export default DisplayResponse;
