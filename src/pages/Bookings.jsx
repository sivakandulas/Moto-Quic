import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBikes } from '../context/BikeContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle, Clock3 } from 'lucide-react';

export default function Bookings() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { bookings, bikes, loading: dataLoading } = useBikes();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('current'); // 'current' or 'history'
    const [currentBookings, setCurrentBookings] = useState([]);
    const [historyBookings, setHistoryBookings] = useState([]);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }

        if (user && bookings.length > 0) {
            // ADMIN POWER: Admins see ALL bookings (useful for testing/overview)
            // Regular Users: See only their own
            const myAll = isAdmin ? bookings : bookings.filter(b => b.user_id === user.id);

            setCurrentBookings(myAll.filter(b => ['Pending', 'Active'].includes(b.status)));
            setHistoryBookings(myAll.filter(b => ['Completed', 'Cancelled'].includes(b.status)));
        }
    }, [user, bookings, authLoading, navigate]);

    if (authLoading || dataLoading) return <div className="flex-center" style={{ height: '50vh' }}>Loading...</div>;

    const renderBookingList = (list) => {
        if (list.length === 0) return (
            <div style={{ textAlign: 'center', marginTop: '60px', color: '#666' }}>
                <p>No trips in this section.</p>
                {activeTab === 'current' && (
                    <button onClick={() => navigate('/')} className="btn-text" style={{ marginTop: '10px', color: 'var(--color-primary)' }}>
                        Book a Ride
                    </button>
                )}
            </div>
        );

        return list.map(booking => {
            const bike = bikes.find(b => b.id === booking.bike_id);
            if (!bike) return null;

            return (
                <div key={booking.id} className="booking-card fade-in">
                    <div className="flex-between" style={{ marginBottom: '12px' }}>
                        <div className="flex-center" style={{ gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden' }}>
                                <img src={bike.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{bike.name}</h3>
                                <span className={`status-pill ${booking.status.toLowerCase()}`}>{booking.status}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-primary)' }}>₹{booking.total_price}</p>
                        </div>
                    </div>

                    <div className="trip-details">
                        <div className="detail-row">
                            <Calendar size={14} color="#888" />
                            <span>{booking.start_date} → {booking.end_date}</span>
                        </div>
                        <div className="detail-row">
                            <MapPin size={14} color="#888" />
                            <span>Balagi Bike Rentals, Hampi</span>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="fade-in" style={{ paddingBottom: '100px' }}>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '24px' }}>My Trips</h2>

                {/* Tabs */}
                <div className="flex-center" style={{ gap: '4px', background: '#252525', padding: '4px', borderRadius: '8px' }}>
                    <button
                        className={`tab-btn ${activeTab === 'current' ? 'active' : ''}`}
                        onClick={() => setActiveTab('current')}
                    >
                        Upcoming
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        History
                    </button>
                </div>
            </div>

            <div className="bookings-list">
                {activeTab === 'current' ? renderBookingList(currentBookings) : renderBookingList(historyBookings)}
            </div>

            <style>{`
                .tab-btn {
                    background: transparent;
                    border: none;
                    color: #999;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    cursor: pointer;
                }
                .tab-btn.active {
                    background: #444;
                    color: white;
                    font-weight: 600;
                }

                .booking-card {
                    background: #1A1A1A;
                    border: 1px solid #333;
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 20px;
                }
                .status-pill {
                    font-size: 10px;
                    padding: 4px 8px;
                    border-radius: 4px;
                    text-transform: uppercase;
                    font-weight: 700;
                    margin-top: 4px;
                    display: inline-block;
                }
                .status-pill.pending { background: #FFBB33; color: black; }
                .status-pill.active { background: var(--color-success); color: white; }
                .status-pill.completed { background: #333; color: #999; }
                .status-pill.cancelled { background: #331111; color: #E63946; }

                .trip-details {
                    background: #111;
                    padding: 12px;
                    border-radius: 8px;
                    margin-top: 12px;
                }
                .detail-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 13px;
                    color: #ccc;
                    margin-bottom: 6px;
                }
                .detail-row:last-child { margin-bottom: 0; }
            `}</style>
        </div>
    );
}
