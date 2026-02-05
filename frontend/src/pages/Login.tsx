import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'admin' | 'user'>('user');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password');
            setLoading(false);
            return;
        }

        const success = await login(username, password, role);

        if (success) {
            navigate('/dashboard');
        } else {
            setError('Login failed. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '450px'
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#f1f5f9',
                        margin: '0 0 8px 0'
                    }}>
                        Fixed Price Contract Simulation
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#94a3b8',
                        margin: '0'
                    }}>
                        Sign in to access multiplayer mode
                    </p>
                </div>

                {/* Login Card */}
                <div style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    padding: '40px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                    border: '1px solid #334155'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#f1f5f9',
                        margin: '0 0 24px 0',
                        textAlign: 'center'
                    }}>
                        Sign In
                    </h2>

                    <form onSubmit={handleSubmit}>
                        {/* Role Selection */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#f1f5f9',
                                marginBottom: '8px'
                            }}>
                                I am a:
                            </label>
                            <div style={{
                                display: 'flex',
                                gap: '12px'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setRole('user')}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        backgroundColor: role === 'user' ? '#3b82f6' : '#0f172a',
                                        color: role === 'user' ? 'white' : '#94a3b8',
                                        border: role === 'user' ? '2px solid #3b82f6' : '2px solid #475569',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    👤 User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('admin')}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        backgroundColor: role === 'admin' ? '#10b981' : '#0f172a',
                                        color: role === 'admin' ? 'white' : '#94a3b8',
                                        border: role === 'admin' ? '2px solid #10b981' : '2px solid #475569',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    👑 Admin
                                </button>
                            </div>
                        </div>

                        {/* Username Input */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#f1f5f9',
                                marginBottom: '8px'
                            }}>
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    backgroundColor: '#0f172a',
                                    border: '2px solid #475569',
                                    borderRadius: '8px',
                                    color: '#f1f5f9',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#475569'}
                            />
                        </div>

                        {/* Password Input */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#f1f5f9',
                                marginBottom: '8px'
                            }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    backgroundColor: '#0f172a',
                                    border: '2px solid #475569',
                                    borderRadius: '8px',
                                    color: '#f1f5f9',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#475569'}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#7f1d1d',
                                border: '1px solid #ef4444',
                                borderRadius: '8px',
                                color: '#fecaca',
                                fontSize: '14px',
                                marginBottom: '20px'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                backgroundColor: role === 'admin' ? '#10b981' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            {loading ? 'Signing in...' : `Sign in as ${role === 'admin' ? 'Admin' : 'User'}`}
                        </button>
                    </form>

                    {/* Info Box */}
                    <div style={{
                        marginTop: '24px',
                        padding: '16px',
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        border: '1px solid #334155'
                    }}>
                        <div style={{
                            fontSize: '12px',
                            color: '#94a3b8',
                            lineHeight: '1.6'
                        }}>
                            <strong style={{ color: '#f1f5f9', display: 'block', marginBottom: '8px' }}>
                                Role Information:
                            </strong>
                            <div style={{ marginBottom: '6px' }}>
                                <span style={{ color: '#10b981' }}>👑 Admin:</span> Can create multiplayer lobbies
                            </div>
                            <div>
                                <span style={{ color: '#3b82f6' }}>👤 User:</span> Can join lobbies with a code
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
