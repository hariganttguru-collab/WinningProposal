import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLobby } from '../context/LobbyContext';

export default function Lobby() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentLobby, leaveLobby, startGame, isAdmin } = useLobby();
    const [countdown, setCountdown] = useState<number | null>(null);
    const [timerMinutes, setTimerMinutes] = useState<number>(10);

    const isLobbyAdmin = user ? isAdmin(user.id) : false;
    const players = currentLobby?.players || [];

    // Check if game started
    useEffect(() => {
        if (currentLobby?.status === 'in-progress' && countdown === null) {
            // Start countdown
            setCountdown(3);
        }
    }, [currentLobby?.status, countdown]);

    // Countdown timer
    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            // Navigate based on role
            if (isLobbyAdmin) {
                // Admin goes to results waiting page
                navigate('/admin-results');
            } else {
                // Players go to contract page
                navigate('/contract?mode=MULTI');
            }
        }
    }, [countdown, navigate, isLobbyAdmin]);

    const handleLeaveLobby = () => {
        if (user) {
            leaveLobby(user.id).then(() => {
                navigate('/dashboard');
            });
        } else {
            navigate('/dashboard');
        }
    };

    const handleStartGame = () => {
        if (players.length < 2) {
            alert('Need at least 2 players to start!');
            return;
        }
        if (currentLobby) {
            // Save timer end time to localStorage (add 5 seconds buffer for countdown and loading)
            // Note: In true multiplayer, this should be synced in simulation_data, but for now we'll keep it as is
            const endTime = Date.now() + (timerMinutes * 60 * 1000) + 5000;
            localStorage.setItem(`lobby_${currentLobby.code}_timer`, endTime.toString());
        }
        startGame();
    };

    const copyCodeToClipboard = () => {
        if (currentLobby) {
            navigator.clipboard.writeText(currentLobby.code);
            alert('Lobby code copied to clipboard!');
        }
    };

    if (!currentLobby) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f1f5f9'
            }}>
                <div>
                    <h2>No active lobby</h2>
                    <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
                </div>
            </div>
        );
    }

    // Countdown overlay
    if (countdown !== null && countdown >= 0) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div style={{
                    fontSize: '120px',
                    fontWeight: '700',
                    color: '#3b82f6',
                    animation: 'pulse 1s ease-in-out'
                }}>
                    {countdown === 0 ? 'GO!' : countdown}
                </div>
                <div style={{
                    fontSize: '24px',
                    color: '#94a3b8'
                }}>
                    Starting game...
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0f172a',
            padding: '40px 20px'
        }}>
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: '700',
                        color: '#f1f5f9',
                        margin: '0 0 16px 0'
                    }}>
                        Multiplayer Lobby
                    </h1>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '24px',
                        flexWrap: 'wrap'
                    }}>
                        {/* Lobby Code */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            backgroundColor: '#1e293b',
                            padding: '16px 32px',
                            borderRadius: '12px',
                            border: '2px solid #3b82f6'
                        }}>
                            <span style={{
                                fontSize: '14px',
                                color: '#94a3b8',
                                fontWeight: '500'
                            }}>
                                Lobby Code:
                            </span>
                            <span style={{
                                fontSize: '32px',
                                fontWeight: '700',
                                color: '#3b82f6',
                                letterSpacing: '4px',
                                fontFamily: 'monospace'
                            }}>
                                {currentLobby.code}
                            </span>
                            <button
                                onClick={copyCodeToClipboard}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                            >
                                📋 Copy
                            </button>
                        </div>

                        {/* Timer Setting (Admin Only) */}
                        {isLobbyAdmin && (
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '12px',
                                backgroundColor: '#1e293b',
                                padding: '16px 24px',
                                borderRadius: '12px',
                                border: '2px solid #8b5cf6'
                            }}>
                                <span style={{
                                    fontSize: '20px'
                                }}>
                                    ⏱️
                                </span>
                                <span style={{
                                    fontSize: '14px',
                                    color: '#94a3b8',
                                    fontWeight: '500'
                                }}>
                                    Time Limit:
                                </span>
                                <button
                                    onClick={() => setTimerMinutes(Math.max(1, timerMinutes - 1))}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: '#475569',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: '700'
                                    }}
                                >
                                    −
                                </button>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <input
                                        type="number"
                                        min="1"
                                        max="60"
                                        value={timerMinutes}
                                        onChange={(e) => setTimerMinutes(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                                        style={{
                                            width: '60px',
                                            padding: '8px',
                                            fontSize: '20px',
                                            fontWeight: '700',
                                            textAlign: 'center',
                                            backgroundColor: '#0f172a',
                                            color: '#8b5cf6',
                                            border: '2px solid #8b5cf6',
                                            borderRadius: '6px',
                                            outline: 'none'
                                        }}
                                    />
                                    <span style={{ fontSize: '14px', color: '#94a3b8' }}>min</span>
                                </div>
                                <button
                                    onClick={() => setTimerMinutes(Math.min(60, timerMinutes + 1))}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: '#475569',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: '700'
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Players List */}
                <div style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    padding: '32px',
                    marginBottom: '24px',
                    border: '1px solid #334155'
                }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#f1f5f9',
                        margin: '0 0 24px 0'
                    }}>
                        Players ({players.length})
                    </h2>

                    <div style={{
                        display: 'grid',
                        gap: '12px'
                    }}>
                        {players.map((player) => (
                            <div
                                key={player.id}
                                style={{
                                    backgroundColor: '#0f172a',
                                    padding: '16px 20px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    border: player.role === 'admin' ? '2px solid #10b981' : '1px solid #334155'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: player.role === 'admin' ? '#10b981' : '#3b82f6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px'
                                    }}>
                                        {player.role === 'admin' ? '👑' : '👤'}
                                    </div>
                                    <div>
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#f1f5f9'
                                        }}>
                                            {player.username}
                                            {player.id === user?.id && (
                                                <span style={{
                                                    marginLeft: '8px',
                                                    fontSize: '14px',
                                                    color: '#94a3b8'
                                                }}>
                                                    (You)
                                                </span>
                                            )}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: player.role === 'admin' ? '#10b981' : '#3b82f6',
                                            fontWeight: '500'
                                        }}>
                                            {player.role === 'admin' ? 'Admin' : 'Player'}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    padding: '4px 12px',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                }}>
                                    Ready
                                </div>
                            </div>
                        ))}
                    </div>

                    {players.length < 2 && (
                        <div style={{
                            marginTop: '20px',
                            padding: '16px',
                            backgroundColor: '#92400e',
                            border: '1px solid #f59e0b',
                            borderRadius: '8px',
                            color: '#fde68a',
                            fontSize: '14px',
                            textAlign: 'center'
                        }}>
                            ⚠ Waiting for more players to join... (Minimum 2 players required)
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={handleLeaveLobby}
                        style={{
                            padding: '14px 32px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                    >
                        Leave Lobby
                    </button>

                    {isLobbyAdmin && (
                        <button
                            onClick={handleStartGame}
                            disabled={players.length < 2}
                            style={{
                                padding: '14px 32px',
                                backgroundColor: players.length < 2 ? '#475569' : '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: players.length < 2 ? 'not-allowed' : 'pointer',
                                opacity: players.length < 2 ? 0.5 : 1,
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                if (players.length >= 2) {
                                    e.currentTarget.style.backgroundColor = '#059669';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (players.length >= 2) {
                                    e.currentTarget.style.backgroundColor = '#10b981';
                                }
                            }}
                        >
                            🚀 Start Game
                        </button>
                    )}
                </div>

                {/* Info Box */}
                {isLobbyAdmin && (
                    <div style={{
                        marginTop: '32px',
                        padding: '20px',
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        border: '1px solid #334155',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '14px',
                            color: '#94a3b8',
                            lineHeight: '1.6'
                        }}>
                            <strong style={{ color: '#f1f5f9' }}>Admin Instructions:</strong><br />
                            Share the lobby code <strong style={{ color: '#3b82f6' }}>{currentLobby.code}</strong> with other players.<br />
                            Once everyone has joined, click "Start Game" to begin the simulation.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
