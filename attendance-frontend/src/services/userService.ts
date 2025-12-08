import { apiClient } from './apiClient';
import type { User } from '../types';

export const userService = {
    getAll: async () => {
        const response = await apiClient.get<{ data: User[] }>('/users?limit=1000'); // Fetching all for report calculation
        return response.data.data;
    },
};
