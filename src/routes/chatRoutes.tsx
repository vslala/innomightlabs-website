import { Route } from 'react-router-dom';
import LandingPage from '../features/chat/presentation/pages/LandingPage';
import ChatDisplay from '../features/chat/presentation/components/ChatDisplay';
import Layout from '../features/chat/presentation/layouts';

export default (
    <Route
        path="chat"
        element={
            <Layout>
                <LandingPage />
            </Layout>
        }
    >
        <Route path=":conversationId" element={<ChatDisplay />} />
    </Route>
);
