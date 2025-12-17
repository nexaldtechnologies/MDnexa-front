import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import type { User } from '@supabase/supabase-js';

export const useAuthGuard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // Redirect to login if no session
                window.location.href = '/login';
                return;
            }

            setUser(session.user);
        } catch (error) {
            console.error('Auth check error:', error);
            window.location.href = '/login';
        } finally {
            setLoading(false);
        }
    };

    return { user, loading };
};
