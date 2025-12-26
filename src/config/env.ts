const env = import.meta.env;

export const OS_API_BASE_URL = env.VITE_OS_API_BASE_URL ?? 'http://localhost:5186/api';
export const OS_APP_TITLE = env.VITE_OS_APP_TITLE ?? 'Console de Ordens de Serviço';
