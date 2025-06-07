import type { ReactNode } from 'react';
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div {...mantineHtmlProps}>
            <ColorSchemeScript />
            <MantineProvider>{children}</MantineProvider>
        </div>
    );
};

export default Layout;
