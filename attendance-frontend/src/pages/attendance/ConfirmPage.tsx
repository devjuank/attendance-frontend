import { useNavigate } from 'react-router-dom';

export const ConfirmPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Recorded!</h1>
            <p className="text-gray-600 text-center mb-8">
                Your attendance has been successfully marked for this session.
            </p>
            <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
                Done
            </button>
        </div>
    );
};
