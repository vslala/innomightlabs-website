import React from 'react'
import {
  Accordion,
  Box,
  Button,
  Container,
  Flex,
  Textarea,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import Layout from './common/layouts/layout.tsx'
import SideNav from './common/layouts/sidenav.tsx'
import { useChatbotSSE } from './service-hooks/useChatbot.ts'
import ReactMarkdown from 'react-markdown'

interface DisplayResponseProps {
  thinkingResponse: { step: string; content: string }
  finalResponse: { step: string; content: string }
}

const DisplayResponse: React.FC<DisplayResponseProps> = ({
  thinkingResponse,
  finalResponse,
}) => {
  return (
    <Box>
      {/* Collapsible Accordion for Thinking Steps */}
      <Accordion
        variant="separated"
        style={{ marginBottom: 8 }}
        styles={{
          item: {
            borderRadius: 4,
            overflow: 'hidden',
          },
        }}
      >
        <Accordion.Item value="thinking">
          <Accordion.Control>Thinking Steps</Accordion.Control>
          <Accordion.Panel>
            <ReactMarkdown>{thinkingResponse.content}</ReactMarkdown>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      {/* Final Response */}
      <Box
        style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: '#f0f0f0',
          borderRadius: 4,
        }}
      >
        <ReactMarkdown>{finalResponse.content}</ReactMarkdown>
      </Box>
    </Box>
  )
}

const App: React.FC = () => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      userQuery: '',
    },
    validate: {
      userQuery: (value) =>
        value.length < 1 ? 'Query cannot be empty' : null,
    },
  })

  const {
    askChatbot,
    loading,
    thinkingResponse,
    finalResponse,
  } = useChatbotSSE()

  return (
    <Layout>
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
        {/* Side navigation (fixed width) */}
        <SideNav>
          <Title
            order={3}
            p="md"
            style={{ borderBottom: '1px solid #e0e0e0' }}
          >
            Conversations
          </Title>
          {/* …any additional nav items… */}
        </SideNav>

        {/* Main chat area: flex column, fills all leftover space */}
        <Flex
          direction="column"
          style={{
            flex: 1,
            height: '100%',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          {/* ------ Chat history (scrollable) ------ */}
          <Box
            style={{
              flex: 1,
              overflowY: 'auto',
              marginBottom: '16px',
            }}
          >
            {/* Only render if we have something to show */}
            {(thinkingResponse.content || finalResponse.content) && (
              <DisplayResponse
                thinkingResponse={thinkingResponse}
                finalResponse={finalResponse}
              />
            )}
          </Box>

          {/* ------ Input area (fixed at bottom) ------ */}
          <Box
            component="form"
            onSubmit={form.onSubmit((values) => {
              askChatbot({
                message: values.userQuery,
                timestamp: new Date().toISOString(),
              })
              form.reset()
            })}
            style={{
              width: '100%',
            }}
          >
            <Flex align="stretch" style={{ width: '100%' }}>
              <Textarea
                placeholder="Ask anything…"
                minRows={1}
                autosize
                {...form.getInputProps('userQuery')}
                style={{ flex: 1 }}
              />
              <Button
                type="submit"
                ml="sm"
                loading={loading}
                style={{ flexShrink: 0, marginLeft: 8 }}
              >
                Send
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Layout>
  )
}

export default App
