import { useContract } from '../context/ContractContext';

export default function ResourceCostForm() {
    const {
        resourceCostInput,
        updatePermanentRatio,
        updatePermanentSalary,
        updateTemporarySalary,
        getTotalResourceCost
    } = useContract();

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
                Calculate Resource Cost
            </div>

            <div style={{
                backgroundColor: "#1e293b",
                padding: "40px",
                borderRadius: "0 0 12px 12px",
                color: "#e2e8f0",
                border: "1px solid #334155",
                borderTop: "none"
            }}>

                {/* Input Section */}
                <div style={{ display: "flex", gap: "32px", marginBottom: "32px" }}>

                    {/* Permanent vs Temporary Ratio */}
                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                backgroundColor: "#0f172a",
                                color: "#f1f5f9",
                                padding: "16px 20px",
                                fontWeight: "600",
                                textAlign: "center",
                                marginBottom: "16px",
                                borderRadius: "8px",
                                border: "1px solid #334155"
                            }}
                        >
                            Permanent Vs Temporary Level
                        </div>
                        <div style={{
                            backgroundColor: "#0f172a",
                            padding: "20px",
                            textAlign: "center",
                            borderRadius: "8px",
                            border: "1px solid #334155"
                        }}>
                            <div style={{
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#f1f5f9",
                                marginBottom: "12px"
                            }}>
                                {resourceCostInput.permanentVsTempRatio}-{100 - resourceCostInput.permanentVsTempRatio}
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={resourceCostInput.permanentVsTempRatio}
                                onChange={(e) => updatePermanentRatio(parseInt(e.target.value))}
                                style={{
                                    width: "200px",
                                    marginBottom: "12px",
                                    accentColor: "#3b82f6"
                                }}
                            />
                            <div style={{
                                fontSize: "12px",
                                color: "#94a3b8"
                            }}>
                                {resourceCostInput.permanentVsTempRatio}% Permanent, {100 - resourceCostInput.permanentVsTempRatio}% Temporary
                            </div>
                        </div>
                    </div>

                    {/* Salary Inputs */}
                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                backgroundColor: "#0f172a",
                                color: "#f1f5f9",
                                padding: "16px 20px",
                                fontWeight: "600",
                                textAlign: "center",
                                marginBottom: "16px",
                                borderRadius: "8px",
                                border: "1px solid #334155"
                            }}
                        >
                            Permanent Monthly Sal USD
                        </div>
                        <div style={{
                            backgroundColor: "#0f172a",
                            padding: "20px",
                            textAlign: "center",
                            borderRadius: "8px",
                            border: "1px solid #334155",
                            marginBottom: "20px"
                        }}>
                            <input
                                type="number"
                                min="0"
                                step="50"
                                value={resourceCostInput.permanentMonthlySalary}
                                onChange={(e) => updatePermanentSalary(parseInt(e.target.value) || 0)}
                                style={{
                                    width: "120px",
                                    padding: "8px 12px",
                                    textAlign: "center",
                                    border: "2px solid #475569",
                                    borderRadius: "6px",
                                    fontSize: "16px",
                                    backgroundColor: "#1e293b",
                                    color: "#f1f5f9",
                                    fontWeight: "500",
                                    outline: "none",
                                    transition: "border-color 0.2s ease"
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                                onBlur={(e) => e.target.style.borderColor = "#475569"}
                            />
                        </div>

                        <div
                            style={{
                                backgroundColor: "#0f172a",
                                color: "#f1f5f9",
                                padding: "16px 20px",
                                fontWeight: "600",
                                textAlign: "center",
                                marginBottom: "16px",
                                borderRadius: "8px",
                                border: "1px solid #334155"
                            }}
                        >
                            Temporary Monthly Sal USD
                        </div>
                        <div style={{
                            backgroundColor: "#0f172a",
                            padding: "20px",
                            textAlign: "center",
                            borderRadius: "8px",
                            border: "1px solid #334155"
                        }}>
                            <input
                                type="number"
                                min="0"
                                step="50"
                                value={resourceCostInput.temporaryMonthlySalary}
                                onChange={(e) => updateTemporarySalary(parseInt(e.target.value) || 0)}
                                style={{
                                    width: "120px",
                                    padding: "8px 12px",
                                    textAlign: "center",
                                    border: "2px solid #475569",
                                    borderRadius: "6px",
                                    fontSize: "16px",
                                    backgroundColor: "#1e293b",
                                    color: "#f1f5f9",
                                    fontWeight: "500",
                                    outline: "none",
                                    transition: "border-color 0.2s ease"
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                                onBlur={(e) => e.target.style.borderColor = "#475569"}
                            />
                        </div>
                    </div>
                </div>

                {/* Final Result Card */}
                <div style={{
                    backgroundColor: "#3b82f6",
                    borderRadius: "12px",
                    padding: "24px 32px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                    border: "1px solid #2563eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div style={{
                        fontWeight: "600",
                        fontSize: "18px",
                        color: "white"
                    }}>
                        Total Resource Cost<br />before subcontracting
                    </div>
                    <div style={{
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "white"
                    }}>
                        {getTotalResourceCost().toFixed(0)}
                    </div>
                </div>

                {/* Table 4 Label */}
                <div style={{
                    textAlign: "right",
                    marginTop: "16px",
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "500"
                }}>
                    Table 4
                </div>
            </div>
        </div>
    );
}