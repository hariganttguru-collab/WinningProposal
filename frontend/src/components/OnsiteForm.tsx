import { useContract } from '../context/ContractContext';

export default function OnsiteForm() {
    const {
        onsiteInput,
        updateOnsiteRatio,
        updateOnsiteCoordinatorSalary,
        getOnsiteCoordinatorCost
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
                Onsite
            </div>

            <div style={{
                backgroundColor: "#1e293b",
                padding: "40px",
                borderRadius: "0 0 12px 12px",
                color: "#e2e8f0",
                border: "1px solid #334155",
                borderTop: "none"
            }}>

                {/* Input Cards Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "20px",
                    marginBottom: "32px"
                }}>
                    {/* Onsite-Offshore Support Ratio */}
                    <div style={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        padding: "24px",
                        border: "1px solid #334155",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                    }}>
                        <div style={{
                            fontSize: "14px",
                            color: "#94a3b8",
                            marginBottom: "12px",
                            fontWeight: "500",
                            textAlign: "center"
                        }}>
                            Onsite-Offshore Support Ratio
                        </div>
                        <div style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            marginBottom: "12px",
                            color: "#f1f5f9",
                            textAlign: "center"
                        }}>
                            1-{onsiteInput.onsiteOffshoreRatio}
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <input
                                type="number"
                                min="1"
                                value={onsiteInput.onsiteOffshoreRatio}
                                onChange={(e) => updateOnsiteRatio(parseInt(e.target.value) || 1)}
                                style={{
                                    padding: "10px 16px",
                                    border: "2px solid #475569",
                                    borderRadius: "8px",
                                    backgroundColor: "#1e293b",
                                    color: "#f1f5f9",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    textAlign: "center",
                                    width: "100px",
                                    outline: "none",
                                    transition: "border-color 0.2s ease"
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                                onBlur={(e) => e.target.style.borderColor = "#475569"}
                            />
                        </div>
                    </div>

                    {/* Onsite Coordinator Salary */}
                    <div style={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        padding: "24px",
                        border: "1px solid #334155",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                    }}>
                        <div style={{
                            fontSize: "14px",
                            color: "#94a3b8",
                            marginBottom: "12px",
                            fontWeight: "500",
                            textAlign: "center"
                        }}>
                            Onsite Coordinator Salary
                        </div>
                        <div style={{ textAlign: "center", paddingTop: "20px" }}>
                            <input
                                type="number"
                                min="0"
                                value={onsiteInput.onsiteCoordinatorSalary}
                                onChange={(e) => updateOnsiteCoordinatorSalary(parseInt(e.target.value) || 0)}
                                style={{
                                    padding: "10px 16px",
                                    border: "2px solid #475569",
                                    borderRadius: "8px",
                                    backgroundColor: "#1e293b",
                                    color: "#f1f5f9",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    textAlign: "center",
                                    width: "140px",
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
                        Onsite Coordinator Cost for 5 Months
                    </div>
                    <div style={{
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "white"
                    }}>
                        {getOnsiteCoordinatorCost().toFixed(0)}
                    </div>
                </div>

                {/* Table 7 Label */}
                <div style={{
                    textAlign: "right",
                    marginTop: "16px",
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "500"
                }}>
                    Table 7
                </div>
            </div>
        </div>
    );
}