import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './routes/index.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppRouter></AppRouter>
    </StrictMode>,
);
