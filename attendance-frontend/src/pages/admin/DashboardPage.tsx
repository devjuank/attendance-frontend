import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const DashboardPage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Welcome, {user?.name}</span>
                            <button
                                onClick={logout}
                                className="px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Link
                        to="/admin/live-qr"
                        className="p-6 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
                    >
                        <h3 className="text-lg font-medium text-gray-900">Live QR</h3>
                        <p className="mt-2 text-gray-500">Generate and display dynamic QR codes for attendance.</p>
                    </Link>
                    {/* Add more dashboard widgets here */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                        <p className="mt-2 text-gray-500">View recent attendance logs.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};
