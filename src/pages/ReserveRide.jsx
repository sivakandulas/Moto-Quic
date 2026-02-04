import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Zap, Calendar, IndianRupee } from 'lucide-react';
import { useBikes } from '../context/BikeContext';
import { useAuth } from '../context/AuthContext';

export default function ReserveRide() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { bikes, addBooking, loading } = useBikes();
    const { user } = useAuth();

    const bike = bikes.find(b => b.id === Number(id));

    // Form State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    // Date State (Strings: YYYY-MM-DD)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [days, setDays] = useState(0);

    // Initial load: Pre-fill user data & Protect Route
    useEffect(() => {
        if (!loading && !user) {
            alert("You must be logged in to reserve a ride.");
            navigate('/login');
        } else if (user) {
            setName(user.user_metadata.full_name || '');
        }
    }, [user, loading, navigate]);

    // Calculate Price whenever dates change
    useEffect(() => {
        if (startDate && endDate && bike) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive

            if (diffDays > 0) {
                setDays(diffDays);
                setTotalPrice(diffDays * bike.price_day);
            } else {
                setDays(0);
                setTotalPrice(0);
            }
        }
    }, [startDate, endDate, bike]);

    if (!bike) return <div className="fade-in">Bike not found</div>;

    const handleReserve = async () => {
        if (!user) {
            alert('You must be logged in to reserve a ride.');
            navigate('/login');
            return;
        }

        if (!name.trim()) {
            alert('Please enter your full name.');
            return;
        }

        // Validate Phone: Must be 10 digits
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }

        if (!startDate || !endDate) {
            alert('Please select trip dates.');
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            alert('End date cannot be before start date.');
            return;
        }

        // 1. Create Booking Object matching DB schema
        const newBooking = {
            bike_id: bike.id,
            guest_name: name,
            guest_phone: phone,
            start_date: startDate,
            end_date: endDate,
            total_price: totalPrice
        };

        // 2. Add Booking (Context handles availability check)
        const success = await addBooking(newBooking);

        if (success) {
            alert('Reservation Sent! Shop owner will be notified.');
            navigate('/bookings'); // Or dashboard if owner
        }
    };

    // Get Today's Date for Min attribute
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fade-in" style={{ paddingBottom: '120px' }}>
            {/* Header */}
            <div className="flex-center" style={{ position: 'relative', marginBottom: '24px' }}>
                <button onClick={() => navigate(-1)} className="icon-btn-back">
                    <ChevronLeft size={24} color="#E63946" />
                </button>
                <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Reserve Your Ride</h2>
            </div>

            {/* Vehicle Summary */}
            <div className="vehicle-card flex-between">
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{bike.name}</h3>
                    <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E63946' }}></div>
                        <span style={{ fontSize: '12px', color: '#E63946' }}>₹{bike.price_day} / day</span>
                    </div>
                </div>
                <img src={bike.image_url} alt="Bike" style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
            </div>

            {/* User Details */}
            <div style={{ marginTop: '24px' }}>
                <p className="section-title">USER DETAILS</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label className="input-label">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="input-label">Phone Number</label>
                        <input
                            type="tel"
                            placeholder="+91 00 0000 0000"
                            className="input-field"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Date Selection */}
            <div style={{ marginTop: '24px' }}>
                <p className="section-title">TRIP DATES</p>
                <div className="flex-between" style={{ gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                        <label className="input-label">Start Date</label>
                        <div className="date-input-wrapper">
                            <Calendar size={16} color="#666" />
                            <input
                                type="date"
                                className="date-input"
                                min={today}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label className="input-label">End Date</label>
                        <div className="date-input-wrapper">
                            <Calendar size={16} color="#666" />
                            <input
                                type="date"
                                className="date-input"
                                min={startDate || today}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Price Breakdown */}
            {days > 0 && (
                <div className="price-card fade-in">
                    <div className="flex-between" style={{ marginBottom: '8px', fontSize: '12px', color: '#ccc' }}>
                        <span>Rate (₹{bike.price_day} x {days} days)</span>
                        <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex-between" style={{ paddingTop: '8px', borderTop: '1px solid #333', fontWeight: '700', fontSize: '16px' }}>
                        <span>Total Payable</span>
                        <span style={{ color: 'var(--color-primary)' }}>₹{totalPrice}</span>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="fixed-footer">
                <button className="btn btn-primary" style={{ width: '100%', height: '56px', fontSize: '16px' }} onClick={handleReserve}>
                    Reserve Now <Zap size={20} style={{ marginLeft: '8px' }} fill="white" />
                </button>
                <p style={{ textAlign: 'center', fontSize: '9px', color: '#666', marginTop: '12px', fontWeight: '700', letterSpacing: '1px' }}>NO DEPOSIT REQUIRED</p>
            </div>

            <style>{`
        .section-title { fontSize: 10px; color: #999; fontWeight: 700; letter-spacing: 1px; margin-bottom: 12px; }
        .input-label { fontSize: 12px; color: white; fontWeight: 600; margin-bottom: 8px; display: block; }
        .icon-btn-back { background: transparent; border: none; position: absolute; left: 0; cursor: pointer; }
        .vehicle-card { background: #1A1A1A; border-radius: 12px; padding: 20px; border: 1px solid #333; }
        .input-field { width: 100%; background: #1A1A1A; border: 1px solid #333; padding: 16px; border-radius: 12px; color: white; fontSize: 14px; fontFamily: var(--font-main); }
        .input-field:focus { border-color: var(--color-primary); outline: none; }
        
        .date-input-wrapper {
            background: #1A1A1A; border: 1px solid #333; padding: 12px; border-radius: 12px; display: flex; align-items: center; gap: 10px;
        }
        .date-input {
            background: transparent; border: none; color: white; width: 100%; font-family: var(--font-main);
        }
        .date-input::-webkit-calendar-picker-indicator {
            filter: invert(1); opacity: 0.5; cursor: pointer;
        }

        .price-card {
            margin-top: 24px;
            background: #151515;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #333;
        }

        .fixed-footer { position: fixed; bottom: 0; left: 0; right: 0; background: #0F0F0F; padding: 20px; zIndex: 1002; boxShadow: 0 -10px 30px rgba(0,0,0,0.8); }
      `}</style>
        </div>
    );
}
