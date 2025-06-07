// ThoughtTimeline.jsx
import { Paper, Stack, Text, ThemeIcon, Timeline } from '@mantine/core';
import { IconClock24 } from '@tabler/icons-react';
import type React from 'react';
import Markdown from 'react-markdown';

interface ThoughtTimelineProps {
    thoughts: Array<string>;
}

const ThoughtTimeline: React.FC<ThoughtTimelineProps> = (props) => {
    return (
        <Paper p="md" shadow="sm" withBorder>
            <Timeline active={props.thoughts.length - 1} bulletSize={24} lineWidth={2}>
                {props.thoughts.map((thought, idx) => (
                    <Timeline.Item
                        key={idx}
                        title={`Thought ${idx + 1}`}
                        bullet={
                            <ThemeIcon color="blue" variant="outline">
                                <IconClock24 size={16} />
                            </ThemeIcon>
                        }
                        lineVariant="dashed"
                    >
                        <Stack>
                            <Text>
                                <Markdown>{thought}</Markdown>
                            </Text>
                        </Stack>
                    </Timeline.Item>
                ))}
            </Timeline>
        </Paper>
    );
};

export default ThoughtTimeline;
