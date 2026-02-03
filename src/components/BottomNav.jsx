import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Calendar, Map, Heart } from 'lucide-react';

export default function BottomNav() {
    const navItems = [
        { icon: Compass, label: 'Discover', path: '/' },
        { icon: Calendar, label: 'Bookings', path: '/bookings' },
        { icon: Map, label: 'Stations', path: '/shop-info' },
        { icon: Heart, label: 'Garage', path: '/garage' }, // Could serve as "My Saved" or Owner access for demo
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => (
                <NavLink
                    key={item.label}
                    to={item.path}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <item.icon size={24} />
                    <span>{item.label}</span>
                </NavLink>
            ))}
            <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #1A1A1A;
          border-top: 1px solid #333;
          height: 70px; /* Taller for mobile touch */
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding-bottom: 10px; /* Safe area for iPhone */
          z-index: 1000;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 10px;
          gap: 4px;
          transition: color 0.3s;
        }
        .nav-item.active {
          color: var(--color-primary);
        }
        .nav-item svg {
          stroke-width: 2px;
        }
      `}</style>
        </nav>
    );
}
