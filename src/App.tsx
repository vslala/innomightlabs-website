import { Container } from '@mantine/core'
import './App.css'
import Layout from './common/layouts/layout.tsx'

function App() {

  return (
    <Layout>
      <Container fluid>
         Fluid container has 100% max-width
      </Container>
    </Layout>
  )
}

export default App;
