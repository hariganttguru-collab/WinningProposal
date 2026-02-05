import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLobby } from '../context/LobbyContext';

export default function PlayerWaitingScreen() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentLobby } = useLobby();
    const [allSubmitted, setAllSubmitted] = useState(false);
    const [submittedCount, setSubmittedCount] = useState(0);
    const [totalPlayers, setTotalPlayers] = useState(0);

    useEffect(() => {
        if (!user || !currentLobby) {
            navigate('/dashboard');
            return;
        }

        const checkSubmissions = () => {
            const players = currentLobby.players.filter(p => p.role !== 'admin');
            setTotalPlayers(players.length);

            let count = 0;
            players.forEach(player => {
                const bidData = localStorage.getItem(`lobby_${currentLobby.code}_bid_${player.id}`);
                if (bidData) {
                    count++;
                }
            });

            setSubmittedCount(count);
            setAllSubmitted(count === players.length && players.length > 0);
        };

        checkSubmissions();
        const interval = setInterval(checkSubmissions, 1000);

        return () => clearInterval(interval);
    }, [currentLobby, user, navigate]);

    // When all submitted, navigate to results
    useEffect(() => {
        if (allSubmitted && currentLobby) {
            // Wait a moment then navigate to results
            setTimeout(() => {
                navigate('/multiplayer-results');
            }, 2000);
        }
    }, [allSubmitted, currentLobby, navigate]);

    if (!currentLobby) {
        return null;
    }

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
                maxWidth: '600px',
                width: '100%',
                textAlign: 'center'
            }}>
                {!allSubmitted ? (
                    <>
                        <div style={{
                            fontSize: '64px',
                            marginBottom: '30px',
                            animation: 'pulse 2s ease-in-out infinite'
                        }}>
                            ⏳
                        </div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#f1f5f9',
                            margin: '0 0 16px 0'
                        }}>
                            Bid Submitted Successfully!
                        </h1>
                        <p style={{
                            fontSize: '18px',
                            color: '#94a3b8',
                            margin: '0 0 40px 0'
                        }}>
                            Waiting for other players to submit their bids...
                        </p>

                        <div style={{
                            backgroundColor: '#1e293b',
                            borderRadius: '12px',
                            padding: '30px',
                            border: '1px solid #334155',
                            marginBottom: '30px'
                        }}>
                            <div style={{
                                fontSize: '48px',
                                fontWeight: '700',
                                color: '#3b82f6',
                                marginBottom: '10px'
                            }}>
                                {submittedCount} / {totalPlayers}
                            </div>
                            <div style={{
                                fontSize: '16px',
                                color: '#94a3b8'
                            }}>
                                Players Submitted
                            </div>

                            <div style={{
                                width: '100%',
                                height: '12px',
                                backgroundColor: '#0f172a',
                                borderRadius: '6px',
                                marginTop: '20px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${(submittedCount / totalPlayers) * 100}%`,
                                    height: '100%',
                                    backgroundColor: '#3b82f6',
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#1e293b',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid #334155',
                            fontSize: '14px',
                            color: '#94a3b8',
                            lineHeight: '1.6'
                        }}>
                            💡 <strong style={{ color: '#f1f5f9' }}>Tip:</strong> Once all players submit, you'll be automatically redirected to the results page where you can see how your bid compares!
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{
                            fontSize: '64px',
                            marginBottom: '30px'
                        }}>
                            ✅
                        </div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#10b981',
                            margin: '0 0 16px 0'
                        }}>
                            All Bids Submitted!
                        </h1>
                        <p style={{
                            fontSize: '18px',
                            color: '#94a3b8',
                            margin: '0'
                        }}>
                            Redirecting to results...
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
