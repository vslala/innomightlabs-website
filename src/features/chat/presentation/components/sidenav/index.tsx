import { Paper, ScrollArea, Stack, Title } from '@mantine/core';

interface SideNavProps {
    title: string;
    children?: React.ReactNode;
}

const SideNav: React.FC<SideNavProps> = (props) => {
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
                {props.title}
            </Title>
            <ScrollArea style={{ flex: 1 }}>
                <Stack p="md">{props.children}</Stack>
            </ScrollArea>
        </Paper>
    );
};

export default SideNav;
