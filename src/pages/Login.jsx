import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft } from 'lucide-react';

export default function Login() {
    const { signInWithGoogle, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="login-page fade-in">
            <button onClick={() => navigate('/')} className="back-btn">
                <ChevronLeft size={24} color="white" /> Back
            </button>

            <div className="login-card">
                <div className="logo-circle">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                    </svg>
                </div>

                <h1>Welcome Back</h1>
                <p>Sign in to manage your bookings and ride history.</p>

                <button onClick={signInWithGoogle} className="google-btn">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                    <span>Sign in with Google</span>
                </button>

                <p className="terms">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>

            <style>{`
                .login-page {
                    min-height: 100vh;
                    background: #111;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    position: relative;
                }
                .back-btn {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    background: none;
                    border: none;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    font-size: 14px;
                }
                .login-card {
                    background: #1A1A1A;
                    border: 1px solid #333;
                    padding: 40px;
                    border-radius: 24px;
                    text-align: center;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 20px 80px rgba(0,0,0,0.5);
                }
                .logo-circle {
                    width: 64px;
                    height: 64px;
                    background: var(--color-primary);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px auto;
                    box-shadow: 0 10px 20px rgba(255, 46, 77, 0.3);
                }
                h1 { font-size: 28px; margin-bottom: 8px; font-weight: 700; }
                p { color: #888; margin-bottom: 32px; font-size: 14px; line-height: 1.5; }
                
                .google-btn {
                    width: 100%;
                    background: white;
                    color: black;
                    border: none;
                    padding: 16px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .google-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(255,255,255,0.1);
                }
                .google-btn img { width: 24px; height: 24px; }

                .terms {
                    margin-top: 24px;
                    font-size: 10px;
                    color: #555;
                    margin-bottom: 0;
                }
            `}</style>
        </div>
    );
}
