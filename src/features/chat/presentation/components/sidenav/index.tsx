import { Paper, ScrollArea, Stack, Title, Text, Box } from '@mantine/core';
import type { Conversation } from '../../../application/dto/chatModels';

interface SideNavProps {
    title: string;
    conversations: Conversation[];
    children?: React.ReactNode;
}

const SideNav: React.FC<SideNavProps> = ({ title, conversations, children }) => {
    const truncateTitle = (title: string, maxLength: number = 30) => {
        return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
    };

    return (
        <Paper
            shadow="xs"
            radius={0}
            withBorder
            style={{
                width: 250,
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
            }}
        >
            <Title order={3} p="md" style={{ borderBottom: '1px solid #e0e0e0' }}>
                {title}
            </Title>
            <ScrollArea style={{ flex: 1 }}>
                <Stack p="md" gap="xs">
                    {conversations.map((conversation) => (
                        <Box
                            key={conversation.id}
                            p="sm"
                            style={{
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                ':hover': {
                                    backgroundColor: '#f8f9fa',
                                },
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <Text size="sm" fw={500} mb={4}>
                                {truncateTitle(conversation.title)}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {new Date(conversation.updated_at).toLocaleDateString()}
                            </Text>
                        </Box>
                    ))}
                    {children}
                </Stack>
            </ScrollArea>
        </Paper>
    );
};

export default SideNav;
