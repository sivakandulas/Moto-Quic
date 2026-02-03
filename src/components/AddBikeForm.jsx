import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

export default function AddBikeForm({ onClose, onAdd }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Adventure',
        engine_cc: '',
        price_day: '',
        deposit: '5000',
        image_url: ''
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image_url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price_day) return;
        onAdd(formData);
        onClose();
    };

    return (
        <div className="modal-overlay fade-in">
            <div className="modal-content">
                <div className="flex-between" style={{ marginBottom: '20px' }}>
                    <h3>Add New Bike</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="form-group">
                        <label>Bike Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Hero Xpulse 200"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option>Adventure</option>
                            <option>Naked Sport</option>
                            <option>Cruiser</option>
                            <option>Commuter</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Engine (CC)</label>
                        <input
                            type="text"
                            placeholder="e.g. 200cc"
                            value={formData.engine_cc}
                            onChange={e => setFormData({ ...formData, engine_cc: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Price Per Day (₹)</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={formData.price_day}
                            onChange={e => setFormData({ ...formData, price_day: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Deposit (₹)</label>
                        <input
                            type="number"
                            placeholder="5000"
                            value={formData.deposit}
                            onChange={e => setFormData({ ...formData, deposit: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Bike Image</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="file-input"
                                id="bike-image-upload"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="bike-image-upload" className="file-upload-label flex-center">
                                {formData.image_url ? (
                                    <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                ) : (
                                    <>
                                        <Upload size={20} style={{ marginRight: '8px', color: '#999' }} />
                                        <span style={{ color: '#999', fontSize: '12px' }}>Click to Upload Image</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                        Add Bike to Fleet
                    </button>
                </form>
            </div>

            <style>{`
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            backdrop-filter: blur(5px);
        }
        .modal-content {
            background: #1A1A1A;
            border: 1px solid #333;
            padding: 24px;
            border-radius: 16px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        .form-group label {
            display: block;
            font-size: 12px;
            color: #999;
            margin-bottom: 6px;
        }
        .form-group input[type="text"], 
        .form-group input[type="number"], 
        .form-group select {
            width: 100%;
            padding: 10px;
            background: #252525;
            border: 1px solid #333;
            border-radius: 8px;
            color: white;
            font-size: 14px;
        }
        .form-group input:focus {
            border-color: var(--color-primary);
            outline: none;
        }
        
        .file-upload-label {
            width: 100%;
            height: 100px;
            background: #252525;
            border: 1px dashed #444;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .file-upload-label:hover {
            border-color: var(--color-primary);
            background: #2a2a2a;
        }
      `}</style>
        </div>
    );
}
