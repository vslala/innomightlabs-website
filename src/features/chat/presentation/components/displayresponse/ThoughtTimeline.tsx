import { Paper, Stack, Text, ThemeIcon, Timeline } from '@mantine/core';
import { IconSearch, IconBulb, IconBrain, IconPuzzle, IconFileText, IconCheck, IconRefresh } from '@tabler/icons-react';
import type React from 'react';
import Markdown from 'react-markdown';

interface ThoughtStep {
    step: string;
    step_title?: string;
    content: string;
}

interface ThoughtTimelineProps {
    steps: ThoughtStep[];
}

const getStepIcon = (step: string) => {
    switch (step) {
        case 'analysis':
            return IconSearch;
        case 'planning':
            return IconBulb;
        case 'reasoning':
            return IconBrain;
        case 'synthesis':
            return IconPuzzle;
        case 'draft':
            return IconFileText;
        case 'evaluation':
            return IconCheck;
        case 'refinement':
            return IconRefresh;
        default:
            return IconBrain;
    }
};

const getStepColor = (step: string) => {
    switch (step) {
        case 'analysis':
            return 'blue';
        case 'planning':
            return 'yellow';
        case 'reasoning':
            return 'purple';
        case 'synthesis':
            return 'green';
        case 'draft':
            return 'orange';
        case 'evaluation':
            return 'teal';
        case 'refinement':
            return 'indigo';
        default:
            return 'gray';
    }
};

const ThoughtTimeline: React.FC<ThoughtTimelineProps> = ({ steps }) => {
    if (!steps.length) return null;

    return (
        <Paper p="md" shadow="sm" withBorder>
            <Timeline active={steps.length - 1} bulletSize={24} lineWidth={2}>
                {steps.map((step, idx) => {
                    const IconComponent = getStepIcon(step.step);
                    const color = getStepColor(step.step);

                    return (
                        <Timeline.Item
                            key={idx}
                            title={step.step_title || step.step.charAt(0).toUpperCase() + step.step.slice(1)}
                            bullet={
                                <ThemeIcon color={color} variant="outline">
                                    <IconComponent size={16} />
                                </ThemeIcon>
                            }
                            lineVariant="dashed"
                        >
                            <Stack>
                                <Text size="sm" c="dimmed">
                                    <Markdown>{step.content}</Markdown>
                                </Text>
                            </Stack>
                        </Timeline.Item>
                    );
                })}
            </Timeline>
        </Paper>
    );
};

export default ThoughtTimeline;
