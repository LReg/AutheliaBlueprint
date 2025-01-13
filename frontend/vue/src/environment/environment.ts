const env = import.meta.env
export interface Environment {
    baseUrl: string;
    apiUrl: string;
    authUrl: string;
    clientId: string;
}

export const environment: Environment = {
    baseUrl: env.VITE_BASE_URL,
    apiUrl: env.VITE_API_URL,
    authUrl: env.VITE_AUTH_URL,
    clientId: env.VITE_CLIENT_ID,
}