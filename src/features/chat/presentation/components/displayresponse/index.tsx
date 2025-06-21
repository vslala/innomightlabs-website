import { ActionIcon, Box, Collapse, Group, Text } from '@mantine/core';
import { IconBrain, IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { useState } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './DisplayResponse.module.css';
import ThoughtTimeline from './ThoughtTimeline';

interface ThoughtStep {
    step: string;
    step_title?: string;
    content: string;
}

interface DisplayResponseProps {
    thoughtSteps: ThoughtStep[];
    finalResponse: string;
}

const DisplayResponse: React.FC<DisplayResponseProps> = ({ thoughtSteps, finalResponse }) => {
    const [showThinking, setShowThinking] = useState(false);

    return (
        <Box className={styles.messageContainer}>
            <Box className={styles.assistantMessage}>
                {thoughtSteps.length > 0 && (
                    <Box className={styles.thinkingSection}>
                        <Group className={styles.thinkingHeader} onClick={() => setShowThinking(!showThinking)}>
                            <IconBrain size={16} className={styles.thinkingIcon} />
                            <Text size="sm">Thinking...</Text>
                            <ActionIcon variant="transparent" size="sm">
                                {showThinking ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
                            </ActionIcon>
                        </Group>
                        <Collapse in={showThinking}>
                            <ThoughtTimeline steps={thoughtSteps} />
                        </Collapse>
                    </Box>
                )}

                <Box className={styles.responseContent}>
                    <Markdown
                        components={{
                            code({ className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                    <SyntaxHighlighter style={oneDark as any} language={match[1]} PreTag="div">
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {finalResponse}
                    </Markdown>
                </Box>
            </Box>
        </Box>
    );
};

export default DisplayResponse;
