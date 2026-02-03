import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import BikeCard from '../components/BikeCard';
import { useBikes } from '../context/BikeContext';

const CATEGORIES = ['Discovery', 'Adventure', 'Naked Sport', 'Cruiser'];

export default function Home() {
    const { bikes, loading } = useBikes();
    const [activeCategory, setActiveCategory] = useState('Discovery');
    const [searchQuery, setSearchQuery] = useState('');

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '16px' }}>
                <div className="spinner"></div>
                <p style={{ color: '#666', fontSize: '12px', letterSpacing: '1px' }}>LOADING FLEET...</p>
                <style>{`
                    .spinner {
                        width: 40px;
                        height: 40px;
                        border: 3px solid rgba(255, 46, 77, 0.3);
                        border-radius: 50%;
                        border-top-color: var(--color-primary);
                        animation: spin 1s ease-in-out infinite;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Filter logic
    const filteredBikes = bikes.filter(bike => {
        const matchesCategory = activeCategory === 'Discovery' || bike.type === activeCategory;
        const matchesSearch = bike.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="fade-in">
            {/* Search Bar */}
            <div className="flex-center" style={{ gap: '12px', marginBottom: '24px' }}>
                <div className="search-bar flex-center" style={{ flex: 1, background: '#1A1A1A', padding: '12px 16px', borderRadius: '16px', justifyContent: 'flex-start' }}>
                    <Search size={20} color="#666" style={{ marginRight: '12px' }} />
                    <input
                        type="text"
                        placeholder="Search RE, KTM, Yamaha..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '14px', width: '100%', outline: 'none' }}
                    />
                </div>
                <button className="flex-center" style={{ width: '48px', height: '48px', background: '#1A1A1A', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>
                    <SlidersHorizontal size={20} color="#999" />
                </button>
            </div>

            {/* Filter Toggles */}
            <div className="flex-between" style={{ background: '#1A1A1A', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
                <button className="toggle-btn active" style={{ flex: 1 }}>All Bikes</button>
                <button className="toggle-btn" style={{ flex: 1 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block', marginRight: '6px' }}></span>
                    Ready Now
                </button>
            </div>

            {/* Categories */}
            <div className="category-scroll" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px' }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid-bikes" style={{ paddingBottom: '20px' }}>
                {filteredBikes.map(bike => (
                    <BikeCard key={bike.id} bike={bike} />
                ))}
            </div>

            <style>{`
        .toggle-btn {
            background: transparent;
            border: none;
            color: #666;
            padding: 10px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .toggle-btn.active {
            background: #252525;
            color: white;
        }
        
        .cat-pill {
            background: #1A1A1A;
            border: 1px solid #333;
            color: #999;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s;
        }
        .cat-pill.active {
            background: var(--color-primary);
            border-color: var(--color-primary);
            color: white;
            box-shadow: 0 4px 10px rgba(255, 46, 77, 0.3);
        }
      `}</style>
        </div>
    );
}
