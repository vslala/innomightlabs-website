import { BrowserRouter, Routes } from 'react-router-dom';
import chatRoutes from './chatRoutes';

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {chatRoutes}
                {/* fallback route, 404, etc */}
            </Routes>
        </BrowserRouter>
    );
}
