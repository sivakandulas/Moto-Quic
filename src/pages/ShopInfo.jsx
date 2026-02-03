import React from 'react';
import { MapPin, Phone, Clock, Navigation, Shield, CheckCircle } from 'lucide-react';

export default function ShopInfo() {
    return (
        <div className="fade-in" style={{ paddingBottom: '100px' }}>

            {/* Map Placeholder Area */}
            <div className="map-container">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15551.879008985652!2d77.63462965!3d12.97381985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a9f99e8293%3A0x6334a1739e8707aa!2sIndiranagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1706900000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(0.8) invert(1)' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Shop Location"
                ></iframe>
                <div className="map-overlay">
                    <button className="btn btn-primary flex-center" style={{ gap: '8px' }}>
                        <Navigation size={18} /> Get Directions
                    </button>
                </div>
            </div>

            {/* Shop Header */}
            <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
                <div className="shop-card">
                    <div className="flex-between">
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: '800', lineHeight: 1.2 }}>Balagi Bike Rentals</h1>
                            <p style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>123, 100ft Road, Indiranagar, Bangalore</p>
                            <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '6px', marginTop: '8px' }}>
                                <span className="open-dot"></span>
                                <span style={{ color: '#00C851', fontSize: '12px', fontWeight: '600' }}>Open until 9:00 PM</span>
                            </div>
                        </div>
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#333', overflow: 'hidden' }}>
                            <img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=200&auto=format&fit=crop" alt="Shop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                        <div>
                            <p className="label-text">OWNER</p>
                            <p className="value-text">Rajesh Kumar</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="label-text">RATING</p>
                            <div className="flex-center" style={{ justifyContent: 'flex-end', gap: '4px' }}>
                                <span style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>4.8</span>
                                <span style={{ fontSize: '12px', color: '#666' }}>(124 reviews)</span>
                            </div>
                        </div>
                    </div>

                    <a href="tel:+919876543210" className="btn btn-primary" style={{ width: '100%', marginTop: '20px', textDecoration: 'none' }}>
                        <Phone size={18} style={{ marginRight: '8px' }} /> Call Shop Owner
                    </a>
                </div>
            </div>

            {/* Preparation List */}
            <div className="container" style={{ marginTop: '24px' }}>
                <h3 className="section-title">PREPARATION LIST</h3>
                <div className="prep-grid">
                    <div className="prep-card">
                        <div className="icon-box"><Shield color="var(--color-primary)" /></div>
                        <p>Valid License</p>
                    </div>
                    <div className="prep-card">
                        <div className="icon-box"><CheckCircle color="var(--color-primary)" /></div>
                        <p>Helmet</p>
                    </div>
                    <div className="prep-card">
                        <div className="icon-box"><Clock color="var(--color-primary)" /></div>
                        <p>Deposit</p>
                    </div>
                </div>

                <div className="info-box">
                    <p>This shop uses <b>manual verification</b>. Please arrive 15 minutes early and bring your original Aadhar Card and Driving License.</p>
                </div>
            </div>

            <style>{`
        .map-container {
            height: 300px;
            width: 100%;
            position: relative;
            background: #222;
        }
        .map-overlay {
            position: absolute;
            bottom: 50px;
            right: 20px;
        }
        
        .shop-card {
            background: #1A1A1A;
            border: 1px solid #333;
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        
        .open-dot { width: 8px; height: 8px; background: #00C851; border-radius: 50%; box-shadow: 0 0 10px #00C851; }
        
        .divider { height: 1px; background: #333; margin: 16px 0; }
        
        .label-text { font-size: 10px; color: #666; font-weight: 700; letter-spacing: 1px; margin-bottom: 4px; }
        .value-text { font-size: 16px; font-weight: 600; color: white; }

        .section-title { font-size: 14px; font-weight: 700; margin-bottom: 16px; color: white; }
        
        .prep-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .prep-card { background: #151515; border: 1px solid #252525; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; alignItems: center; gap: 10px; text-align: center; }
        .prep-card p { font-size: 12px; font-weight: 600; color: #ccc; }
        .icon-box { background: rgba(255, 46, 77, 0.1); padding: 10px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

        .info-box { background: rgba(255, 255, 255, 0.05); border-left: 3px solid var(--color-primary); padding: 12px 16px; border-radius: 4px; font-size: 12px; color: #aaa; line-height: 1.5; }
        .info-box b { color: white; }
      `}</style>
        </div>
    );
}
