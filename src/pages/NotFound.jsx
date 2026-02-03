import React from 'react';
import { Home, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex-center" style={{
            height: '100vh',
            flexDirection: 'column',
            gap: '20px',
            textAlign: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: '#331111',
                padding: '24px',
                borderRadius: '50%',
                border: '1px solid #ff4444'
            }}>
                <AlertTriangle size={48} color="#ff4444" />
            </div>

            <div>
                <h1 style={{ fontSize: '32px', marginBottom: '8px', color: 'white' }}>404</h1>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Page Not Found</h2>
                <p style={{ color: '#888', maxWidth: '300px' }}>
                    The page you are looking for doesn't exist or has been moved.
                </p>
            </div>

            <button
                onClick={() => navigate('/')}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
            >
                <Home size={18} />
                Back to Home
            </button>
        </div>
    );
}
