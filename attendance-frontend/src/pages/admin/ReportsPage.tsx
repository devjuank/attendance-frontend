import { useReports } from '../../hooks/useReports';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';



export const ReportsPage = () => {
    const { stats, isLoading } = useReports();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!stats) return <div>Error loading data.</div>;

    // Prepare data for charts

    const eventAttendanceData = stats.attendeesPerEvent.map(item => ({
        name: item.event.title,
        attendees: item.count,
        rate: Math.round(item.rate),
        total: stats.totalUsers
    }));

    const topAttendees = stats.attendanceRanking.slice(0, 5).map(item => ({
        name: `${item.user.first_name} ${item.user.last_name}`,
        count: item.count
    }));

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Attendance Analytics</h1>
                        <p className="text-gray-500 text-sm">Overview of system performance and engagement</p>
                    </div>
                    <Link to="/admin/dashboard" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-xs uppercase font-semibold tracking-wider">Total Events</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalEvents}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-xs uppercase font-semibold tracking-wider">Total Members</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-xs uppercase font-semibold tracking-wider">Avg. Attendance Rate</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">
                            {Math.round(stats.attendeesPerEvent.reduce((acc, curr) => acc + curr.rate, 0) / (stats.totalEvents || 1))}%
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-xs uppercase font-semibold tracking-wider">Active Engagement</h3>
                        <p className="text-sm text-green-600 mt-3 font-medium">
                            {stats.attendancePerMember.filter(m => m.percentage > 50).length} members &gt; 50%
                        </p>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Event Attendance Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Attendance per Event</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={eventAttendanceData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="attendees" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Attendees Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Top 5 Most Configurable Attendees</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topAttendees} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={120} stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                    <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Detailed Table Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Event Attendance Rates</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-800 font-semibold uppercase tracking-wider text-xs">
                                <tr>
                                    <th className="px-6 py-4">Event Name</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-center">Attendees</th>
                                    <th className="px-6 py-4 text-center">Total Members</th>
                                    <th className="px-6 py-4 text-right">Attendance Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.attendeesPerEvent.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.event.title}</td>
                                        <td className="px-6 py-4">{new Date(item.event.start_time).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {item.count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-400">{stats.totalUsers}</td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-800">{Math.round(item.rate)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
