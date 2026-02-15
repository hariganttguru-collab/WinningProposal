import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLobby } from '../context/LobbyContext';
import { formatFullK } from '../utils/formatters';

interface PlayerBid {
    userId?: string;
    username: string;
    bidPrice: number;
    contributionMargin: number;
    isDisqualified: boolean;
    disqualificationReasons: string[];
    totalResourceCost: number;
    totalCost: number;
    projectDuration: number;
    submittedAt?: number;
    rank?: number;
    inputs: any;
    isBot?: boolean;
}

export default function MultiplayerResults() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentLobby } = useLobby();
    const [allBids, setAllBids] = useState<PlayerBid[]>([]);
    const [userBid, setUserBid] = useState<PlayerBid | null>(null);

    useEffect(() => {
        if (!user || !currentLobby) {
            navigate('/dashboard');
            return;
        }

        // Load all player bids
        const players = currentLobby.players.filter(p => p.role !== 'admin');
        const playerBids: PlayerBid[] = [];

        players.forEach(player => {
            if (player.bidData) {
                playerBids.push(player.bidData);
                if (player.id === user.id) {
                    setUserBid(player.bidData);
                }
            }
        });

        // Get bots from Supabase
        const bots = (currentLobby.simulationData?.bots || []).map((bot: any) => ({
            ...bot,
            isBot: true
        }));

        // Combine player bids and bots
        const combinedBids = [...playerBids, ...bots];

        // Separate qualified and disqualified
        const qualified = combinedBids.filter(bid => !bid.isDisqualified && bid.contributionMargin > 0);
        const disqualified = combinedBids.filter(bid => bid.isDisqualified || bid.contributionMargin <= 0);

        // Add CM reason to disqualified bids
        disqualified.forEach(bid => {
            if (bid.contributionMargin <= 0 && !bid.disqualificationReasons.includes('Contribution Margin must be positive')) {
                bid.isDisqualified = true;
                bid.disqualificationReasons.push('Contribution Margin must be positive');
            }
        });

        // Sort qualified by bid price (lower is better)
        qualified.sort((a, b) => a.bidPrice - b.bidPrice);

        // Assign ranks
        qualified.forEach((bid, index) => {
            bid.rank = index + 1;
        });

        disqualified.forEach(bid => {
            bid.rank = -1;
        });

        setAllBids([...qualified, ...disqualified]);
    }, [currentLobby, user, navigate]);

    const handleCompare = (bid: PlayerBid) => {
        if (!userBid) return;

        navigate('/leaderboard', {
            state: {
                userBid: {
                    name: userBid.username,
                    bidPrice: userBid.bidPrice,
                    contributionMargin: userBid.contributionMargin,
                    isDisqualified: userBid.isDisqualified,
                    disqualificationReasons: userBid.disqualificationReasons,
                    deliverables: userBid.inputs.deliverables,
                    estimationAccuracy: userBid.inputs.estimationAccuracy,
                    resourceAllocation: userBid.inputs.resourceAllocation,
                    workSchedule: userBid.inputs.workSchedule,
                    salaries: userBid.inputs.salaries,
                    overhead: userBid.inputs.overhead,
                    totalResourceCost: userBid.totalResourceCost,
                    totalCost: userBid.totalCost,
                    projectDuration: userBid.projectDuration
                },
                bots: [{
                    name: bid.username,
                    bidPrice: bid.bidPrice,
                    contributionMargin: bid.contributionMargin,
                    isDisqualified: bid.isDisqualified,
                    disqualificationReasons: bid.disqualificationReasons,
                    deliverables: bid.inputs.deliverables,
                    estimationAccuracy: bid.inputs.estimationAccuracy,
                    resourceAllocation: bid.inputs.resourceAllocation,
                    workSchedule: bid.inputs.workSchedule,
                    salaries: bid.inputs.salaries,
                    overhead: bid.inputs.overhead,
                    totalResourceCost: bid.totalResourceCost,
                    totalCost: bid.totalCost,
                    projectDuration: bid.projectDuration
                }],
                isMultiplayer: true
            }
        });
    };

    if (!currentLobby || !userBid) {
        return null;
    }

    const userEntry = allBids.find(bid => bid.userId === user?.id);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#e2e8f0', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <button onClick={() => navigate('/dashboard')} style={{ padding: '12px 24px', backgroundColor: '#1e293b', color: '#e2e8f0', border: '2px solid #475569', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
                        ← Back to Dashboard
                    </button>

                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', margin: '0 0 10px 0', color: '#f1f5f9' }}>
                        🏆 Multiplayer Results
                    </h1>

                    <div style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '20px' }}>
                        {userEntry?.isDisqualified
                            ? "Your bid was disqualified. See details below."
                            : `You ranked #${userEntry?.rank} out of ${allBids.filter(e => !e.isDisqualified).length} qualified bids!`
                        }
                    </div>
                </div>

                {/* Your Result Card */}
                <div style={{ backgroundColor: userEntry?.isDisqualified ? '#7f1d1d' : userEntry?.rank === 1 ? '#065f46' : '#1e293b', border: `3px solid ${userEntry?.isDisqualified ? '#dc2626' : userEntry?.rank === 1 ? '#10b981' : '#3b82f6'}`, borderRadius: '16px', padding: '30px', marginBottom: '40px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', color: userEntry?.isDisqualified ? '#fecaca' : '#f1f5f9' }}>
                                {userEntry?.isDisqualified ? '❌ Your Bid - DISQUALIFIED' : userEntry?.rank === 1 ? '🎉 Your Bid - WINNER!' : 'Your Bid'}
                            </h2>
                            <div style={{ fontSize: '18px', color: userEntry?.isDisqualified ? '#fecaca' : '#94a3b8' }}>
                                {userEntry?.isDisqualified ? 'Did not meet requirements' : `Rank #${userEntry?.rank}`}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', color: userEntry?.isDisqualified ? '#fecaca' : '#94a3b8', marginBottom: '5px' }}>Bid Price</div>
                            <div style={{ fontSize: '32px', fontWeight: '700', color: userEntry?.isDisqualified ? '#fecaca' : '#10b981' }}>
                                ${formatFullK(userBid.bidPrice)}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px' }}>
                        <div>
                            <div style={{ fontSize: '14px', color: userEntry?.isDisqualified ? '#fecaca' : '#94a3b8', marginBottom: '5px' }}>Contribution Margin</div>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: userEntry?.isDisqualified ? '#fecaca' : '#f1f5f9' }}>
                                ${formatFullK(Math.round(userBid.contributionMargin))}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: userEntry?.isDisqualified ? '#fecaca' : '#94a3b8', marginBottom: '5px' }}>Total Cost</div>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: userEntry?.isDisqualified ? '#fecaca' : '#f1f5f9' }}>
                                ${Math.round(userBid.totalCost).toLocaleString()}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: userEntry?.isDisqualified ? '#fecaca' : '#94a3b8', marginBottom: '5px' }}>Project Duration</div>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: userEntry?.isDisqualified ? '#fecaca' : '#f1f5f9' }}>
                                {userBid.projectDuration} months
                            </div>
                        </div>
                    </div>

                    {userEntry?.isDisqualified && (
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', border: '1px solid #dc2626' }}>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#fecaca', marginBottom: '10px' }}>Disqualification Reasons:</div>
                            <ul style={{ margin: '0', paddingLeft: '20px', color: '#fecaca' }}>
                                {userBid.disqualificationReasons.map((reason, idx) => (
                                    <li key={idx} style={{ marginBottom: '5px' }}>{reason}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Leaderboard Table */}
                <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)', border: '1px solid #334155' }}>
                    <div style={{ backgroundColor: '#0f172a', color: '#f1f5f9', padding: '20px 30px', fontWeight: '600', fontSize: '20px', borderBottom: '1px solid #334155' }}>
                        All Bids
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#0f172a' }}>
                                    <th style={{ padding: '16px 20px', textAlign: 'left', color: '#f1f5f9', fontWeight: '600', borderBottom: '2px solid #334155' }}>Rank</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'left', color: '#f1f5f9', fontWeight: '600', borderBottom: '2px solid #334155' }}>Bidder</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '2px solid #334155' }}>Bid Price</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'right', color: '#f1f5f9', fontWeight: '600', borderBottom: '2px solid #334155' }}>Contribution Margin</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'center', color: '#f1f5f9', fontWeight: '600', borderBottom: '2px solid #334155' }}>Duration</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'center', color: '#f1f5f9', fontWeight: '600', borderBottom: '2px solid #334155' }}>Status</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'center', color: '#f1f5f9', fontWeight: '600', borderBottom: '2px solid #334155' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allBids.map((entry, index) => {
                                    const isUser = entry.userId === user?.id;
                                    const isWinner = entry.rank === 1 && !entry.isDisqualified;

                                    return (
                                        <tr key={index} style={{ backgroundColor: isUser ? 'rgba(59, 130, 246, 0.1)' : index % 2 === 0 ? '#1e293b' : '#0f172a', borderLeft: isUser ? '4px solid #3b82f6' : 'none' }}>
                                            <td style={{ padding: '16px 20px', borderBottom: '1px solid #334155' }}>
                                                {entry.isDisqualified ? (
                                                    <span style={{ color: '#ef4444', fontWeight: '700' }}>DQ</span>
                                                ) : (
                                                    <span style={{ fontSize: '18px', fontWeight: '700', color: entry.rank === 1 ? '#fbbf24' : entry.rank === 2 ? '#94a3b8' : entry.rank === 3 ? '#d97706' : '#64748b' }}>
                                                        {entry.rank === 1 && '🥇'}
                                                        {entry.rank === 2 && '🥈'}
                                                        {entry.rank === 3 && '🥉'}
                                                        {entry.rank && entry.rank > 3 && `#${entry.rank}`}
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px 20px', borderBottom: '1px solid #334155', fontWeight: isUser ? '700' : '500', color: isUser ? '#60a5fa' : '#e2e8f0' }}>
                                                {entry.username} {entry.isBot && '🤖'}
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'right', borderBottom: '1px solid #334155', color: entry.bidPrice > 1000000 ? '#ef4444' : '#10b981', fontWeight: '600' }}>

                                                ${formatFullK(entry.bidPrice)}
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'right', borderBottom: '1px solid #334155', color: entry.contributionMargin > 0 ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                                                ${formatFullK(Math.round(entry.contributionMargin))}
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'center', borderBottom: '1px solid #334155', color: '#e2e8f0' }}>
                                                {entry.projectDuration} mo
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'center', borderBottom: '1px solid #334155' }}>
                                                {entry.isDisqualified ? (
                                                    <span style={{ padding: '6px 12px', backgroundColor: '#7f1d1d', color: '#fecaca', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>DISQUALIFIED</span>
                                                ) : isWinner ? (
                                                    <span style={{ padding: '6px 12px', backgroundColor: '#065f46', color: '#6ee7b7', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>WINNER</span>
                                                ) : (
                                                    <span style={{ padding: '6px 12px', backgroundColor: '#1e40af', color: '#93c5fd', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>QUALIFIED</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'center', borderBottom: '1px solid #334155' }}>
                                                {!isUser && !entry.isDisqualified && (userEntry?.isDisqualified || (entry.rank && userEntry?.rank && entry.rank < userEntry.rank)) && (
                                                    <button onClick={() => handleCompare(entry)} style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                                                        Compare
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Rules Info */}
                <div style={{ marginTop: '40px', padding: '20px 30px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#f1f5f9', fontSize: '18px' }}>📋 Qualification Rules</h3>
                    <ul style={{ margin: '0', paddingLeft: '20px', color: '#94a3b8', lineHeight: '1.8' }}>
                        <li>Bid price must not exceed $1,000,000 (client budget)</li>

                        <li>All deliverables must be completed within 5 months</li>
                        <li>Qualified bids must have a positive contribution margin</li>
                        <li>Qualified bids are ranked by lowest bid price</li>
                        <li>Disqualified bids are shown at the bottom regardless of their price or margin</li>
                        <li>🤖 Bot competitors are added to ensure competitive bidding (minimum 5 total bids)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
