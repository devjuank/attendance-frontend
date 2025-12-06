import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { eventService } from '../../services/eventService';
import { qrService } from '../../services/qrService';
import type { Event, Attendance } from '../../types';

export const EventDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const eventId = Number(id);

    const [event, setEvent] = useState<Event | null>(null);
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [qrToken, setQrToken] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isQrActive, setIsQrActive] = useState(false);

    // Manual Entry State
    const [manualUserId, setManualUserId] = useState('');
    const [manualNotes, setManualNotes] = useState('');
    const [manualLoading, setManualLoading] = useState(false);

    const loadEventData = useCallback(async () => {
        if (!eventId) return;
        try {
            const eventData = await eventService.getById(eventId);
            setEvent(eventData);

            const attendanceData = await eventService.getAttendance(eventId);
            setAttendance(attendanceData);
        } catch (error) {
            console.error('Failed to load event data', error);
        }
    }, [eventId]);

    const fetchQr = useCallback(async () => {
        if (!eventId) return;
        try {
            const data = await qrService.getActive(eventId);
            setQrToken(data.qr_token);
            setExpiresAt(data.expires_at);
            setIsQrActive(true);
        } catch (error) {
            // It's possible there is no active QR, which is fine
            console.log('No active QR found or failed to fetch', error);
            setIsQrActive(false);
            setQrToken(null);
        }
    }, [eventId]);

    useEffect(() => {
        loadEventData();
        fetchQr();
    }, [loadEventData, fetchQr]);

    // QR Timer Logic
    useEffect(() => {
        if (!expiresAt || !isQrActive) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const expiration = new Date(expiresAt).getTime();
            const diff = Math.max(0, Math.floor((expiration - now) / 1000));
            setTimeLeft(diff);

            if (diff === 0) {
                // Refresh QR if it was active and expired
                handleGenerateQr();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, isQrActive]);

    const handleGenerateQr = async () => {
        try {
            const data = await qrService.generate(eventId);
            setQrToken(data.qr_token);
            setExpiresAt(data.expires_at);
            setIsQrActive(true);
        } catch (error) {
            console.error('Failed to generate QR', error);
        }
    };

    const handleDeactivateQr = async () => {
        try {
            await qrService.deactivate(eventId);
            setIsQrActive(false);
            setQrToken(null);
            setExpiresAt(null);
        } catch (error) {
            console.error('Failed to deactivate QR', error);
        }
    };

    const handleManualEntry = async (e: React.FormEvent) => {
        e.preventDefault();
        setManualLoading(true);
        try {
            await eventService.markManualAttendance(eventId, Number(manualUserId), manualNotes);
            setManualUserId('');
            setManualNotes('');
            // Refresh attendance list
            const attendanceData = await eventService.getAttendance(eventId);
            setAttendance(attendanceData);
            alert('User added successfully');
        } catch (error) {
            console.error('Failed to add manual attendance', error);
            alert('Failed to add user. Check ID.');
        } finally {
            setManualLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (!event) return <div className="p-10 text-center">Loading event...</div>;

    return (
        <div className="min-h-screen bg-gray-100 pb-10">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                    <div>
                        <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">&larr; Back to Dashboard</Link>
                        <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                        <p className="text-gray-500">{event.description}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                        <p>{new Date(event.start_time).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: QR Control */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Live QR Code</h2>

                            {isQrActive && qrToken ? (
                                <div className="flex flex-col items-center">
                                    <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                                        <QRCodeSVG
                                            value={`${window.location.origin}/attendance?token=${qrToken}`}
                                            size={256}
                                        />
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="text-gray-500">Refreshes in</p>
                                        <p className="text-3xl font-mono font-bold text-blue-600">{formatTime(timeLeft)}</p>
                                    </div>
                                    <div className="mt-6 flex space-x-4">
                                        <button
                                            onClick={handleDeactivateQr}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Stop / Hide QR
                                        </button>
                                        <button
                                            onClick={handleGenerateQr}
                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                        >
                                            Force Refresh
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <p className="text-gray-500 mb-4">QR Code is currently inactive.</p>
                                    <button
                                        onClick={handleGenerateQr}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                    >
                                        Start / Show QR
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Manual Entry */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Manual Entry</h2>
                            <form onSubmit={handleManualEntry} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                                    <input
                                        type="number"
                                        required
                                        value={manualUserId}
                                        onChange={(e) => setManualUserId(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        placeholder="e.g. 101"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                                    <input
                                        type="text"
                                        value={manualNotes}
                                        onChange={(e) => setManualNotes(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        placeholder="Reason (e.g. No phone)"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={manualLoading}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {manualLoading ? 'Adding...' : 'Add User Manually'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Attendance List */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Attendance List</h2>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                Total: {attendance.length}
                            </span>
                        </div>
                        <div className="overflow-y-auto max-h-[600px]">
                            {attendance.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    No attendance records yet.
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {attendance.map((record) => (
                                            <tr key={record.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {record.user?.first_name} {record.user?.last_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {record.user?.email || `ID: ${record.user_id}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(record.check_in).toLocaleTimeString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {record.status}
                                                    </span>
                                                    {record.notes && (
                                                        <p className="text-xs text-gray-400 mt-1">{record.notes}</p>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};
