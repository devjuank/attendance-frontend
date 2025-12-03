import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../pages/login/LoginPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { LiveQrPage } from '../pages/admin/LiveQrPage';
import { ScanHandlerPage } from '../pages/attendance/ScanHandlerPage';
import { ConfirmPage } from '../pages/attendance/ConfirmPage';
import { PrivateRoute } from '../components/layout/PrivateRoute';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        element: <PrivateRoute />,
        children: [
            {
                path: '/admin',
                element: <DashboardPage />,
            },
            {
                path: '/admin/live-qr',
                element: <LiveQrPage />,
            },
            {
                path: '/attendance',
                element: <ScanHandlerPage />,
            },
            {
                path: '/attendance/confirm',
                element: <ConfirmPage />,
            },
        ],
    },
    {
        path: '/',
        element: <LoginPage />, // Redirect to login by default for now
    },
]);
