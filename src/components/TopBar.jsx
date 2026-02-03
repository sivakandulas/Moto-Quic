import React from 'react';
import { MapPin, Bell, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopBar() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="app-header flex-between container" style={{ maxWidth: '100%', padding: '0 20px' }}>
            <div className="flex-center" style={{ gap: '10px' }}>
                {/* Logo Icon */}
                <Link to="/" style={{ background: 'var(--color-primary)', padding: '6px', borderRadius: '8px', display: 'flex', textDecoration: 'none' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                    </svg>
                </Link>
                <div>
                    <h1 style={{ fontSize: '18px', fontWeight: '700', lineHeight: 1 }}>Moto-Quick<span style={{ color: 'var(--color-primary)', fontSize: '10px', verticalAlign: 'top', marginLeft: '4px' }}>IN</span></h1>
                </div>
            </div>

            <div className="flex-center" style={{ gap: '16px' }}>
                {/* Auth Section */}
                {user ? (
                    <div className="flex-center" style={{ gap: '8px', background: '#222', padding: '4px 12px 4px 4px', borderRadius: '30px', border: '1px solid #333' }}>
                        <img
                            src={user.user_metadata.avatar_url}
                            alt="Profile"
                            style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                        />
                        <span style={{ fontSize: '10px', fontWeight: '600' }}>{user.user_metadata.full_name?.split(' ')[0]}</span>
                        <button onClick={signOut} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', marginLeft: '4px' }}>
                            <LogOut size={12} color="#666" />
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="btn-text" style={{ padding: '6px 12px', fontSize: '12px', width: 'auto', background: 'rgba(255,255,255,0.1)', color: 'var(--color-primary)' }}>
                        Login
                    </Link>
                )}

                <div style={{ position: 'relative' }}>
                    <Bell size={24} color="white" />
                    <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', background: 'var(--color-primary)', borderRadius: '50%' }}></span>
                </div>
            </div>
        </header>
    );
}
