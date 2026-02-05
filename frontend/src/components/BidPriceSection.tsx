import { useProjectData } from '../context/ProjectDataContext';

export default function BidPriceSection() {
    const { bidPrice, setBidPrice } = useProjectData();

    const isOverBudget = bidPrice > 500000;

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
                padding: "20px 30px",
                fontWeight: "600",
                fontSize: "20px",
                borderBottom: "1px solid #334155"
            }}>
                Bid Price
            </div>

            <div style={{
                padding: "40px",
                color: "#e2e8f0"
            }}>
                {/* Budget Warning */}
                {isOverBudget && (
                    <div style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        padding: "16px 20px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        border: "2px solid #dc2626",
                        marginBottom: "24px"
                    }}>
                        <span style={{ fontSize: "24px" }}>⚠️</span>
                        <div>
                            <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>
                                Budget Alert!
                            </div>
                            <div style={{ fontSize: "14px" }}>
                                Your bid price of ${bidPrice.toLocaleString()} exceeds the client's budget of $500,000. Consider reducing costs to stay competitive.
                            </div>
                        </div>
                    </div>
                )}

                <div style={{
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                    border: "1px solid #334155"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                            <tr>
                                <td style={{
                                    padding: "16px 20px",
                                    backgroundColor: "#1e293b",
                                    color: "#e2e8f0",
                                    fontWeight: "500",
                                    width: "50%"
                                }}>
                                    Bid Price
                                </td>
                                <td style={{
                                    padding: "16px 20px",
                                    borderLeft: "1px solid #334155",
                                    textAlign: "center",
                                    backgroundColor: isOverBudget ? "#ef4444" : "#4ade80",
                                    width: "50%"
                                }}>
                                    <input
                                        type="number"
                                        min="0"
                                        value={bidPrice}
                                        onChange={(e) => setBidPrice(parseInt(e.target.value) || 0)}
                                        style={{
                                            width: "200px",
                                            padding: "12px 16px",
                                            border: isOverBudget ? "3px solid #dc2626" : "2px solid #22c55e",
                                            borderRadius: "6px",
                                            textAlign: "center",
                                            fontSize: "18px",
                                            fontWeight: "700",
                                            backgroundColor: isOverBudget ? "#fee2e2" : "#dcfce7",
                                            color: "#0f172a",
                                            outline: "none",
                                            transition: "all 0.2s ease"
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = "#3b82f6";
                                        }}
                                        onBlur={(e) => {
                                            const value = parseInt(e.target.value) || 0;
                                            e.target.style.borderColor = value > 500000 ? "#dc2626" : "#22c55e";
                                        }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
