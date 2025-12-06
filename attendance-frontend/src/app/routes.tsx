import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/login/LoginPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { CreateEventPage } from '../pages/admin/CreateEventPage';
import { EventDetailsPage } from '../pages/admin/EventDetailsPage';
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
                element: <Navigate to="/admin/dashboard" replace />,
            },
            {
                path: '/admin/dashboard',
                element: <DashboardPage />,
            },
            {
                path: '/admin/events/new',
                element: <CreateEventPage />,
            },
            {
                path: '/admin/events/:id',
                element: <EventDetailsPage />,
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
