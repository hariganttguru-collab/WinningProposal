import { useProjectData } from '../context/ProjectDataContext';

export default function BidPriceSection() {
    const { bidPrice, setBidPrice, isEditing } = useProjectData();

    const isOverBudget = bidPrice > 1000000;


    const inputBtnStyle = {
        padding: '0',
        width: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isEditing ? (isOverBudget ? 'rgba(239, 68, 68, 0.9)' : 'rgba(34, 197, 94, 0.8)') : '#334155',
        color: isEditing ? (isOverBudget ? '#450a0a' : '#064e3b') : '#94a3b8',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'all 0.2s',
    };

    return (
        <div id="section-8" style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            border: "1px solid #334155",
            display: "flex",
            flexDirection: "column",
            width: "100%"
        }}>
            <div style={{
                backgroundColor: "#0f172a",
                color: "#f1f5f9",
                padding: "10px 15px",
                fontWeight: "600",
                fontSize: "14px",
                borderBottom: "1px solid #334155"
            }}>
                Bid Price
            </div>

            <div style={{
                padding: "15px",
                color: "#e2e8f0"
            }}>



                <div style={{
                    backgroundColor: "#0f172a",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                    border: "1px solid #334155"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                            <tr>
                                <td style={{
                                    padding: "8px 12px",
                                    backgroundColor: "#1e293b",
                                    color: "#e2e8f0",
                                    fontWeight: "500",
                                    fontSize: "12px",
                                    width: "50%"
                                }}>
                                    Bid Price
                                </td>
                                <td style={{
                                    padding: "8px 12px",
                                    borderLeft: "1px solid #334155",
                                    textAlign: "center",
                                    backgroundColor: isEditing ? (isOverBudget ? "#ef4444" : "#4ade80") : "#0f172a",
                                    width: "50%"
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        {isEditing && (
                                            <button
                                                onClick={() => setBidPrice(Math.max(0, bidPrice - 10000))}
                                                style={inputBtnStyle}
                                                onMouseOver={(e) => {
                                                    if (isEditing && !isOverBudget) e.currentTarget.style.backgroundColor = 'rgba(21, 128, 61, 0.8)';
                                                }}
                                                onMouseOut={(e) => {
                                                    if (isEditing && !isOverBudget) e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.8)';
                                                }}
                                            >-</button>
                                        )}
                                        <div style={{
                                            width: "120px",
                                            padding: "6px 10px",
                                            border: isEditing ? (isOverBudget ? "2px solid #dc2626" : "1px solid #22c55e") : "1px solid #475569",
                                            borderRadius: "4px",
                                            textAlign: "center",
                                            fontSize: "14px",
                                            fontWeight: "700",
                                            backgroundColor: isEditing ? (isOverBudget ? "#fee2e2" : "#dcfce7") : "#0f172a",
                                            color: isEditing ? "#0f172a" : "#f1f5f9",
                                            transition: "all 0.2s ease",
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {bidPrice >= 1000 ? `${(bidPrice / 1000).toFixed(0)}k` : bidPrice}
                                        </div>
                                        {isEditing && (
                                            <button
                                                onClick={() => setBidPrice(bidPrice + 10000)}
                                                style={inputBtnStyle}
                                                onMouseOver={(e) => {
                                                    if (isEditing && !isOverBudget) e.currentTarget.style.backgroundColor = 'rgba(21, 128, 61, 0.8)';
                                                }}
                                                onMouseOut={(e) => {
                                                    if (isEditing && !isOverBudget) e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.8)';
                                                }}
                                            >+</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
