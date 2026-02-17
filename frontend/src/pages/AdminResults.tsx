import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLobby } from '../context/LobbyContext';
import { generateBots } from '../utils/botGenerator';
import { supabase } from '../lib/supabase';
import { formatFullK } from '../utils/formatters';

interface PlayerBid {
    userId: string;
    username: string;
    bidPrice: number;
    contributionMargin: number;
    isDisqualified: boolean;
    disqualificationReasons: string[];
    totalResourceCost: number;
    totalCost: number;
    projectDuration: number;
    submittedAt: number;
    rank?: number;
    inputs: any;
}

export default function AdminResults() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentLobby, isAdmin } = useLobby();
    const [playerBids, setPlayerBids] = useState<PlayerBid[]>([]);
    const [allSubmitted, setAllSubmitted] = useState(false);
    const [selectedBid, setSelectedBid] = useState<PlayerBid | null>(null);
    const [showStrategyModal, setShowStrategyModal] = useState(false);
    const [comparisonBid1, setComparisonBid1] = useState<PlayerBid | null>(null);
    const [comparisonBid2, setComparisonBid2] = useState<PlayerBid | null>(null);
    const [showComparisonModal, setShowComparisonModal] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [compareId1, setCompareId1] = useState<string>('');
    const [compareId2, setCompareId2] = useState<string>('');
    const [isRevealing, setIsRevealing] = useState(false);
    const [revealSuccess, setRevealSuccess] = useState(false);

    useEffect(() => {
        if (!user || !currentLobby || !isAdmin(user.id)) {
            navigate('/dashboard');
        }
    }, [user, currentLobby, isAdmin, navigate]);

    // Timer countdown
    useEffect(() => {
        if (!currentLobby) return;

        const timerEndTime = localStorage.getItem(`lobby_${currentLobby.code}_timer`);
        if (!timerEndTime) return;

        const updateTimer = () => {
            const now = Date.now();
            const endTime = parseInt(timerEndTime);
            const remaining = Math.max(0, endTime - now);
            setTimeRemaining(remaining);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [currentLobby]);

    // Format time remaining
    const formatTimeRemaining = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (!currentLobby) return;

        const checkSubmissions = () => {
            const players = currentLobby.players.filter(p => p.role !== 'admin');
            const bids: PlayerBid[] = [];

            players.forEach(player => {
                if (player.bidData) {
                    bids.push(player.bidData);
                }
            });

            // Generate bots to ensure minimum 5 total bids
            const totalBids = bids.length;
            const botsNeeded = Math.max(0, 5 - totalBids);

            // Check if all players have submitted
            const allPlayersSubmitted = players.every(p => !!p.bidData) && players.length > 0;

            if (botsNeeded > 0 && allPlayersSubmitted) {
                // Check if bots already exist in Supabase
                const existingBots = currentLobby.simulationData?.bots;

                if (!existingBots) {
                    // Generate bots only if they don't exist
                    const generatedBots = generateBots(botsNeeded);
                    const botBids = generatedBots.map(bot => ({
                        userId: `bot_${bot.name}`,
                        username: `${bot.name} 🤖`,
                        bidPrice: bot.bidPrice,
                        contributionMargin: bot.contributionMargin,
                        isDisqualified: bot.isDisqualified,
                        disqualificationReasons: bot.disqualificationReasons,
                        totalResourceCost: bot.totalResourceCost,
                        totalCost: bot.totalCost,
                        projectDuration: bot.projectDuration,
                        submittedAt: Date.now(),
                        inputs: {
                            deliverables: bot.deliverables,
                            estimationAccuracy: bot.estimationAccuracy,
                            resourceAllocation: bot.resourceAllocation,
                            workSchedule: bot.workSchedule,
                            salaries: bot.salaries,
                            overhead: bot.overhead
                        }
                    }));

                    // Save bots to Supabase simulation_data
                    const updatedSimulationData = {
                        ...(currentLobby.simulationData || {}),
                        bots: botBids
                    };

                    supabase
                        .from('lobbies')
                        .update({ simulation_data: updatedSimulationData })
                        .eq('id', currentLobby.id)
                        .then(({ error }) => {
                            if (error) console.error('Error saving bots to Supabase:', error);
                        });

                    bids.push(...botBids);
                } else {
                    // Load existing bots
                    bids.push(...existingBots);
                }
            }

            const qualified = bids.filter(bid => !bid.isDisqualified && bid.contributionMargin > 0);
            const disqualified = bids.filter(bid => bid.isDisqualified || bid.contributionMargin <= 0);

            // Add CM reason to disqualified bids
            disqualified.forEach(bid => {
                if (bid.contributionMargin <= 0 && !bid.disqualificationReasons.includes('Contribution Margin must be positive')) {
                    bid.isDisqualified = true;
                    bid.disqualificationReasons.push('Contribution Margin must be positive');
                }
            });

            // Sort qualified by bid price (lower is better)
            qualified.sort((a, b) => a.bidPrice - b.bidPrice);

            qualified.forEach((bid, index) => {
                bid.rank = index + 1;
            });

            disqualified.forEach(bid => {
                bid.rank = -1;
            });

            const sortedBids = [...qualified, ...disqualified];
            setPlayerBids(sortedBids);
            setAllSubmitted(allPlayersSubmitted);
        };

        checkSubmissions();
    }, [currentLobby]);


    const closeComparisonModal = () => {
        setShowComparisonModal(false);
        setComparisonBid1(null);
        setComparisonBid2(null);
    };

    const handleViewStrategy = (player: PlayerBid) => {
        setSelectedBid(player);
        setShowStrategyModal(true);
    };

    const closeStrategyModal = () => {
        setShowStrategyModal(false);
        setSelectedBid(null);
    };

    const handleComparePlayers = () => {
        const p1 = playerBids.find(b => b.userId === compareId1);
        const p2 = playerBids.find(b => b.userId === compareId2);
        if (p1 && p2) {
            setComparisonBid1(p1);
            setComparisonBid2(p2);
            setShowComparisonModal(true);
        }
    };

    if (!currentLobby) {
        return null;
    }

    const totalPlayers = currentLobby.players.filter(p => p.role !== 'admin').length;
    const submittedCount = playerBids.length;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '30px' }}>
                    <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', backgroundColor: '#1e293b', color: '#e2e8f0', border: '2px solid #475569', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
                        ← Back to Dashboard
                    </button>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 10px 0' }}>
                                Admin Results Dashboard
                            </h1>
                            <p style={{ fontSize: '18px', color: '#94a3b8', margin: '0' }}>
                                Lobby Code: <span style={{ color: '#3b82f6', fontWeight: '600' }}>{currentLobby.code}</span>
                            </p>
                        </div>

                        <button
                            onClick={() => setShowFeedbackModal(true)}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <span>💬</span> View Feedback ({currentLobby.simulationData?.feedback?.length || 0})
                        </button>
                    </div>
                </div>

                {/* Timer Display */}
                {timeRemaining !== null && timeRemaining > 0 && (
                    <div style={{
                        backgroundColor: timeRemaining < 60000 ? '#7f1d1d' : timeRemaining < 120000 ? '#92400e' : '#1e293b',
                        border: `2px solid ${timeRemaining < 60000 ? '#dc2626' : timeRemaining < 120000 ? '#f59e0b' : '#3b82f6'}`,
                        borderRadius: '12px',
                        padding: '20px 30px',
                        marginBottom: '30px',
                        textAlign: 'center',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏱️</div>
                        <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                            Time Remaining for Players
                        </div>
                        <div style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: timeRemaining < 60000 ? '#fecaca' : timeRemaining < 120000 ? '#fbbf24' : '#60a5fa'
                        }}>
                            {formatTimeRemaining(timeRemaining)}
                        </div>
                    </div>
                )}

                {!allSubmitted && (
                    <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '30px', marginBottom: '30px', border: '1px solid #334155', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 10px 0' }}>
                            Waiting for Players to Submit
                        </h2>
                        <p style={{ fontSize: '18px', color: '#94a3b8', margin: '0' }}>
                            {submittedCount} of {totalPlayers} players have submitted their bids
                        </p>
                        <div style={{ width: '100%', height: '12px', backgroundColor: '#0f172a', borderRadius: '6px', marginTop: '20px', overflow: 'hidden' }}>
                            <div style={{ width: `${(submittedCount / totalPlayers) * 100}%`, height: '100%', backgroundColor: '#3b82f6', transition: 'width 0.3s ease' }} />
                        </div>
                    </div>
                )}

                {allSubmitted && (
                    <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)', border: '1px solid #334155', marginBottom: '30px' }}>
                        <div style={{ backgroundColor: '#10b981', color: 'white', padding: '20px 30px', fontWeight: '600', fontSize: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>🏆 Final Results - All Players Submitted</span>
                            <button
                                onClick={async () => {
                                    setIsRevealing(true);
                                    const { error } = await supabase
                                        .from('lobbies')
                                        .update({ status: 'completed' })
                                        .eq('id', currentLobby.id);

                                    setIsRevealing(false);
                                    if (error) {
                                        console.error('Error completing lobby:', error);
                                        alert('Failed to reveal results. Please try again.');
                                    } else {
                                        setRevealSuccess(true);
                                    }
                                }}
                                disabled={isRevealing || revealSuccess || currentLobby.status === 'completed'}
                                className="reveal-button"
                                style={{
                                    padding: '8px 20px',
                                    backgroundColor: revealSuccess || currentLobby.status === 'completed' ? '#059669' : 'white',
                                    color: revealSuccess || currentLobby.status === 'completed' ? 'white' : '#10b981',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: '700',
                                    cursor: (isRevealing || revealSuccess || currentLobby.status === 'completed') ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.1s ease',
                                    boxShadow: isRevealing ? 'inset 0 2px 4px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.1)',
                                    transform: isRevealing ? 'scale(0.98)' : 'scale(1)'
                                }}
                            >
                                {isRevealing ? (
                                    <>
                                        <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span> Processing...
                                    </>
                                ) : (revealSuccess || currentLobby.status === 'completed') ? (
                                    <>✅ Results Revealed</>
                                ) : (
                                    <>Reveal Results to Players</>
                                )}
                            </button>
                            <style>{`
                                @keyframes spin {
                                    from { transform: rotate(0deg); }
                                    to { transform: rotate(360deg); }
                                }
                                .reveal-button:active {
                                    transform: scale(0.95);
                                }
                            `}</style>
                        </div>
                        <div style={{ padding: '30px' }}>
                            <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ backgroundColor: '#1e293b', padding: '16px 20px', borderBottom: '2px solid #334155', fontWeight: '600', color: '#f1f5f9', fontSize: '14px', textAlign: 'left' }}>Rank</th>
                                            <th style={{ backgroundColor: '#1e293b', padding: '16px 20px', borderBottom: '2px solid #334155', borderLeft: '1px solid #334155', fontWeight: '600', color: '#f1f5f9', fontSize: '14px', textAlign: 'left' }}>Player</th>
                                            <th style={{ backgroundColor: '#1e293b', padding: '16px 20px', borderBottom: '2px solid #334155', borderLeft: '1px solid #334155', fontWeight: '600', color: '#f1f5f9', fontSize: '14px', textAlign: 'right' }}>Bid Price</th>
                                            <th style={{ backgroundColor: '#1e293b', padding: '16px 20px', borderBottom: '2px solid #334155', borderLeft: '1px solid #334155', fontWeight: '600', color: '#f1f5f9', fontSize: '14px', textAlign: 'right' }}>Contribution Margin</th>
                                            <th style={{ backgroundColor: '#1e293b', padding: '16px 20px', borderBottom: '2px solid #334155', borderLeft: '1px solid #334155', fontWeight: '600', color: '#f1f5f9', fontSize: '14px', textAlign: 'center' }}>Duration</th>
                                            <th style={{ backgroundColor: '#1e293b', padding: '16px 20px', borderBottom: '2px solid #334155', borderLeft: '1px solid #334155', fontWeight: '600', color: '#f1f5f9', fontSize: '14px', textAlign: 'center' }}>Status</th>
                                            <th style={{ backgroundColor: '#1e293b', padding: '16px 20px', borderBottom: '2px solid #334155', borderLeft: '1px solid #334155', fontWeight: '600', color: '#f1f5f9', fontSize: '14px', textAlign: 'center' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {playerBids.map((bid) => (
                                            <tr key={bid.userId} style={{ backgroundColor: bid.rank === 1 && !bid.isDisqualified ? '#065f46' : bid.isDisqualified ? '#7f1d1d' : '#0f172a' }}>
                                                <td style={{ padding: '12px 20px', borderBottom: '1px solid #334155', color: bid.isDisqualified ? '#fecaca' : bid.rank === 1 ? '#6ee7b7' : '#e2e8f0', fontWeight: '700', fontSize: '16px' }}>
                                                    {bid.isDisqualified ? 'DQ' : (bid.rank === 1 ? '🥇' : bid.rank === 2 ? '🥈' : bid.rank === 3 ? '🥉' : `#${bid.rank}`)}
                                                </td>
                                                <td style={{ padding: '12px 20px', borderBottom: '1px solid #334155', borderLeft: '1px solid #334155', color: bid.isDisqualified ? '#fecaca' : bid.rank === 1 ? 'white' : '#e2e8f0', fontWeight: '600' }}>
                                                    {bid.username}
                                                </td>
                                                <td style={{ padding: '12px 20px', borderBottom: '1px solid #334155', borderLeft: '1px solid #334155', textAlign: 'right', color: bid.isDisqualified ? '#fecaca' : bid.rank === 1 ? 'white' : '#10b981', fontWeight: '600' }}>
                                                    {formatFullK(bid.bidPrice)}
                                                </td>
                                                <td style={{ padding: '12px 20px', borderBottom: '1px solid #334155', borderLeft: '1px solid #334155', textAlign: 'right', color: bid.isDisqualified ? '#fecaca' : bid.rank === 1 ? 'white' : '#e2e8f0', fontWeight: '600' }}>
                                                    {formatFullK(Math.round(bid.contributionMargin))}
                                                </td>
                                                <td style={{ padding: '12px 20px', borderBottom: '1px solid #334155', borderLeft: '1px solid #334155', textAlign: 'center', color: bid.isDisqualified ? '#fecaca' : bid.rank === 1 ? 'white' : '#e2e8f0', fontWeight: '500' }}>
                                                    {bid.projectDuration} mo
                                                </td>
                                                <td style={{ padding: '12px 20px', borderBottom: '1px solid #334155', borderLeft: '1px solid #334155', textAlign: 'center' }}>
                                                    {bid.isDisqualified ? (
                                                        <span style={{ padding: '6px 12px', backgroundColor: '#7f1d1d', color: '#fecaca', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>DISQUALIFIED</span>
                                                    ) : bid.rank === 1 ? (
                                                        <span style={{ padding: '6px 12px', backgroundColor: '#065f46', color: '#6ee7b7', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>WINNER</span>
                                                    ) : (
                                                        <span style={{ padding: '6px 12px', backgroundColor: '#1e40af', color: '#93c5fd', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>QUALIFIED</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '12px 20px', borderBottom: '1px solid #334155', borderLeft: '1px solid #334155', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <button onClick={() => handleViewStrategy(bid)} style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                                                            View Strategy
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Custom Comparison Section */}
                {playerBids.length >= 2 && (
                    <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '30px', border: '1px solid #334155', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>📊</span> Custom Comparison
                        </h3>
                        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>Select any two players to compare their bidding strategies side-by-side.</p>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Player 1</label>
                                <select
                                    value={compareId1}
                                    onChange={(e) => setCompareId1(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px', backgroundColor: '#0f172a', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', outline: 'none', transition: 'border-color 0.2s' }}
                                >
                                    <option value="">Choose a player...</option>
                                    {playerBids.map(bid => (
                                        <option key={bid.userId} value={bid.userId} disabled={bid.userId === compareId2}>
                                            {bid.username} (#{bid.isDisqualified ? 'DQ' : bid.rank})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ fontSize: '20px', color: '#475569', fontWeight: '700', paddingBottom: '12px' }}>VS</div>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Player 2</label>
                                <select
                                    value={compareId2}
                                    onChange={(e) => setCompareId2(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px', backgroundColor: '#0f172a', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', outline: 'none', transition: 'border-color 0.2s' }}
                                >
                                    <option value="">Choose a player...</option>
                                    {playerBids.map(bid => (
                                        <option key={bid.userId} value={bid.userId} disabled={bid.userId === compareId1}>
                                            {bid.username} (#{bid.isDisqualified ? 'DQ' : bid.rank})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleComparePlayers}
                                disabled={!compareId1 || !compareId2}
                                style={{
                                    padding: '12px 30px',
                                    backgroundColor: compareId1 && compareId2 ? '#3b82f6' : '#1e293b',
                                    color: compareId1 && compareId2 ? 'white' : '#475569',
                                    border: compareId1 && compareId2 ? 'none' : '1px solid #334155',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    cursor: compareId1 && compareId2 ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s ease',
                                    minWidth: '150px'
                                }}
                            >
                                Compare
                            </button>
                        </div>
                    </div>
                )}


                {!allSubmitted && submittedCount > 0 && (

                    <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '30px', border: '1px solid #334155' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 20px 0' }}>
                            Players Who Have Submitted ({submittedCount})
                        </h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {playerBids.map(bid => (
                                <div key={bid.userId} style={{ backgroundColor: '#0f172a', padding: '16px 20px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>✓</div>
                                    <div>
                                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9' }}>{bid.username}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Submitted at {new Date(bid.submittedAt).toLocaleTimeString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Strategy Modal */}
            {showStrategyModal && selectedBid && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px',
                    overflow: 'auto'
                }}>
                    <div style={{
                        backgroundColor: '#1e293b',
                        borderRadius: '16px',
                        maxWidth: '900px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        border: '2px solid #334155'
                    }}>
                        {/* Header */}
                        <div style={{
                            backgroundColor: '#0f172a',
                            padding: '24px 32px',
                            borderBottom: '2px solid #334155',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1
                        }}>
                            <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: '24px' }}>
                                📊 {selectedBid.username}'s Strategy
                            </h2>
                            <button
                                onClick={closeStrategyModal}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}
                            >
                                Close
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '32px' }}>
                            {/* Summary Cards */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '16px',
                                marginBottom: '32px'
                            }}>
                                <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Bid Price</div>
                                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>
                                        {formatFullK(selectedBid.bidPrice)}
                                    </div>
                                </div>
                                <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Contribution Margin</div>
                                    <div style={{ fontSize: '28px', fontWeight: '700', color: selectedBid.contributionMargin > 0 ? '#10b981' : '#ef4444' }}>
                                        {formatFullK(Math.round(selectedBid.contributionMargin))}
                                    </div>
                                </div>
                                <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Project Duration</div>
                                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#f1f5f9' }}>
                                        {selectedBid.projectDuration} mo
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            {selectedBid.isDisqualified && (
                                <div style={{
                                    backgroundColor: '#7f1d1d',
                                    border: '2px solid #dc2626',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    marginBottom: '32px'
                                }}>
                                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#fecaca', marginBottom: '12px' }}>
                                        ❌ Disqualified
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#fecaca' }}>
                                        {selectedBid.disqualificationReasons.map((reason, idx) => (
                                            <li key={idx} style={{ marginBottom: '8px' }}>{reason}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Financial Breakdown */}
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', marginBottom: '16px' }}>
                                    💰 Financial Breakdown
                                </h3>
                                <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '12px 20px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>Total Resource Cost</td>
                                                <td style={{ padding: '12px 20px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                    ${formatFullK(Math.round(selectedBid.totalResourceCost))}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '12px 20px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                    Contingency ({selectedBid.inputs.overhead.contingencyPercent}%)
                                                </td>
                                                <td style={{ padding: '12px 20px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                    ${formatFullK(Math.round(selectedBid.totalResourceCost * (selectedBid.inputs.overhead.contingencyPercent / 100)))}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '12px 20px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                    Overhead ({selectedBid.inputs.overhead.overheadPercent}%)
                                                </td>
                                                <td style={{ padding: '12px 20px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                    ${formatFullK(Math.round(selectedBid.totalResourceCost * (selectedBid.inputs.overhead.overheadPercent / 100)))}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '12px 20px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                    Quality/Rework ({selectedBid.inputs.overhead.qualityPercent}%)
                                                </td>
                                                <td style={{ padding: '12px 20px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                    ${formatFullK(Math.round(selectedBid.totalResourceCost * (selectedBid.inputs.overhead.qualityPercent / 100)))}
                                                </td>
                                            </tr>
                                            <tr style={{ backgroundColor: '#1e293b' }}>
                                                <td style={{ padding: '12px 20px', color: '#f1f5f9', fontWeight: '700' }}>Total Cost</td>
                                                <td style={{ padding: '12px 20px', textAlign: 'right', color: '#f1f5f9', fontWeight: '700', fontSize: '18px' }}>
                                                    ${Math.round(selectedBid.totalCost).toLocaleString()}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Strategy Details */}
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', marginBottom: '16px' }}>
                                    📋 Strategy Details
                                </h3>
                                <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Estimation Accuracy</div>
                                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9' }}>{selectedBid.inputs.estimationAccuracy}%</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Working Days/Month</div>
                                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9' }}>{selectedBid.inputs.workSchedule.workingDaysPerMonth}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Working Hours/Day</div>
                                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9' }}>{selectedBid.inputs.workSchedule.workingHoursPerDay}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Salaries */}
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', marginBottom: '16px' }}>
                                    💵 Monthly Salaries
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                    <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>UI Junior</div>
                                        <div style={{ fontSize: '20px', fontWeight: '600', color: '#10b981' }}>${selectedBid.inputs.salaries.uiJunior}</div>
                                    </div>
                                    <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>UI Senior</div>
                                        <div style={{ fontSize: '20px', fontWeight: '600', color: '#10b981' }}>${selectedBid.inputs.salaries.uiSenior}</div>
                                    </div>
                                    <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Backend Junior</div>
                                        <div style={{ fontSize: '20px', fontWeight: '600', color: '#10b981' }}>${selectedBid.inputs.salaries.backendJunior}</div>
                                    </div>
                                    <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Backend Senior</div>
                                        <div style={{ fontSize: '20px', fontWeight: '600', color: '#10b981' }}>${selectedBid.inputs.salaries.backendSenior}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Comparison Modal */}
            {showComparisonModal && comparisonBid1 && comparisonBid2 && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px',
                    overflow: 'auto'
                }}>
                    <div style={{
                        backgroundColor: '#1e293b',
                        borderRadius: '16px',
                        maxWidth: '1200px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        border: '2px solid #334155'
                    }}>
                        {/* Header */}
                        <div style={{
                            backgroundColor: '#0f172a',
                            padding: '24px 32px',
                            borderBottom: '2px solid #334155',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1
                        }}>
                            <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: '24px' }}>
                                📊 Bid Comparison
                            </h2>
                            <button
                                onClick={closeComparisonModal}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}
                            >
                                Close
                            </button>
                        </div>

                        {/* Comparison Content */}
                        <div style={{ padding: '32px' }}>
                            {/* Summary Cards */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '24px',
                                marginBottom: '32px'
                            }}>
                                {/* Bid 1 */}
                                <div style={{
                                    backgroundColor: '#0f172a',
                                    padding: '24px',
                                    borderRadius: '12px',
                                    border: '2px solid #3b82f6'
                                }}>
                                    <h3 style={{ margin: '0 0 16px 0', color: '#60a5fa', fontSize: '20px' }}>
                                        {comparisonBid1.username}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Bid Price</div>
                                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                                                {formatFullK(comparisonBid1.bidPrice)}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Contribution Margin</div>
                                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9' }}>
                                                {formatFullK(Math.round(comparisonBid1.contributionMargin))}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Project Duration</div>
                                            <div style={{ fontSize: '20px', fontWeight: '600', color: '#f1f5f9' }}>
                                                {comparisonBid1.projectDuration} months
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bid 2 */}
                                <div style={{
                                    backgroundColor: '#0f172a',
                                    padding: '24px',
                                    borderRadius: '12px',
                                    border: '2px solid #10b981'
                                }}>
                                    <h3 style={{ margin: '0 0 16px 0', color: '#10b981', fontSize: '20px' }}>
                                        {comparisonBid2.username}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Bid Price</div>
                                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                                                {formatFullK(comparisonBid2.bidPrice)}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Contribution Margin</div>
                                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9' }}>
                                                {formatFullK(Math.round(comparisonBid2.contributionMargin))}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Project Duration</div>
                                            <div style={{ fontSize: '20px', fontWeight: '600', color: '#f1f5f9' }}>
                                                {comparisonBid2.projectDuration} months
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Comparison Table */}
                            <div style={{
                                backgroundColor: '#0f172a',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                marginBottom: '24px'
                            }}>
                                <div style={{
                                    padding: '16px 24px',
                                    backgroundColor: '#1e293b',
                                    borderBottom: '1px solid #334155'
                                }}>
                                    <h4 style={{ margin: 0, color: '#f1f5f9', fontSize: '18px' }}>
                                        📦 Deliverables (Totals)
                                    </h4>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#1e293b' }}>
                                            <th style={{ padding: '12px 24px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                Deliverable
                                            </th>
                                            <th style={{ padding: '12px 24px', textAlign: 'right', color: '#60a5fa', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid1.username}
                                            </th>
                                            <th style={{ padding: '12px 24px', textAlign: 'right', color: '#10b981', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid2.username}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Complex Screen (Qty × Effort)
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid1.inputs.deliverables.complexScreen.quantity} × {comparisonBid1.inputs.deliverables.complexScreen.effortPerUnit}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid2.inputs.deliverables.complexScreen.quantity} × {comparisonBid2.inputs.deliverables.complexScreen.effortPerUnit}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Simple Screen (Qty × Effort)
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid1.inputs.deliverables.simpleScreen.quantity} × {comparisonBid1.inputs.deliverables.simpleScreen.effortPerUnit}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid2.inputs.deliverables.simpleScreen.quantity} × {comparisonBid2.inputs.deliverables.simpleScreen.effortPerUnit}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Complex Database (Qty × Effort)
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid1.inputs.deliverables.complexDatabase.quantity} × {comparisonBid1.inputs.deliverables.complexDatabase.effortPerUnit}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid2.inputs.deliverables.complexDatabase.quantity} × {comparisonBid2.inputs.deliverables.complexDatabase.effortPerUnit}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Simple Database (Qty × Effort)
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid1.inputs.deliverables.simpleDatabase.quantity} × {comparisonBid1.inputs.deliverables.simpleDatabase.effortPerUnit}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid2.inputs.deliverables.simpleDatabase.quantity} × {comparisonBid2.inputs.deliverables.simpleDatabase.effortPerUnit}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Resource Allocation */}
                            <div style={{
                                backgroundColor: '#0f172a',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                marginBottom: '24px'
                            }}>
                                <div style={{
                                    padding: '16px 24px',
                                    backgroundColor: '#1e293b',
                                    borderBottom: '1px solid #334155'
                                }}>
                                    <h4 style={{ margin: 0, color: '#f1f5f9', fontSize: '18px' }}>
                                        👥 Resource Allocation
                                    </h4>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#1e293b' }}>
                                            <th style={{ padding: '12px 24px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                Deliverable
                                            </th>
                                            <th style={{ padding: '12px 24px', textAlign: 'right', color: '#60a5fa', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid1.username}
                                            </th>
                                            <th style={{ padding: '12px 24px', textAlign: 'right', color: '#10b981', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid2.username}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Complex Screen
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                Sr: {comparisonBid1.inputs.resourceAllocation.complexScreen.uiSenior}, Jr: {comparisonBid1.inputs.resourceAllocation.complexScreen.uiJunior}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                Sr: {comparisonBid2.inputs.resourceAllocation.complexScreen.uiSenior}, Jr: {comparisonBid2.inputs.resourceAllocation.complexScreen.uiJunior}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Simple Screen
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                Sr: {comparisonBid1.inputs.resourceAllocation.simpleScreen.uiSenior}, Jr: {comparisonBid1.inputs.resourceAllocation.simpleScreen.uiJunior}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                Sr: {comparisonBid2.inputs.resourceAllocation.simpleScreen.uiSenior}, Jr: {comparisonBid2.inputs.resourceAllocation.simpleScreen.uiJunior}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Complex Database
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                Sr: {comparisonBid1.inputs.resourceAllocation.complexDatabase.backendSenior}, Jr: {comparisonBid1.inputs.resourceAllocation.complexDatabase.backendJunior}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                Sr: {comparisonBid2.inputs.resourceAllocation.complexDatabase.backendSenior}, Jr: {comparisonBid2.inputs.resourceAllocation.complexDatabase.backendJunior}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Simple Database
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                Sr: {comparisonBid1.inputs.resourceAllocation.simpleDatabase.backendSenior}, Jr: {comparisonBid1.inputs.resourceAllocation.simpleDatabase.backendJunior}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                Sr: {comparisonBid2.inputs.resourceAllocation.simpleDatabase.backendSenior}, Jr: {comparisonBid2.inputs.resourceAllocation.simpleDatabase.backendJunior}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Work Schedule & Salaries */}
                            <div style={{
                                backgroundColor: '#0f172a',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                marginBottom: '24px'
                            }}>
                                <div style={{
                                    padding: '16px 24px',
                                    backgroundColor: '#1e293b',
                                    borderBottom: '1px solid #334155'
                                }}>
                                    <h4 style={{ margin: 0, color: '#f1f5f9', fontSize: '18px' }}>
                                        ⏰ Work Schedule & 💵 Salaries
                                    </h4>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#1e293b' }}>
                                            <th style={{ padding: '12px 24px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                Metric
                                            </th>
                                            <th style={{ padding: '12px 24px', textAlign: 'right', color: '#60a5fa', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid1.username}
                                            </th>
                                            <th style={{ padding: '12px 24px', textAlign: 'right', color: '#10b981', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid2.username}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Working Days/Month
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid1.inputs.workSchedule.workingDaysPerMonth}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid2.inputs.workSchedule.workingDaysPerMonth}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Working Hours/Day
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid1.inputs.workSchedule.workingHoursPerDay}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid2.inputs.workSchedule.workingHoursPerDay}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                UI Junior Salary
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                ${comparisonBid1.inputs.salaries.uiJunior}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                ${comparisonBid2.inputs.salaries.uiJunior}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                UI Senior Salary
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                ${comparisonBid1.inputs.salaries.uiSenior}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                ${comparisonBid2.inputs.salaries.uiSenior}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Backend Junior Salary
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                ${comparisonBid1.inputs.salaries.backendJunior}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                ${comparisonBid2.inputs.salaries.backendJunior}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Backend Senior Salary
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                ${comparisonBid1.inputs.salaries.backendSenior}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                ${comparisonBid2.inputs.salaries.backendSenior}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Overhead & Financial Summary */}
                            <div style={{
                                backgroundColor: '#0f172a',
                                borderRadius: '12px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    padding: '16px 24px',
                                    backgroundColor: '#1e293b',
                                    borderBottom: '1px solid #334155'
                                }}>
                                    <h4 style={{ margin: 0, color: '#f1f5f9', fontSize: '18px' }}>
                                        💰 Financial Summary
                                    </h4>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#1e293b' }}>
                                            <th style={{ padding: '12px 24px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                Metric
                                            </th>
                                            <th style={{ padding: '12px 24px', textAlign: 'right', color: '#60a5fa', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid1.username}
                                            </th>
                                            <th style={{ padding: '12px 24px', textAlign: 'right', color: '#10b981', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid2.username}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Estimation Accuracy
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid1.inputs.estimationAccuracy}%
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid2.inputs.estimationAccuracy}%
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Total Resource Cost
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                ${Math.round(comparisonBid1.totalResourceCost).toLocaleString()}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                ${Math.round(comparisonBid2.totalResourceCost).toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Contingency
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid1.inputs.overhead.contingencyPercent}%
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid2.inputs.overhead.contingencyPercent}%
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Overhead
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid1.inputs.overhead.overheadPercent}%
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid2.inputs.overhead.overheadPercent}%
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Quality (Rework)
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid1.inputs.overhead.qualityPercent}%
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                {comparisonBid2.inputs.overhead.qualityPercent}%
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '12px 24px', color: '#e2e8f0', borderBottom: '1px solid #334155' }}>
                                                Total Cost
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                ${Math.round(comparisonBid1.totalCost).toLocaleString()}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '1px solid #334155' }}>
                                                ${Math.round(comparisonBid2.totalCost).toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr style={{ backgroundColor: '#1e293b' }}>
                                            <td style={{ padding: '12px 24px', color: '#f1f5f9', fontWeight: '700' }}>
                                                Final Contribution Margin
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: comparisonBid1.contributionMargin > comparisonBid2.contributionMargin ? '#10b981' : '#ef4444', fontWeight: '700', fontSize: '18px' }}>
                                                ${Math.round(comparisonBid1.contributionMargin).toLocaleString()}
                                            </td>
                                            <td style={{ padding: '12px 24px', textAlign: 'right', color: comparisonBid2.contributionMargin > comparisonBid1.contributionMargin ? '#10b981' : '#ef4444', fontWeight: '700', fontSize: '18px' }}>
                                                ${Math.round(comparisonBid2.contributionMargin).toLocaleString()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Feedback Modal */}
            {showFeedbackModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: '#1e293b',
                        borderRadius: '16px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #334155',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                        position: 'relative'
                    }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#f1f5f9', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>💬</span> Player Feedback ({currentLobby.simulationData?.feedback?.length || 0})
                            </h3>
                            <button
                                onClick={() => setShowFeedbackModal(false)}
                                style={{ backgroundColor: 'transparent', color: '#94a3b8', border: 'none', fontSize: '24px', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ padding: '24px', overflowY: 'auto' }}>
                            {!currentLobby.simulationData?.feedback || currentLobby.simulationData.feedback.length === 0 ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155' }}>
                                    No feedback received from players yet.
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    {[...currentLobby.simulationData.feedback].reverse().map((item: any, idx: number) => {
                                        const isOldFormat = typeof item === 'string';
                                        const text = isOldFormat ? item : item.text;
                                        const username = isOldFormat ? 'Anonymous Player' : item.username;
                                        const timeStr = isOldFormat ? '' : new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                        return (
                                            <div
                                                key={idx}
                                                style={{
                                                    backgroundColor: '#0f172a',
                                                    padding: '20px',
                                                    borderRadius: '12px',
                                                    border: '1px solid #334155',
                                                    color: '#e2e8f0',
                                                    fontSize: '15px',
                                                    lineHeight: '1.6',
                                                    borderLeft: '4px solid #3b82f6'
                                                }}
                                            >
                                                {text}
                                                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '12px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                                                    <span style={{ color: '#60a5fa', fontWeight: '600', fontStyle: 'normal' }}>— {username}</span>
                                                    {timeStr && <span>({timeStr})</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '20px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowFeedbackModal(false)}
                                style={{ padding: '10px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
