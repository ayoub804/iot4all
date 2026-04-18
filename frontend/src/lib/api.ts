const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request(path: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('iot4all_token') || sessionStorage.getItem('iot4all_token')) : null;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string> || {})
    };

    const res = await fetch(`${BASE}${path}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
}

export const api = {
    // Auth
    register: (body: object) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: object) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    getMe: () => request('/auth/me'),
    updateMe: (body: object) => request('/auth/me', { method: 'PUT', body: JSON.stringify(body) }),
    deleteMe: () => request('/auth/me', { method: 'DELETE' }),

    // Members
    getMembers: () => request('/members'),
    getMember: (id: string) => request(`/members/${id}`),
    updateMember: (id: string, b: object) => request(`/members/${id}`, { method: 'PUT', body: JSON.stringify(b) }),
    deleteMember: (id: string) => request(`/members/${id}`, { method: 'DELETE' }),

    // Projects
    getProjects: () => request('/projects'),
    getProject: (id: string) => request(`/projects/${id}`),
    createProject: (body: object) => request('/projects', { method: 'POST', body: JSON.stringify(body) }),
    updateProject: (id: string, b: object) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(b) }),
    deleteProject: (id: string) => request(`/projects/${id}`, { method: 'DELETE' }),
    toggleTask: (pid: string, tid: string) => request(`/projects/${pid}/tasks/${tid}`, { method: 'PATCH' }),

    // Recruitment
    apply: (body: object) => request('/recruitment', { method: 'POST', body: JSON.stringify(body) }),
    getMyApplication: () => request('/recruitment/my'),
    getApplications: () => request('/recruitment'),
    getRecruitStats: () => request('/recruitment/stats'),
    updateAppStatus: (id: string, status: string) => request(`/recruitment/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

    // Messages
    getMessages: (channel: string) => request(`/messages/${channel}`),

    // Badges
    getBadges: () => request('/badges'),
    initBadges: () => request('/badges/init', { method: 'POST' }),
    getUserBadges: (userId: string) => request(`/badges/user/${userId}`),
    addBadgeToUser: (userId: string, badgeId: string) => request('/badges/user/add', { method: 'POST', body: JSON.stringify({ userId, badgeId }) }),
    removeBadgeFromUser: (userId: string, badgeId: string) => request('/badges/user/remove', { method: 'DELETE', body: JSON.stringify({ userId, badgeId }) }),
};
