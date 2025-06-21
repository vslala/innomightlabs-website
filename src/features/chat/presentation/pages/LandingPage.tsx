import { Container } from '@mantine/core';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useConversations } from '../../../../service-hooks/useConversations.ts';
import SideNav from '../components/sidenav/index.tsx';

const LandingPage: React.FC = () => {
    const { conversations } = useConversations();
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
            <SideNav title="Conversations" conversations={conversations} />
            <Outlet />
        </Container>
    );
};

export default LandingPage;
