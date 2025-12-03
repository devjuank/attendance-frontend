import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';

export const ScanHandlerPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'processing' | 'error'>('processing');
    const [errorMessage, setErrorMessage] = useState('');

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            return;
        }

        const markAttendance = async () => {
            try {
                await apiClient.post('/attendance/mark', { qrToken: token });
                navigate('/attendance/confirm');
            } catch (error: unknown) {
                setStatus('error');
                if (error && typeof error === 'object' && 'response' in error) {
                    const err = error as { response: { data: { message: string } } };
                    setErrorMessage(err.response?.data?.message || 'Failed to mark attendance');
                } else {
                    setErrorMessage('Failed to mark attendance');
                }
            }
        };

        markAttendance();
    }, [token, navigate]);

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                <p className="text-gray-600 text-center">No QR token found in URL</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-6 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                    Go Home
                </button>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                <p className="text-gray-600 text-center">{errorMessage}</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-6 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Processing attendance...</p>
        </div>
    );
};
