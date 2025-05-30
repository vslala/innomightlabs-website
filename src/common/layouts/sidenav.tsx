import type { ReactNode } from "react";
import { Paper, Stack, ScrollArea } from "@mantine/core";

interface SideNavProps {
  children?: ReactNode;
}

const SideNav: React.FC<SideNavProps> = ({ children }) => {
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
      <ScrollArea style={{ flex: 1 }}>
        <Stack p="md">
          {children}
        </Stack>
      </ScrollArea>
    </Paper>
  );
};

export default SideNav;