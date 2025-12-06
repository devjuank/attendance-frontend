import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { eventService } from '../../services/eventService';
import type { Event } from '../../types';

export const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await eventService.getAll();
                setEvents(data);
            } catch (error) {
                console.error('Failed to fetch events', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Welcome, {user?.first_name} {user?.last_name}</span>
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
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Events</h2>
                    <Link
                        to="/admin/events/new"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Create Event
                    </Link>
                </div>

                {isLoading ? (
                    <div className="text-center py-10">Loading events...</div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <Link
                                key={event.id}
                                to={`/admin/events/${event.id}`}
                                className="block p-6 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
                            >
                                <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                                <p className="mt-2 text-gray-500 text-sm">{event.description}</p>
                                <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
                                    <span>{new Date(event.start_time).toLocaleDateString()}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${event.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {event.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </Link>
                        ))}
                        {events.length === 0 && (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No events found. Create one to get started.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};
