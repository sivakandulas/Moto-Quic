import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supaClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAdminStatus = async (email) => {
        if (!email) {
            setIsAdmin(false);
            return;
        }
        const { data } = await supabase.from('admins').select('email').eq('email', email).single();
        setIsAdmin(!!data);
    };

    useEffect(() => {
        // 1. Check active session on load
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            checkAdminStatus(session?.user?.email);
            setLoading(false);
        });

        // 2. Listen for changes (Login, Logout, Auto-refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            checkAdminStatus(session?.user?.email);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error signing in with Google:", error.message);
            alert(`Login Failed: ${error.message}`);
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error("Error signing out:", error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, signInWithGoogle, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
