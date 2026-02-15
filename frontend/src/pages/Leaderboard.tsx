import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { BotBid } from "../utils/botGenerator";
import { formatFullK } from "../utils/formatters";

interface LeaderboardEntry extends BotBid {
    rank: number;
}

export default function Leaderboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [userBid, setUserBid] = useState<BotBid | null>(null);
    const [selectedBid, setSelectedBid] = useState<BotBid | null>(null);
    const [showComparison, setShowComparison] = useState(false);

    useEffect(() => {
        if (location.state?.userBid && location.state?.bots) {
            const allBids = [location.state.userBid, ...location.state.bots];

            // Separate qualified and disqualified bids
            const qualified = allBids.filter(bid => !bid.isDisqualified && bid.contributionMargin > 0);
            const disqualified = allBids.filter(bid => bid.isDisqualified || bid.contributionMargin <= 0);

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
            const rankedQualified = qualified.map((bid, index) => ({
                ...bid,
                rank: index + 1
            }));

            const rankedDisqualified = disqualified.map(bid => ({
                ...bid,
                rank: -1 // Disqualified
            }));

            const finalLeaderboard = [...rankedQualified, ...rankedDisqualified];
            setLeaderboard(finalLeaderboard);
            setUserBid(location.state.userBid);
        } else {
            navigate("/");
        }
    }, [location.state, navigate]);

    if (!userBid) {
        return <div>Loading...</div>;
    }

    const userEntry = leaderboard.find(entry => entry.name === "You");

    const handleCompare = (bid: BotBid) => {
        setSelectedBid(bid);
        setShowComparison(true);
    };

    const closeComparison = () => {
        setShowComparison(false);
        setSelectedBid(null);
    };


    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#0f172a",
            color: "#e2e8f0",
            padding: "40px 20px"
        }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: "40px" }}>
                    <button
                        onClick={() => navigate('/contract')}
                        style={{
                            padding: "12px 24px",
                            backgroundColor: "#1e293b",
                            color: "#e2e8f0",
                            border: "2px solid #475569",
                            borderRadius: "8px",
                            cursor: "pointer",
                            marginBottom: "20px",
                            fontSize: "14px",
                            fontWeight: "500",
                            transition: "all 0.2s ease"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#334155";
                            e.currentTarget.style.borderColor = "#64748b";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "#1e293b";
                            e.currentTarget.style.borderColor = "#475569";
                        }}
                    >
                        ← Back to Contract
                    </button>

                    <h1 style={{
                        fontSize: "2.5rem",
                        fontWeight: "700",
                        margin: "0 0 10px 0",
                        color: "#f1f5f9"
                    }}>
                        🏆 Leaderboard
                    </h1>

                    <div style={{
                        fontSize: "1.2rem",
                        color: "#94a3b8",
                        marginBottom: "20px"
                    }}>
                        {userEntry?.isDisqualified
                            ? "Your bid was disqualified. See details below."
                            : `You ranked #${userEntry?.rank} out of ${leaderboard.filter(e => !e.isDisqualified).length} qualified bids!`
                        }
                    </div>
                </div>

                {/* Your Result Card */}
                <div style={{
                    backgroundColor: userEntry?.isDisqualified ? "#7f1d1d" : userEntry?.rank === 1 ? "#065f46" : "#1e293b",
                    border: `3px solid ${userEntry?.isDisqualified ? "#dc2626" : userEntry?.rank === 1 ? "#10b981" : "#3b82f6"}`,
                    borderRadius: "16px",
                    padding: "30px",
                    marginBottom: "40px",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <div>
                            <h2 style={{
                                margin: "0 0 10px 0",
                                fontSize: "28px",
                                color: userEntry?.isDisqualified ? "#fecaca" : "#f1f5f9"
                            }}>
                                {userEntry?.isDisqualified ? "❌ Your Bid - DISQUALIFIED" : userEntry?.rank === 1 ? "🎉 Your Bid - WINNER!" : "Your Bid"}
                            </h2>
                            <div style={{ fontSize: "18px", color: userEntry?.isDisqualified ? "#fecaca" : "#94a3b8" }}>
                                {userEntry?.isDisqualified ? "Did not meet requirements" : `Rank #${userEntry?.rank}`}
                            </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "14px", color: userEntry?.isDisqualified ? "#fecaca" : "#94a3b8", marginBottom: "5px" }}>
                                Bid Price
                            </div>
                            <div style={{ fontSize: "32px", fontWeight: "700", color: userEntry?.isDisqualified ? "#fecaca" : "#10b981" }}>
                                ${formatFullK(userBid.bidPrice)}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px",
                        padding: "20px",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        borderRadius: "12px"
                    }}>
                        <div>
                            <div style={{ fontSize: "14px", color: userEntry?.isDisqualified ? "#fecaca" : "#94a3b8", marginBottom: "5px" }}>
                                Contribution Margin
                            </div>
                            <div style={{ fontSize: "24px", fontWeight: "700", color: userEntry?.isDisqualified ? "#fecaca" : "#f1f5f9" }}>
                                ${formatFullK(Math.round(userBid.contributionMargin))}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: "14px", color: userEntry?.isDisqualified ? "#fecaca" : "#94a3b8", marginBottom: "5px" }}>
                                Total Cost
                            </div>
                            <div style={{ fontSize: "24px", fontWeight: "700", color: userEntry?.isDisqualified ? "#fecaca" : "#f1f5f9" }}>
                                ${Math.round(userBid.totalCost).toLocaleString()}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: "14px", color: userEntry?.isDisqualified ? "#fecaca" : "#94a3b8", marginBottom: "5px" }}>
                                Project Duration
                            </div>
                            <div style={{ fontSize: "24px", fontWeight: "700", color: userEntry?.isDisqualified ? "#fecaca" : "#f1f5f9" }}>
                                {userBid.projectDuration} months
                            </div>
                        </div>
                    </div>

                    {userEntry?.isDisqualified && (
                        <div style={{
                            marginTop: "20px",
                            padding: "15px",
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                            borderRadius: "8px",
                            border: "1px solid #dc2626"
                        }}>
                            <div style={{ fontSize: "16px", fontWeight: "600", color: "#fecaca", marginBottom: "10px" }}>
                                Disqualification Reasons:
                            </div>
                            <ul style={{ margin: "0", paddingLeft: "20px", color: "#fecaca" }}>
                                {userBid.disqualificationReasons.map((reason, idx) => (
                                    <li key={idx} style={{ marginBottom: "5px" }}>{reason}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Leaderboard Table */}
                <div style={{
                    backgroundColor: "#1e293b",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                    border: "1px solid #334155"
                }}>
                    <div style={{
                        backgroundColor: "#0f172a",
                        color: "#f1f5f9",
                        padding: "20px 30px",
                        fontWeight: "600",
                        fontSize: "20px",
                        borderBottom: "1px solid #334155"
                    }}>
                        All Bids
                    </div>

                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#0f172a" }}>
                                    <th style={{ padding: "16px 20px", textAlign: "left", color: "#f1f5f9", fontWeight: "600", borderBottom: "2px solid #334155" }}>
                                        Rank
                                    </th>
                                    <th style={{ padding: "16px 20px", textAlign: "left", color: "#f1f5f9", fontWeight: "600", borderBottom: "2px solid #334155" }}>
                                        Bidder
                                    </th>
                                    <th style={{ padding: "16px 20px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "2px solid #334155" }}>
                                        Bid Price
                                    </th>
                                    <th style={{ padding: "16px 20px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "2px solid #334155" }}>
                                        Contribution Margin
                                    </th>
                                    <th style={{ padding: "16px 20px", textAlign: "center", color: "#f1f5f9", fontWeight: "600", borderBottom: "2px solid #334155" }}>
                                        Duration
                                    </th>
                                    <th style={{ padding: "16px 20px", textAlign: "center", color: "#f1f5f9", fontWeight: "600", borderBottom: "2px solid #334155" }}>
                                        Status
                                    </th>
                                    <th style={{ padding: "16px 20px", textAlign: "center", color: "#f1f5f9", fontWeight: "600", borderBottom: "2px solid #334155" }}>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((entry, index) => {
                                    const isUser = entry.name === "You";
                                    const isWinner = entry.rank === 1 && !entry.isDisqualified;

                                    return (
                                        <tr
                                            key={index}
                                            style={{
                                                backgroundColor: isUser ? "rgba(59, 130, 246, 0.1)" : index % 2 === 0 ? "#1e293b" : "#0f172a",
                                                borderLeft: isUser ? "4px solid #3b82f6" : "none"
                                            }}
                                        >
                                            <td style={{ padding: "16px 20px", borderBottom: "1px solid #334155" }}>
                                                {entry.isDisqualified ? (
                                                    <span style={{ color: "#ef4444", fontWeight: "700" }}>DQ</span>
                                                ) : (
                                                    <span style={{
                                                        fontSize: "18px",
                                                        fontWeight: "700",
                                                        color: entry.rank === 1 ? "#fbbf24" : entry.rank === 2 ? "#94a3b8" : entry.rank === 3 ? "#d97706" : "#64748b"
                                                    }}>
                                                        {entry.rank === 1 && "🥇"}
                                                        {entry.rank === 2 && "🥈"}
                                                        {entry.rank === 3 && "🥉"}
                                                        {entry.rank > 3 && `#${entry.rank}`}
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{
                                                padding: "16px 20px",
                                                borderBottom: "1px solid #334155",
                                                fontWeight: isUser ? "700" : "500",
                                                color: isUser ? "#60a5fa" : "#e2e8f0"
                                            }}>
                                                {entry.name}
                                            </td>
                                            <td style={{
                                                padding: "16px 20px",
                                                textAlign: "right",
                                                borderBottom: "1px solid #334155",
                                                color: entry.bidPrice > 1000000 ? "#ef4444" : "#10b981",

                                                fontWeight: "600"
                                            }}>
                                                ${formatFullK(entry.bidPrice)}
                                            </td>
                                            <td style={{
                                                padding: "16px 20px",
                                                textAlign: "right",
                                                borderBottom: "1px solid #334155",
                                                color: entry.contributionMargin > 0 ? "#10b981" : "#ef4444",
                                                fontWeight: "600"
                                            }}>
                                                ${formatFullK(Math.round(entry.contributionMargin))}
                                            </td>
                                            <td style={{
                                                padding: "16px 20px",
                                                textAlign: "center",
                                                borderBottom: "1px solid #334155",
                                                color: "#e2e8f0"
                                            }}>
                                                {entry.projectDuration} mo
                                            </td>
                                            <td style={{
                                                padding: "16px 20px",
                                                textAlign: "center",
                                                borderBottom: "1px solid #334155"
                                            }}>
                                                {entry.isDisqualified ? (
                                                    <span style={{
                                                        padding: "6px 12px",
                                                        backgroundColor: "#7f1d1d",
                                                        color: "#fecaca",
                                                        borderRadius: "6px",
                                                        fontSize: "12px",
                                                        fontWeight: "700"
                                                    }}>
                                                        DISQUALIFIED
                                                    </span>
                                                ) : isWinner ? (
                                                    <span style={{
                                                        padding: "6px 12px",
                                                        backgroundColor: "#065f46",
                                                        color: "#6ee7b7",
                                                        borderRadius: "6px",
                                                        fontSize: "12px",
                                                        fontWeight: "700"
                                                    }}>
                                                        WINNER
                                                    </span>
                                                ) : (
                                                    <span style={{
                                                        padding: "6px 12px",
                                                        backgroundColor: "#1e40af",
                                                        color: "#93c5fd",
                                                        borderRadius: "6px",
                                                        fontSize: "12px",
                                                        fontWeight: "700"
                                                    }}>
                                                        QUALIFIED
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{
                                                padding: "16px 20px",
                                                textAlign: "center",
                                                borderBottom: "1px solid #334155"
                                            }}>
                                                {!isUser && !entry.isDisqualified && (userEntry?.isDisqualified || entry.rank < (userEntry?.rank || 999)) && (
                                                    <button
                                                        onClick={() => handleCompare(entry)}
                                                        style={{
                                                            padding: "8px 16px",
                                                            backgroundColor: "#3b82f6",
                                                            color: "white",
                                                            border: "none",
                                                            borderRadius: "6px",
                                                            cursor: "pointer",
                                                            fontSize: "12px",
                                                            fontWeight: "600",
                                                            transition: "all 0.2s ease"
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.currentTarget.style.backgroundColor = "#2563eb";
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.currentTarget.style.backgroundColor = "#3b82f6";
                                                        }}
                                                    >
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
                <div style={{
                    marginTop: "40px",
                    padding: "20px 30px",
                    backgroundColor: "#1e293b",
                    borderRadius: "12px",
                    border: "1px solid #334155"
                }}>
                    <h3 style={{ margin: "0 0 15px 0", color: "#f1f5f9", fontSize: "18px" }}>
                        📋 Qualification Rules
                    </h3>
                    <ul style={{ margin: "0", paddingLeft: "20px", color: "#94a3b8", lineHeight: "1.8" }}>
                        <li>Bid price must not exceed $1,000,000 (client budget)</li>

                        <li>All deliverables must be completed within 5 months</li>
                        <li>Qualified bids must have a positive contribution margin</li>
                        <li>Qualified bids are ranked by lowest bid price</li>
                        <li>Disqualified bids are shown at the bottom regardless of their price or margin</li>
                    </ul>
                </div>
            </div>

            {/* Comparison Modal */}
            {showComparison && selectedBid && userBid && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    padding: "20px",
                    overflow: "auto"
                }}>
                    <div style={{
                        backgroundColor: "#1e293b",
                        borderRadius: "16px",
                        maxWidth: "1200px",
                        width: "100%",
                        maxHeight: "90vh",
                        overflow: "auto",
                        border: "2px solid #334155"
                    }}>
                        {/* Header */}
                        <div style={{
                            backgroundColor: "#0f172a",
                            padding: "24px 32px",
                            borderBottom: "2px solid #334155",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            position: "sticky",
                            top: 0,
                            zIndex: 1
                        }}>
                            <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: "24px" }}>
                                📊 Bid Comparison
                            </h2>
                            <button
                                onClick={closeComparison}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#ef4444",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: "600"
                                }}
                            >
                                Close
                            </button>
                        </div>

                        {/* Comparison Content */}
                        <div style={{ padding: "32px" }}>
                            {/* Summary Cards */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "24px",
                                marginBottom: "32px"
                            }}>
                                {/* Your Bid */}
                                <div style={{
                                    backgroundColor: "#0f172a",
                                    padding: "24px",
                                    borderRadius: "12px",
                                    border: "2px solid #3b82f6"
                                }}>
                                    <h3 style={{ margin: "0 0 16px 0", color: "#60a5fa", fontSize: "20px" }}>
                                        Your Bid
                                    </h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        <div>
                                            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Bid Price</div>
                                            <div style={{ fontSize: "24px", fontWeight: "700", color: "#10b981" }}>
                                                ${userBid.bidPrice.toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Contribution Margin</div>
                                            <div style={{ fontSize: "24px", fontWeight: "700", color: "#f1f5f9" }}>
                                                ${Math.round(userBid.contributionMargin).toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Project Duration</div>
                                            <div style={{ fontSize: "20px", fontWeight: "600", color: "#f1f5f9" }}>
                                                {userBid.projectDuration} months
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Selected Bid */}
                                <div style={{
                                    backgroundColor: "#0f172a",
                                    padding: "24px",
                                    borderRadius: "12px",
                                    border: "2px solid #10b981"
                                }}>
                                    <h3 style={{ margin: "0 0 16px 0", color: "#10b981", fontSize: "20px" }}>
                                        {selectedBid.name}
                                    </h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        <div>
                                            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Bid Price</div>
                                            <div style={{ fontSize: "24px", fontWeight: "700", color: "#10b981" }}>
                                                ${selectedBid.bidPrice.toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Contribution Margin</div>
                                            <div style={{ fontSize: "24px", fontWeight: "700", color: "#f1f5f9" }}>
                                                ${Math.round(selectedBid.contributionMargin).toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Project Duration</div>
                                            <div style={{ fontSize: "20px", fontWeight: "600", color: "#f1f5f9" }}>
                                                {selectedBid.projectDuration} months
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Comparison Tables */}

                            {/* Deliverables */}
                            <div style={{
                                backgroundColor: "#0f172a",
                                borderRadius: "12px",
                                overflow: "hidden",
                                marginBottom: "24px"
                            }}>
                                <div style={{
                                    padding: "16px 24px",
                                    backgroundColor: "#1e293b",
                                    borderBottom: "1px solid #334155"
                                }}>
                                    <h4 style={{ margin: 0, color: "#f1f5f9", fontSize: "18px" }}>
                                        📦 Deliverables (Quantity × Effort)
                                    </h4>
                                </div>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#1e293b" }}>
                                            <th style={{ padding: "12px 24px", textAlign: "left", color: "#94a3b8", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                Deliverable
                                            </th>
                                            <th style={{ padding: "12px 24px", textAlign: "right", color: "#60a5fa", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                Your Bid
                                            </th>
                                            <th style={{ padding: "12px 24px", textAlign: "right", color: "#10b981", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.name}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>Complex Screen</td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {userBid.deliverables.complexScreen.quantity} × {userBid.deliverables.complexScreen.effortPerUnit}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.deliverables.complexScreen.quantity} × {selectedBid.deliverables.complexScreen.effortPerUnit}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>Simple Screen</td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {userBid.deliverables.simpleScreen.quantity} × {userBid.deliverables.simpleScreen.effortPerUnit}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.deliverables.simpleScreen.quantity} × {selectedBid.deliverables.simpleScreen.effortPerUnit}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>Complex Database</td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {userBid.deliverables.complexDatabase.quantity} × {userBid.deliverables.complexDatabase.effortPerUnit}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.deliverables.complexDatabase.quantity} × {selectedBid.deliverables.complexDatabase.effortPerUnit}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>Simple Database</td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {userBid.deliverables.simpleDatabase.quantity} × {userBid.deliverables.simpleDatabase.effortPerUnit}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.deliverables.simpleDatabase.quantity} × {selectedBid.deliverables.simpleDatabase.effortPerUnit}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Resource Allocation */}
                            <div style={{
                                backgroundColor: "#0f172a",
                                borderRadius: "12px",
                                overflow: "hidden",
                                marginBottom: "24px"
                            }}>
                                <div style={{
                                    padding: "16px 24px",
                                    backgroundColor: "#1e293b",
                                    borderBottom: "1px solid #334155"
                                }}>
                                    <h4 style={{ margin: 0, color: "#f1f5f9", fontSize: "18px" }}>
                                        👥 Resource Allocation (Senior / Junior)
                                    </h4>
                                </div>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#1e293b" }}>
                                            <th style={{ padding: "12px 24px", textAlign: "left", color: "#94a3b8", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                Deliverable
                                            </th>
                                            <th style={{ padding: "12px 24px", textAlign: "right", color: "#60a5fa", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                Your Bid
                                            </th>
                                            <th style={{ padding: "12px 24px", textAlign: "right", color: "#10b981", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.name}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>Complex Screen</td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {userBid.resourceAllocation.complexScreen.uiSenior} / {userBid.resourceAllocation.complexScreen.uiJunior}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.resourceAllocation.complexScreen.uiSenior} / {selectedBid.resourceAllocation.complexScreen.uiJunior}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>Simple Screen</td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {userBid.resourceAllocation.simpleScreen.uiSenior} / {userBid.resourceAllocation.simpleScreen.uiJunior}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.resourceAllocation.simpleScreen.uiSenior} / {selectedBid.resourceAllocation.simpleScreen.uiJunior}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>Complex Database</td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {userBid.resourceAllocation.complexDatabase.backendSenior} / {userBid.resourceAllocation.complexDatabase.backendJunior}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.resourceAllocation.complexDatabase.backendSenior} / {selectedBid.resourceAllocation.complexDatabase.backendJunior}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>Simple Database</td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {userBid.resourceAllocation.simpleDatabase.backendSenior} / {userBid.resourceAllocation.simpleDatabase.backendJunior}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.resourceAllocation.simpleDatabase.backendSenior} / {selectedBid.resourceAllocation.simpleDatabase.backendJunior}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Work Schedule & Salaries */}
                            <div style={{
                                backgroundColor: "#0f172a",
                                borderRadius: "12px",
                                overflow: "hidden",
                                marginBottom: "24px"
                            }}>
                                <div style={{
                                    padding: "16px 24px",
                                    backgroundColor: "#1e293b",
                                    borderBottom: "1px solid #334155"
                                }}>
                                    <h4 style={{ margin: 0, color: "#f1f5f9", fontSize: "18px" }}>
                                        ⏰ Work Schedule & 💵 Salaries
                                    </h4>
                                </div>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#1e293b" }}>
                                            <th style={{ padding: "12px 24px", textAlign: "left", color: "#94a3b8", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                Metric
                                            </th>
                                            <th style={{ padding: "12px 24px", textAlign: "right", color: "#60a5fa", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                Your Bid
                                            </th>
                                            <th style={{ padding: "12px 24px", textAlign: "right", color: "#10b981", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.name}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>Working Days/Month</td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {userBid.workSchedule.workingDaysPerMonth}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.workSchedule.workingDaysPerMonth}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>Working Hours/Day</td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {userBid.workSchedule.workingHoursPerDay}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.workSchedule.workingHoursPerDay}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>UI Junior Salary</td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                ${userBid.salaries.uiJunior}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                ${selectedBid.salaries.uiJunior}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>UI Senior Salary</td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                ${userBid.salaries.uiSenior}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                ${selectedBid.salaries.uiSenior}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>Backend Junior Salary</td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                ${userBid.salaries.backendJunior}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                ${selectedBid.salaries.backendJunior}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>Backend Senior Salary</td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                ${userBid.salaries.backendSenior}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                ${selectedBid.salaries.backendSenior}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Financial Summary */}
                            <div style={{
                                backgroundColor: "#0f172a",
                                borderRadius: "12px",
                                overflow: "hidden"
                            }}>
                                <div style={{
                                    padding: "16px 24px",
                                    backgroundColor: "#1e293b",
                                    borderBottom: "1px solid #334155"
                                }}>
                                    <h4 style={{ margin: 0, color: "#f1f5f9", fontSize: "18px" }}>
                                        💰 Financial Summary
                                    </h4>
                                </div>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#1e293b" }}>
                                            <th style={{ padding: "12px 24px", textAlign: "left", color: "#94a3b8", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                Metric
                                            </th>
                                            <th style={{ padding: "12px 24px", textAlign: "right", color: "#60a5fa", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                Your Bid
                                            </th>
                                            <th style={{ padding: "12px 24px", textAlign: "right", color: "#10b981", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.name}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>
                                                Estimation Accuracy
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {userBid.estimationAccuracy}%
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.estimationAccuracy}%
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>
                                                Total Resource Cost
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                ${Math.round(userBid.totalResourceCost).toLocaleString()}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                ${Math.round(selectedBid.totalResourceCost).toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>
                                                Contingency
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {userBid.overhead.contingencyPercent}%
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.overhead.contingencyPercent}%
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>
                                                Overhead
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {userBid.overhead.overheadPercent}%
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.overhead.overheadPercent}%
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>
                                                Quality (Rework)
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {userBid.overhead.qualityPercent}%
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                {selectedBid.overhead.qualityPercent}%
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "12px 24px", color: "#e2e8f0", borderBottom: "1px solid #334155" }}>
                                                Total Cost
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                ${Math.round(userBid.totalCost).toLocaleString()}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: "#f1f5f9", fontWeight: "600", borderBottom: "1px solid #334155" }}>
                                                ${Math.round(selectedBid.totalCost).toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr style={{ backgroundColor: "#1e293b" }}>
                                            <td style={{ padding: "12px 24px", color: "#f1f5f9", fontWeight: "700" }}>
                                                Final Contribution Margin
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: userBid.contributionMargin > selectedBid.contributionMargin ? "#10b981" : "#ef4444", fontWeight: "700", fontSize: "18px" }}>
                                                ${Math.round(userBid.contributionMargin).toLocaleString()}
                                            </td>
                                            <td style={{ padding: "12px 24px", textAlign: "right", color: selectedBid.contributionMargin > userBid.contributionMargin ? "#10b981" : "#ef4444", fontWeight: "700", fontSize: "18px" }}>
                                                ${Math.round(selectedBid.contributionMargin).toLocaleString()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
