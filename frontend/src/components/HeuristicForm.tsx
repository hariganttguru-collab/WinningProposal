import { useContract } from '../context/ContractContext';

export default function HeuristicForm() {
    const {
        heuristicInput,
        updateHeuristicPct,
        getHeuristicCost,
        getTotalResourceCost
    } = useContract();

    const baseCost = getTotalResourceCost(); // Use only total resource cost

    return (
        <div style={{ marginTop: "30px" }}>
            {/* Header */}
            <div
                style={{
                    backgroundColor: "#0f172a",
                    color: "#f1f5f9",
                    padding: "20px 30px",
                    fontWeight: "600",
                    fontSize: "20px",
                    borderRadius: "12px 12px 0 0",
                    borderBottom: "1px solid #334155"
                }}
            >
                Heuristic / Risk Management
            </div>

            <div style={{
                backgroundColor: "#1e293b",
                padding: "40px",
                borderRadius: "0 0 12px 12px",
                color: "#e2e8f0",
                border: "1px solid #334155",
                borderTop: "none"
            }}>

                <div style={{ display: "flex", gap: "32px", alignItems: "stretch" }}>

                    {/* Left Side - Input */}
                    <div style={{ flex: "0 0 220px" }}>
                        <div style={{
                            backgroundColor: "#0f172a",
                            color: "#f1f5f9",
                            padding: "16px 20px",
                            fontWeight: "600",
                            textAlign: "center",
                            marginBottom: "0",
                            borderRadius: "8px 8px 0 0",
                            border: "1px solid #334155",
                            borderBottom: "none"
                        }}>
                            Heuristic
                        </div>
                        <div style={{
                            backgroundColor: "#0f172a",
                            padding: "30px 20px",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "80px",
                            borderRadius: "0 0 8px 8px",
                            border: "1px solid #334155"
                        }}>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={heuristicInput.heuristicPct}
                                onChange={(e) => updateHeuristicPct(parseInt(e.target.value) || 0)}
                                style={{
                                    padding: "8px 12px",
                                    border: "2px solid #475569",
                                    borderRadius: "6px",
                                    backgroundColor: "#1e293b",
                                    color: "#f1f5f9",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    textAlign: "center",
                                    width: "70px",
                                    outline: "none",
                                    transition: "border-color 0.2s ease"
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                                onBlur={(e) => e.target.style.borderColor = "#475569"}
                            />
                            <span style={{
                                marginLeft: "12px",
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#f1f5f9"
                            }}>
                                %
                            </span>
                        </div>
                    </div>

                    {/* Right Side - Output */}
                    <div style={{ flex: 1 }}>
                        <div style={{
                            backgroundColor: "#0f172a",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                            border: "1px solid #334155",
                            height: "100%"
                        }}>
                            <table style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                height: "100%"
                            }}>
                                <thead>
                                    <tr>
                                        <th style={{
                                            backgroundColor: "#1e293b",
                                            padding: "16px 20px",
                                            borderBottom: "2px solid #334155",
                                            fontSize: "14px",
                                            textAlign: "center",
                                            color: "#f1f5f9",
                                            fontWeight: "600"
                                        }}>
                                            Project Management<br />Cost - Heuristic
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{
                                            padding: "30px 20px",
                                            textAlign: "center",
                                            backgroundColor: "#0f172a",
                                            fontSize: "24px",
                                            fontWeight: "700",
                                            verticalAlign: "middle",
                                            color: "#f1f5f9"
                                        }}>
                                            {getHeuristicCost().toFixed(0)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Summary Information */}
                <div style={{
                    marginTop: "24px",
                    padding: "20px",
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "12px"
                }}>
                    <div style={{ fontSize: "14px", marginBottom: "8px", color: "#e2e8f0" }}>
                        <strong style={{ color: "#f1f5f9" }}>Base Cost (Total Resource Cost before subcontracting):</strong> {baseCost.toFixed(0)}
                    </div>
                    <div style={{ fontSize: "14px", marginBottom: "8px", color: "#e2e8f0" }}>
                        <strong style={{ color: "#f1f5f9" }}>Heuristic Percentage:</strong> {heuristicInput.heuristicPct}%
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#f1f5f9" }}>
                        <strong>Heuristic Cost:</strong> {getHeuristicCost().toFixed(0)}
                    </div>
                </div>

                {/* Table 6 Label */}
                <div style={{
                    textAlign: "right",
                    marginTop: "16px",
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "500"
                }}>
                    Table 6
                </div>
            </div>
        </div>
    );
}