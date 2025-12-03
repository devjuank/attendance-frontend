import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { apiClient } from '../../services/apiClient';

export const LiveQrPage = () => {
    const [qrToken, setQrToken] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    const fetchQr = async () => {
        try {
            const { data } = await apiClient.get('/admin/qr/active');
            setQrToken(data.qrToken);
            setExpiresAt(data.expiresAt);
        } catch (error) {
            console.error('Failed to fetch QR', error);
        }
    };

    const regenerateQr = async () => {
        try {
            const { data } = await apiClient.post('/admin/qr/generate');
            setQrToken(data.qrToken);
            setExpiresAt(data.expiresAt);
        } catch (error) {
            console.error('Failed to regenerate QR', error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchQr();
        const interval = setInterval(fetchQr, 60000); // Poll every minute as backup
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!expiresAt) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const expiration = new Date(expiresAt).getTime();
            const diff = Math.max(0, Math.floor((expiration - now) / 1000));
            setTimeLeft(diff);

            if (diff === 0) {
                fetchQr();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-8">Live Attendance QR</h1>

            <div className="p-8 bg-white rounded-xl shadow-2xl">
                {qrToken ? (
                    <QRCodeSVG value={qrToken} size={300} />
                ) : (
                    <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-200 text-gray-500">
                        Loading QR...
                    </div>
                )}
            </div>

            <div className="mt-8 text-center">
                <p className="text-xl text-gray-400">Refreshes in</p>
                <p className="text-4xl font-mono font-bold text-blue-400">{formatTime(timeLeft)}</p>
            </div>

            <button
                onClick={regenerateQr}
                className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
                Force Refresh
            </button>
        </div>
    );
};
