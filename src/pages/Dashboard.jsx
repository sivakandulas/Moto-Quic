import React, { useState, useEffect } from 'react';
import { useBikes } from '../context/BikeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supaClient';
import { useNavigate } from 'react-router-dom';
import { Phone, Check, CheckCircle, Trash2, Plus, Users, ShieldAlert, BarChart3, Calendar } from 'lucide-react';
import AddBikeForm from '../components/AddBikeForm';
import EditBikeForm from '../components/EditBikeForm';

export default function Dashboard() {
    const { bikes, bookings, deleteBike, addBike, updateBike, updateBookingStatus, loading: dataLoading } = useBikes();
    const { user, isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('requests');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingBike, setEditingBike] = useState(null);

    // Admin Management State
    const [admins, setAdmins] = useState([]);
    const [newAdminEmail, setNewAdminEmail] = useState('');

    useEffect(() => {
        // Protect Route
        if (!authLoading && !isAdmin) {
            navigate('/');
        }
    }, [authLoading, isAdmin, navigate]);

    useEffect(() => {
        if (activeTab === 'team') {
            fetchAdmins();
        }
    }, [activeTab]);

    const fetchAdmins = async () => {
        const { data } = await supabase.from('admins').select('*').order('created_at', { ascending: true });
        setAdmins(data || []);
    };

    const addAdmin = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('admins').insert([{ email: newAdminEmail }]);
        if (error) {
            alert(error.message);
        } else {
            setNewAdminEmail('');
            fetchAdmins();
        }
    };

    const removeAdmin = async (id) => {
        if (confirm('Remove this admin? They will lose access immediately.')) {
            const { error } = await supabase.from('admins').delete().eq('id', id);
            if (error) alert(error.message);
            else fetchAdmins();
        }
    };

    if (authLoading || dataLoading) {
        return <div className="flex-center" style={{ height: '50vh', color: '#666' }}>Loading Dashboard...</div>;
    }

    if (!isAdmin) return null; // Should redirect, but prevent flash

    // Helper for Reports
    const confirmedBookings = bookings.filter(b => b.status !== 'Cancelled');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    const pendingCount = bookings.filter(b => b.status === 'Pending').length;
    const activeCount = bookings.filter(b => b.status === 'Active').length;

    return (
        <div className="fade-in" style={{ paddingBottom: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px' }}>Owner Dashboard</h2>
                <div className="flex-center" style={{ gap: '4px', background: '#252525', padding: '4px', borderRadius: '8px' }}>
                    <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
                        Requests
                    </button>
                    <button className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
                        Reports
                    </button>
                    <button className={`tab-btn ${activeTab === 'fleet' ? 'active' : ''}`} onClick={() => setActiveTab('fleet')}>
                        Fleet
                    </button>
                    <button className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
                        Team
                    </button>
                </div>
            </div>

            {/* REQUESTS LIST */}
            {activeTab === 'requests' && (
                <div className="requests-list">
                    {bookings.length === 0 ? <p style={{ color: '#666' }}>No active requests.</p> : null}
                    {bookings.map(booking => {
                        const bike = bikes.find(b => b.id === booking.bike_id);
                        return (
                            <div key={booking.id} className="request-card fade-in">
                                <div className="flex-between" style={{ marginBottom: '12px' }}>
                                    <div>
                                        <h4 style={{ fontSize: '16px' }}>{booking.guest_name}</h4>
                                        <p style={{ color: '#999', fontSize: '12px' }}>{bike ? bike.name : 'Unknown Bike'}</p>
                                        <div className="flex-center" style={{ gap: '6px', marginTop: '6px', fontSize: '11px', color: '#888' }}>
                                            <Calendar size={12} />
                                            <span>{booking.start_date} - {booking.end_date}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className={`status-pill ${booking.status.toLowerCase()}`}>{booking.status}</span>
                                        {booking.total_price && <div style={{ fontSize: '12px', marginTop: '4px', color: 'var(--color-primary)' }}>₹{booking.total_price}</div>}
                                    </div>
                                </div>

                                <div className="flex-between" style={{ gap: '10px' }}>
                                    <a href={`tel:${booking.guest_phone}`} className="action-btn call">
                                        <Phone size={16} /> Call
                                    </a>
                                    {booking.status === 'Pending' && (
                                        <button className="action-btn verify" onClick={() => updateBookingStatus(booking.id, 'Active')}>
                                            <Check size={16} /> Verify & Start
                                        </button>
                                    )}
                                    {booking.status === 'Active' && (
                                        <button className="action-btn complete" onClick={() => updateBookingStatus(booking.id, 'Completed')}>
                                            <CheckCircle size={16} /> Complete Return
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* REPORTS TAB */}
            {activeTab === 'reports' && (
                <div className="fade-in">
                    <div className="metrics-grid">
                        <div className="metric-card">
                            <h6>Total Revenue</h6>
                            <h3>₹{totalRevenue.toLocaleString()}</h3>
                        </div>
                        <div className="metric-card">
                            <h6>Pending</h6>
                            <h3 style={{ color: '#FFBB33' }}>{pendingCount}</h3>
                        </div>
                        <div className="metric-card">
                            <h6>Active Rides</h6>
                            <h3 style={{ color: 'var(--color-success)' }}>{activeCount}</h3>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '16px', margin: '24px 0 12px 0', borderBottom: '1px solid #333', paddingBottom: '8px' }}>Upcoming Schedule</h3>
                    <div className="fleet-list">
                        <div className="flex-between" style={{ padding: '8px 12px', color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <span style={{ flex: 1 }}>Date / Created</span>
                            <span style={{ flex: 1 }}>User / Contact</span>
                            <span style={{ flex: 1 }}>Bike</span>
                            <span style={{ width: '60px', textAlign: 'right' }}>Status</span>
                        </div>
                        {confirmedBookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(b => {
                            const bike = bikes.find(bik => bik.id === b.bike_id);
                            return (
                                <div key={b.id} className="fleet-item" style={{ display: 'block' }}>
                                    <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{b.start_date}</div>
                                            <div style={{ fontSize: '10px', color: '#666' }}>Booked: {new Date(b.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '13px', color: 'white' }}>{b.guest_name}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--color-primary)' }}>{b.guest_phone}</div>
                                        </div>
                                        <div style={{ flex: 1, fontSize: '13px', color: '#ccc' }}>
                                            {bike?.name}
                                        </div>
                                        <div style={{ width: '60px', textAlign: 'right' }}>
                                            <span className={`status-pill ${b.status.toLowerCase()}`}>{b.status}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* FLEET TAB */}
            {activeTab === 'fleet' && (
                <div>
                    <button className="btn btn-primary" style={{ width: '100%', marginBottom: '20px' }} onClick={() => setShowAddForm(true)}>
                        <Plus size={20} style={{ marginRight: '8px' }} /> Add New Bike
                    </button>

                    <div className="fleet-list">
                        {bikes.map(bike => (
                            <div key={bike.id} className="fleet-item flex-between">
                                <div className="flex-center" style={{ gap: '12px' }}>
                                    <img src={bike.image_url} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                                    <div>
                                        <h4 style={{ fontSize: '14px' }}>{bike.name}</h4>
                                        <p style={{ fontSize: '10px', color: bike.status === 'available' ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                                            {bike.status.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-center" style={{ gap: '8px' }}>
                                    <button className="icon-btn-delete" onClick={() => setEditingBike(bike)} style={{ color: '#ccc' }}>
                                        <Plus size={18} style={{ transform: 'rotate(45deg)' }} /> {/* Using Plus as Edit icon since Lucide Edit might not be imported, or I'll just use text logic. Wait, let's use a proper edit icon or just text if icon missing. Re-using Plus rotated is a cheap hack. Let's use text or just the same Trash icon style. Actually, let's just use text for now or verify imports. I'll import Pen or Pencil */}
                                        ✎
                                    </button>
                                    <button className="icon-btn-delete" onClick={() => {
                                        if (confirm('Delete this bike?')) deleteBike(bike.id);
                                    }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TEAM TAB */}
            {activeTab === 'team' && (
                <div className="fade-in">
                    <div className="request-card" style={{ border: '1px solid #333', background: '#111' }}>
                        <div className="flex-center" style={{ gap: '10px', marginBottom: '16px', color: '#ffbb33' }}>
                            <ShieldAlert size={20} />
                            <h4 style={{ fontSize: '14px' }}>Admin Access Control</h4>
                        </div>
                        <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>
                            People listed here have <b>full access</b> to manage the fleet, view bookings, and edit this team list.
                        </p>

                        <form onSubmit={addAdmin} className="flex-between" style={{ gap: '10px', marginBottom: '20px' }}>
                            <input
                                type="email"
                                placeholder="Enter Google Email"
                                value={newAdminEmail}
                                onChange={e => setNewAdminEmail(e.target.value)}
                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: 'white' }}
                                required
                            />
                            <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '10px 16px' }}>
                                <Plus size={18} />
                            </button>
                        </form>

                        <div className="fleet-list">
                            {admins.map(admin => (
                                <div key={admin.id} className="fleet-item flex-between">
                                    <div className="flex-center" style={{ gap: '10px' }}>
                                        <Users size={16} color="#666" />
                                        <span style={{ fontSize: '14px' }}>{admin.email}</span>
                                    </div>
                                    <button className="icon-btn-delete" onClick={() => removeAdmin(admin.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {showAddForm && <AddBikeForm onClose={() => setShowAddForm(false)} onAdd={addBike} />}
            {editingBike && (
                <EditBikeForm
                    bike={editingBike}
                    onClose={() => setEditingBike(null)}
                    onUpdate={updateBike}
                />
            )}

            <style>{`
        .tab-btn {
            background: transparent;
            border: none;
            color: #999;
            padding: 8px 8px;
            border-radius: 6px;
            font-size: 11px;
            cursor: pointer;
            white-space: nowrap;
        }
        .tab-btn.active {
            background: #444;
            color: white;
            font-weight: 600;
        }
        
        .request-card {
            background: #1A1A1A;
            padding: 16px;
            border-radius: 12px;
            border: 1px solid #333;
            margin-bottom: 12px;
        }
        .status-pill {
            font-size: 10px;
            padding: 4px 8px;
            border-radius: 4px;
            text-transform: uppercase;
            font-weight: 700;
        }
        .status-pill.pending { background: #FFBB33; color: black; }
        .status-pill.active { background: var(--color-success); color: white; }
        .status-pill.completed { background: #333; color: #999; }

        .action-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 10px;
            border-radius: 8px;
            border: none;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
            text-decoration: none;
        }
        .action-btn.call { background: #333; color: white; }
        .action-btn.verify { background: var(--color-primary); color: white; }
        .action-btn.complete { background: var(--color-success); color: white; }

        .fleet-item {
            background: #151515;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 10px;
            border: 1px solid #252525;
        }
        .icon-btn-delete {
            background: transparent;
            border: none;
            color: #666;
            cursor: pointer;
        }
        .icon-btn-delete:hover { color: var(--color-danger); }

        .metrics-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
            margin-bottom: 24px;
        }
        .metric-card {
            background: #1A1A1A;
            padding: 16px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid #333;
        }
        .metric-card h6 { color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .metric-card h3 { font-size: 18px; font-weight: 700; color: white; }
      `}</style>
        </div>
    );
}
