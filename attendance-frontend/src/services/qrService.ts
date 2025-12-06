import { apiClient } from './apiClient';
import type { QrCode } from '../types';

export const qrService = {
    getActive: async (eventId: number) => {
        const { data } = await apiClient.get<QrCode>('/qr/active', {
            params: { event_id: eventId }
        });
        return data;
    },

    generate: async (eventId: number) => {
        const { data } = await apiClient.post<QrCode>('/qr/generate', { event_id: eventId });
        return data;
    },

    deactivate: async (eventId: number) => {
        const { data } = await apiClient.post<{ message: string; event_id: number }>('/qr/deactivate', { event_id: eventId });
        return data;
    }
};
