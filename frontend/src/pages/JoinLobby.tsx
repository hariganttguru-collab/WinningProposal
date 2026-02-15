import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLobby } from '../context/LobbyContext';

export default function JoinLobby() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { joinLobby } = useLobby();

    const handleJoin = () => {
        if (!code.trim()) {
            setError('Please enter a lobby code');
            return;
        }

        if (!user) {
            setError('You must be logged in');
            return;
        }

        setLoading(true);
        setError('');

        joinLobby(code.toUpperCase(), user.id, user.username).then((success) => {
            if (success) {
                navigate('/lobby');
            } else {
                setError('Invalid lobby code or game already started');
                setLoading(false);
            }
        });
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
                maxWidth: '500px'
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '32px'
                }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#f1f5f9',
                        margin: '0 0 8px 0'
                    }}>
                        Join Multiplayer Lobby
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#94a3b8',
                        margin: '0'
                    }}>
                        Enter the 6-character code from your admin
                    </p>
                </div>

                {/* Join Card */}
                <div style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    padding: '40px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                    border: '1px solid #334155'
                }}>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#f1f5f9',
                            marginBottom: '8px'
                        }}>
                            Lobby Code
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="Enter 6-character code"
                            maxLength={6}
                            style={{
                                width: '100%',
                                padding: '16px 20px',
                                backgroundColor: '#0f172a',
                                border: '2px solid #475569',
                                borderRadius: '8px',
                                color: '#f1f5f9',
                                fontSize: '24px',
                                fontWeight: '700',
                                textAlign: 'center',
                                letterSpacing: '8px',
                                fontFamily: 'monospace',
                                outline: 'none',
                                transition: 'border-color 0.2s ease',
                                boxSizing: 'border-box',
                                textTransform: 'uppercase'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#475569'}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleJoin();
                                }
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px',
                            backgroundColor: '#7f1d1d',
                            border: '1px solid #ef4444',
                            borderRadius: '8px',
                            color: '#fecaca',
                            fontSize: '14px',
                            marginBottom: '20px',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleJoin}
                        disabled={loading || code.length !== 6}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: code.length === 6 ? '#3b82f6' : '#475569',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: code.length === 6 ? 'pointer' : 'not-allowed',
                            opacity: code.length === 6 ? 1 : 0.5,
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                            marginBottom: '16px'
                        }}
                    >
                        {loading ? 'Joining...' : 'Join Lobby'}
                    </button>

                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: 'transparent',
                            color: '#94a3b8',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = '#64748b';
                            e.currentTarget.style.color = '#e2e8f0';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#475569';
                            e.currentTarget.style.color = '#94a3b8';
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
