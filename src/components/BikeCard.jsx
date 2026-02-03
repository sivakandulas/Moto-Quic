import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ChevronRight } from 'lucide-react';

export default function BikeCard({ bike }) {
  // Destructure with defaults
  const {
    id,
    name,
    grade = 'Mint',
    engine_cc = 'N/A',
    gearbox = 'Manual',
    fuel_type = 'Petrol',
    price_day = 0,
    image_url,
    status = 'available',
    tag = null
  } = bike;

  const isAvailable = status === 'available';

  return (
    <div className="bike-card fade-in">
      {/* Image Area */}
      <div className="card-image-container">
        {tag && <span className="tag-badge">{tag}</span>}
        <img
          src={image_url || 'https://placehold.co/600x400/1a1a1a/FFF?text=Bike+Image'}
          alt={name}
          className="bike-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/600x400/1a1a1a/FFF?text=No+Image';
          }}
        />
        <div className="image-overlay"></div>

        <div className="card-header-content">
          <h3 className="bike-name">{name}</h3>
          <div className="status-badge flex-center" style={{ justifyContent: 'flex-start', gap: '6px' }}>
            <CheckCircle size={14} color={isAvailable ? 'var(--color-success)' : 'var(--color-text-muted)'} fill={isAvailable ? 'var(--color-success)' : 'transparent'} />
            <span style={{ fontSize: '12px', fontWeight: '500', color: isAvailable ? 'white' : '#999' }}>
              {isAvailable ? 'Ready to Ride' : 'Unavailable'}
            </span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="card-body">
        {/* Specs Grid */}
        <div className="specs-grid">
          <div className="spec-item">
            <span className="spec-label">ENGINE</span>
            <span className="spec-value">{engine_cc}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">TYPE</span>
            <span className="spec-value">{gearbox}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">FUEL</span>
            <span className="spec-value">{fuel_type}</span>
          </div>
          <div className="spec-item price-item">
            <span className="spec-label">PER DAY</span>
            <span className="spec-value price">₹{price_day.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link to={`/bikes/${id}`} className="btn btn-primary full-width-btn">
          <span>Bike Details</span>
          <ChevronRight size={20} />
        </Link>
      </div>

      <style>{`
        .bike-card {
          background: var(--color-bg-card);
          border-radius: var(--radius-lg);
          overflow: hidden;
          position: relative;
          border: 1px solid #333;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .bike-card:hover {
          border-color: #555;
          transform: translateY(-4px);
        }

        .card-image-container {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .bike-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .bike-card:hover .bike-image {
          transform: scale(1.05);
        }
        
        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80%;
          background: linear-gradient(to top, rgba(15,15,15,0.95), transparent);
          pointer-events: none;
        }

        .tag-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: var(--color-primary);
          color: white;
          padding: 4px 12px;
          border-radius: 4px; /* Sharp/Small radius for tag */
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          z-index: 10;
          letter-spacing: 0.5px;
        }

        .card-header-content {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 16px;
          z-index: 10;
        }

        .bike-name {
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .card-body {
          padding: 16px;
          background: #1E1E1E;
        }

        .specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr; /* 4 columns */
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .spec-item {
          display: flex;
          flex-direction: column;
        }
        
        .spec-label {
          font-size: 9px;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 2px;
          font-weight: 600;
        }
        
        .spec-value {
          font-size: 13px;
          font-weight: 600;
          color: white;
        }

        .price-item {
            text-align: right;
        }

        .spec-value.price {
          color: var(--color-primary);
          font-size: 16px;
          font-weight: 700;
        }

        .full-width-btn {
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 14px 20px;
          background: var(--color-primary);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase; /* Match mockup? No, mockup is Title Case but looks bold */
        }
      `}</style>
    </div>
  );
}
