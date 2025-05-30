import { Button, Container, Flex, Textarea, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import Layout from './common/layouts/layout.tsx'
import SideNav from './common/layouts/sidenav.tsx'

const App: React.FC = () => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      userQuery: ''
    },
    validate: {
      userQuery: (value) => (value.length < 1 ? 'Query cannot be empty' : null)
    }
  })

  return (
    <Layout>
      <Container
        fluid
        size={'100%'}
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'row', // Change to row to place SideNav on the left
          padding: 0,
        }}
      >
        <SideNav>
          <Title order={3} p="md" style={{ borderBottom: '1px solid #eee' }}>
            Conversations
          </Title>
        </SideNav>
        <Flex
          direction="column"
          align="center"
          justify="center"
          style={{ flex: 1, width: '100%' }}
        >
          <form
            onSubmit={form.onSubmit((values) => console.log(values))}
            style={{ width: 400, maxWidth: '100%' }}
          >
            <div style={{ marginBottom: 8, textAlign: 'center' }}>
              Where should we begin?
            </div>
            <Flex direction="row" align="stretch" style={{ width: '100%' }}>
              <Textarea
                placeholder="Ask anything"
                key={form.key('userQuery')}
                {...form.getInputProps('userQuery')}
                style={{ flex: 1 }}
                autosize
                minRows={1}
                maxRows={4}
              />
              <Button
                type="submit"
                style={{ marginLeft: 8 }}
              >
                Send
              </Button>
            </Flex>
          </form>
        </Flex>
      </Container>
    </Layout>
  )
}

export default App;

