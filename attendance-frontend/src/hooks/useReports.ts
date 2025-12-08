import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { eventService } from '../services/eventService';
import type { User, Event, Attendance } from '../types';

export interface AttendanceStats {
    totalEvents: number;
    totalUsers: number;
    attendancePerMember: { user: User; percentage: number; count: number }[];
    attendanceRanking: { user: User; count: number }[];
    attendeesPerEvent: { event: Event; count: number; rate: number }[];
}

export const useReports = () => {
    const [stats, setStats] = useState<AttendanceStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // userService.getAll returns User[]
                // eventService.getAll returns Event[]
                const [users, events] = await Promise.all([
                    userService.getAll(),
                    eventService.getAll(),
                ]);

                // Fetch attendance for all events
                const attendancePromises = events.map(event =>
                    eventService.getAttendance(event.id).then(att => ({ eventId: event.id, attendance: att }))
                );

                const allAttendanceResults = await Promise.all(attendancePromises);

                // Map eventId -> Attendance[]
                const attendanceByEvent = new Map<number, Attendance[]>();
                allAttendanceResults.forEach(({ eventId, attendance }) => {
                    attendanceByEvent.set(eventId, attendance);
                });

                // Calculate Stats

                // 1. % Attendance per Member & 2. Ranking
                const userAttendanceCounts = new Map<number, number>();
                users.forEach((u: User) => userAttendanceCounts.set(u.id, 0));

                allAttendanceResults.forEach(({ attendance }) => {
                    attendance.forEach((record: Attendance) => {
                        const current = userAttendanceCounts.get(record.user_id) || 0;
                        userAttendanceCounts.set(record.user_id, current + 1);
                    });
                });

                const attendancePerMember = users.map((user: User) => {
                    const count = userAttendanceCounts.get(user.id) || 0;
                    const percentage = events.length > 0 ? (count / events.length) * 100 : 0;
                    return { user, count, percentage };
                });

                const attendanceRanking = [...attendancePerMember].sort((a, b) => b.count - a.count);

                // 3. Total Attendees per Event & 4. Rate vs Total
                const attendeesPerEvent = events.map((event: Event) => {
                    const attendance = attendanceByEvent.get(event.id) || [];
                    const count = attendance.length;
                    const rate = users.length > 0 ? (count / users.length) * 100 : 0;
                    return { event, count, rate };
                });

                setStats({
                    totalEvents: events.length,
                    totalUsers: users.length,
                    attendancePerMember,
                    attendanceRanking,
                    attendeesPerEvent,
                });

            } catch (error) {
                console.error("Error fetching report data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { stats, isLoading };
};
