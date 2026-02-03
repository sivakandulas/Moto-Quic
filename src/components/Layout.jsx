import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function Layout() {
    return (
        <div style={{ paddingBottom: '80px', position: 'relative' }}>
            <TopBar />
            <main className="container" style={{ paddingTop: '20px' }}>
                <Outlet />
            </main>

            {/* Global Watermark */}
            <div style={{
                position: 'fixed',
                bottom: '85px', // Just above bottom nav
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '10px',
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 0.15)', // Very subtle
                pointerEvents: 'none',
                zIndex: 9999,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                textAlign: 'center',
                lineHeight: '1.4'
            }}>
                Made in Bharath<br />
                by Siva
            </div>

            <BottomNav />
        </div>
    );
}
