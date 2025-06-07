import { Route } from 'react-router-dom';
import LandingPage from '../features/chat/presentation/pages/LandingPage';
import Layout from '../features/chat/presentation/layouts';

export default (
    <Route path="chat">
        <Route
            index
            element={
                <Layout>
                    <LandingPage />
                </Layout>
            }
        />
    </Route>
);
