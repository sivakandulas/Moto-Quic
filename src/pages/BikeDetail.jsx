import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, ShieldCheck, FileText, Zap } from 'lucide-react';
import { useBikes } from '../context/BikeContext';
import { useAuth } from '../context/AuthContext';

export default function BikeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { bikes } = useBikes();
    const [selectedRate, setSelectedRate] = useState('day'); // 'hour', 'day', 'week'

    const bike = bikes.find(b => b.id === Number(id));

    if (!bike) {
        return (
            <div className="fade-in flex-center" style={{ height: '50vh', flexDirection: 'column' }}>
                <h2>Bike Not Found</h2>
                <button onClick={() => navigate('/')} className="btn btn-outline" style={{ marginTop: '20px' }}>Go Back</button>
            </div>
        );
    }

    // Format defaults if missing (for added bikes)
    // Fix: Ensure we have numbers. Defaults: 1/8th of day for hour, 5x day for week.
    const dayPrice = Number(bike.price_day) || 2000;
    const rates = bike.rates || {
        hour: Math.round(dayPrice / 8),
        day: dayPrice,
        week: dayPrice * 5
    };
    const deposit = bike.deposit || 5000;
    const description = bike.description || 'Verified Condition.';

    const { user } = useAuth();

    const handleBookClick = () => {
        if (!user) {
            if (confirm("You must be logged in to book a ride. Go to Login page?")) {
                navigate('/login');
            }
        } else {
            navigate(`/reserve/${id}`);
        }
    };

    return (
        <div className="bike-detail-page fade-in" style={{ paddingBottom: '100px' }}>
            {/* Custom Header Wrapper */}
            <div className="detail-header flex-between">
                <button onClick={() => navigate(-1)} className="icon-btn">
                    <ChevronLeft size={28} color="white" />
                </button>
                <span style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '1px' }}>BIKE DETAILS</span>
                <button className="icon-btn">
                    <Share2 size={24} color="white" />
                </button>
            </div>

            {/* Hero Image */}
            <div className="hero-image-container">
                <img src={bike.image_url} alt={bike.name} className="hero-image" />
                <div className="hero-gradient"></div>
                <div className="carousel-dots">
                    <span className="dot active"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
            </div>

            <div className="content-container">
                {/* Title Block */}
                <div style={{ marginBottom: '24px' }}>
                    <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                        <span className="badge badge-red">{bike.type.toUpperCase()}</span>
                        <span className="badge badge-green">{bike.status.toUpperCase()}</span>
                    </div>
                    <h1 style={{ fontSize: '32px', fontStyle: 'italic', fontWeight: '800', lineHeight: 1, marginBottom: '8px' }}>{bike.name.toUpperCase()}</h1>
                    <p style={{ color: '#999', fontSize: '13px' }}>{bike.type} | {bike.engine_cc} | {bike.gearbox}</p>
                </div>

                {/* Condition Report */}
                <div className="section-card">
                    <div className="flex-between" style={{ marginBottom: '16px' }}>
                        <div className="flex-center" style={{ gap: '8px' }}>
                            <ShieldCheck color="var(--color-primary)" />
                            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>CONDITION REPORT</h3>
                        </div>
                        <span className="badge-outline">GRADE: {bike.grade.toUpperCase()}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#ccc', lineHeight: '1.6' }}>{description}</p>
                    <button className="btn-text" style={{ marginTop: '16px' }}>VIEW MAINTENANCE LOGS</button>
                </div>

                {/* Rental Rates */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 className="section-title">RENTAL RATES</h3>
                    <div className="rates-grid">
                        <div
                            className={`rate-card ${selectedRate === 'hour' ? 'selected' : ''}`}
                            onClick={() => setSelectedRate('hour')}
                        >
                            <span className="rate-label">1 HOUR</span>
                            <span className="rate-price">₹{rates.hour}</span>
                        </div>
                        <div
                            className={`rate-card ${selectedRate === 'day' ? 'selected' : ''}`}
                            onClick={() => setSelectedRate('day')}
                        >
                            <span className="rate-label">1 DAY</span>
                            <span className="rate-price">₹{rates.day.toLocaleString()}</span>
                            {selectedRate === 'day' && <span className="rate-tag">SELECTED</span>}
                        </div>
                        <div
                            className={`rate-card ${selectedRate === 'week' ? 'selected' : ''}`}
                            onClick={() => setSelectedRate('week')}
                        >
                            <span className="rate-label">1 WEEK</span>
                            <span className="rate-price">₹{rates.week.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Security Deposit */}
                <div className="deposit-card">
                    <div className="bg-shield"></div>
                    <p className="deposit-label">REFUNDABLE SECURITY DEPOSIT</p>
                    <h2 className="deposit-amount">₹{deposit.toLocaleString()}<span>.00</span></h2>
                    <p className="deposit-note">Required at pickup. Returned instantly upon safe inspection of the bike.</p>
                </div>

                {/* Documents */}
                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '16px', marginTop: '24px', background: '#1E1E1E', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ background: '#333', padding: '10px', borderRadius: '8px' }}>
                        <FileText color="var(--color-primary)" />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '700' }}>DOCUMENTS REQUIRED</h4>
                        <p style={{ fontSize: '11px', color: '#999', lineHeight: '1.4' }}>Original Aadhar Card and Valid Driving License must be presented at the shop for verification.</p>
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="sticky-footer">
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                    <div>
                        <p style={{ fontSize: '10px', color: '#999' }}>SELECTED RATE ({selectedRate.toUpperCase()})</p>
                        <h3 style={{ fontSize: '20px' }}>
                            ₹{selectedRate === 'hour' ? rates.hour : selectedRate === 'day' ? rates.day.toLocaleString() : rates.week.toLocaleString()}
                        </h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '10px', color: '#999' }}>BOOKING STATUS</p>
                        <p style={{ fontSize: '12px', color: 'var(--color-warning)' }}>{bike.status}</p>
                    </div>
                </div>
                <button onClick={handleBookClick} className="btn btn-primary" style={{ width: '100%', fontSize: '16px', height: '56px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                    BOOK NOW <Zap size={20} style={{ marginLeft: '8px' }} fill="white" />
                </button>
            </div>

            <style>{`
        /* Styles reused from before - minimal changes */
        .detail-header { padding: 16px 0; margin-bottom: 20px; }
        .icon-btn { background: rgba(255,255,255,0.1); border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; alignItems: center; justifyContent: center; cursor: pointer; }
        .hero-image-container { margin: 0 -16px 24px -16px; height: 300px; position: relative; }
        .hero-image { width: 100%; height: 100%; object-fit: contain; background: radial-gradient(circle at center, #352a2a 0%, #0f0f0f 70%); }
        .carousel-dots { position: absolute; bottom: 20px; left: 0; right: 0; display: flex; justify-content: center; gap: 8px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #555; }
        .dot.active { background: var(--color-primary); }
        .badge { padding: 4px 8px; fontSize: 10px; fontWeight: 700; borderRadius: 4px; }
        .badge-red { background: var(--color-primary); color: white; }
        .badge-green { background: var(--color-success); color: white; }
        .section-card { background: radial-gradient(130% 100% at 0% 0%, #2A1A1A 0%, #1A1A1A 100%); border: 1px solid #3A2A2A; borderRadius: 16px; padding: 20px; margin-bottom: 24px; }
        .badge-outline { border: 1px solid #522; color: var(--color-primary); background: rgba(255, 46, 77, 0.1); padding: 4px 12px; borderRadius: 20px; fontSize: 11px; fontWeight: 700; }
        .btn-text { background: rgba(255,255,255,0.05); border: 1px solid #333; color: white; padding: 10px; width: 100%; borderRadius: 8px; fontSize: 11px; fontWeight: 700; letter-spacing: 1px; cursor: pointer; }
        .section-title { fontSize: 12px; fontWeight: 700; letter-spacing: 1px; margin-bottom: 12px; display: flex; alignItems: center; gap: 8px; }
        .section-title::before { content: ''; display: inline-block; width: 16px; height: 12px; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M2 6h20v2H2zM2 11h20v2H2zM2 16h20v2H2z'/%3E%3C/svg%3E"); }
        
        .rates-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .rate-card { 
            background: #151515; 
            border: 1px solid #333; 
            borderRadius: 12px; 
            padding: 16px 8px; 
            text-align: center; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            cursor: pointer;
            transition: all 0.2s;
        }
        .rate-card.selected { 
            background: rgba(255, 46, 77, 0.1); 
            border-color: var(--color-primary); 
            transform: translateY(-2px);
        }
        .rate-label { fontSize: 9px; color: #999; margin-bottom: 4px; fontWeight: 700; }
        .rate-price { fontSize: 18px; fontWeight: 700; color: white; font-style: italic; margin-right: 4px; }
        .rate-card.selected .rate-price { color: var(--color-primary); }
        .rate-tag { marginTop: 4px; fontSize: 8px; color: var(--color-primary); fontWeight: 700; }
        
        .deposit-card { background: black; border: 1px solid var(--color-primary); borderRadius: 16px; padding: 24px; textAlign: center; position: relative; overflow: hidden; boxShadow: 0 0 30px rgba(255, 46, 77, 0.1) inset; }
        .deposit-label { color: #999; fontSize: 10px; fontWeight: 700; letter-spacing: 2px; margin-bottom: 8px; }
        .deposit-amount { fontSize: 48px; fontWeight: 800; color: white; lineHeight: 1; font-style: italic; }
        .deposit-amount span { color: var(--color-primary); fontSize: 32px; }
        .deposit-note { marginTop: 12px; color: #777; fontSize: 11px; width: 80%; marginLeft: auto; marginRight: auto; }
        .sticky-footer { position: fixed; bottom: 0; left: 0; right: 0; background: #151515; padding: 20px; border-top: 1px solid #333; z-index: 1001; boxShadow: 0 -10px 40px rgba(0,0,0,0.5); }
      `}</style>
        </div>
    );
}
