import React from 'react';
import { Link } from 'react-router-dom';

export default function Garage() {
    return (
        <div className="fade-in">
            <h2>My Garage</h2>
            <div style={{ marginTop: '40px', padding: '20px', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)' }}>
                <h3>Owner Access</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '10px' }}>Manage your shop and fleet.</p>
                <Link to="/owner" className="btn btn-primary">Go to Dashboard</Link>
            </div>
        </div>
    );
}
