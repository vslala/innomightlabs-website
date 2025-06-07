// If you need direction to load .env in non-CRA setups:
// import dotenv from 'dotenv';
// dotenv.config();

export interface AppConfig {
    API_HOST: string;
    NODE_ENV: 'local' | 'development' | 'production' | 'test';
}

export const getConfig = () => {
    console.log('⛳️ Loaded env:', {
        API_HOST: import.meta ? import.meta.env.VITE_API_HOST : process.env.REACT_APP_API_HOST,
        NODE_ENV: import.meta ? import.meta.env.MODE : process.env.NODE_ENV,
    });

    return {
        API_HOST: import.meta ? import.meta.env.VITE_API_HOST! : process.env.REACT_APP_API_HOST!,
        NODE_ENV: import.meta ? (import.meta.env.MODE as any) : (process.env.NODE_ENV as any) || 'local',
    };
};
