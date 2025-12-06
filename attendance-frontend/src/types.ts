export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: 'admin' | 'manager' | 'employee';
    department_id: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
    created_at: string;
}

export interface Attendance {
    id: number;
    user_id: number;
    user?: User;
    event_id: number;
    check_in: string;
    status: 'present' | 'absent' | 'late';
    location: string;
    notes: string;
    qr_token?: string;
}

export interface QrCode {
    qr_token: string;
    event_id: number;
    expires_at: string;
    created_at: string;
    is_active: boolean;
}
