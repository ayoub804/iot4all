"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';

interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    avatar: string;
}

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    register: (data: object) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
    isSupervisor: boolean;
    isMember: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Rehydrate on page load
    useEffect(() => {
        const storedToken = localStorage.getItem('iot4all_token') || sessionStorage.getItem('iot4all_token');
        const storedUser = localStorage.getItem('iot4all_user');

        if (storedToken) {
            setToken(storedToken);
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse stored user", e);
                }
            }

            api.getMe()
                .then(({ user }) => {
                    setUser(user);
                    localStorage.setItem('iot4all_user', JSON.stringify(user));
                })
                .catch(() => {
                    localStorage.removeItem('iot4all_token');
                    sessionStorage.removeItem('iot4all_token');
                    localStorage.removeItem('iot4all_user');
                    setUser(null);
                    setToken(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string, rememberMe: boolean = false) => {
        const { token: t, user: u } = await api.login({ email, password });
        if (rememberMe) {
            localStorage.setItem('iot4all_token', t);
            localStorage.setItem('iot4all_user', JSON.stringify(u));
        } else {
            sessionStorage.setItem('iot4all_token', t);
            // We still store user in localStorage for instant hydration next time
            // but the token is in sessionStorage so it expires on tab close
            localStorage.setItem('iot4all_user', JSON.stringify(u));
        }
        setToken(t);
        setUser(u);
    };

    const register = async (data: object) => {
        const { token: t, user: u } = await api.register(data);
        localStorage.setItem('iot4all_token', t);
        localStorage.setItem('iot4all_user', JSON.stringify(u));
        setToken(t);
        setUser(u);
    };

    const logout = () => {
        localStorage.removeItem('iot4all_token');
        sessionStorage.removeItem('iot4all_token');
        localStorage.removeItem('iot4all_user');
        setToken(null);
        setUser(null);
    };

    const isAdmin = user?.role === 'Admin' || user?.role === 'Founder Supervisor';
    const isSupervisor = isAdmin || user?.role === 'Supervisor' || user?.role === 'Founder Member';
    const isMember = user?.role === 'Member' || isSupervisor || isAdmin;

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isSupervisor, isMember }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
