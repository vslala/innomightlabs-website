import { Box, Button, Flex, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react';

export interface FormValues {
    userQuery: string;
}

export interface InputAreaProps {
    loading: boolean;
    onSubmit: (values: FormValues) => void;
}

const InputArea: React.FC<InputAreaProps> = (props) => {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            userQuery: '',
        },
        validate: {
            userQuery: (value) => (value.length < 1 ? 'Query cannot be empty' : null),
        },
    });

    return (
        <>
            <Box
                component="form"
                onSubmit={form.onSubmit(props.onSubmit)}
                style={{
                    width: '100%',
                }}
            >
                <Flex align="stretch" style={{ width: '100%' }}>
                    <Textarea placeholder="Ask anything…" minRows={1} autosize {...form.getInputProps('userQuery')} style={{ flex: 1 }} />
                    <Button type="submit" ml="sm" loading={props.loading} style={{ flexShrink: 0, marginLeft: 8 }}>
                        Send
                    </Button>
                </Flex>
            </Box>
        </>
    );
};

export default InputArea;
