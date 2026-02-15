import { useContract } from '../context/ContractContext';

export default function RiskContingencyForm() {
    const {
        riskInput,
        updateRiskRating,
        getTotalContingencyCost
    } = useContract();

    const modules = ["Requirements", "Design", "Coding", "Testing", "Deployment"];
    const riskOptions = ["Insignificant", "Minor", "Significant", "Major", "Catastrophic", "None"];

    // Risk impact table
    const riskImpactTable = {
        "Insignificant": { percentage: "0.25%", description: "Less than 1 week" },
        "Minor": { percentage: "0.5%", description: "Between 1 to 2 weeks" },
        "Significant": { percentage: "1%", description: "Between 2 to 3 weeks" },
        "Major": { percentage: "2%", description: "Between 3 to 5 weeks" },
        "Catastrophic": { percentage: "5%", description: "Above 5 weeks" },
        "None": { percentage: "0%", description: "Not Applicable" }
    };

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
                Risk
            </div>

            <div style={{
                backgroundColor: "#1e293b",
                padding: "40px",
                borderRadius: "0 0 12px 12px",
                color: "#e2e8f0",
                border: "1px solid #334155",
                borderTop: "none"
            }}>

                {/* Risk Impact Reference Table */}
                <div style={{ marginBottom: "32px" }}>
                    <div style={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                        border: "1px solid #334155"
                    }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={{
                                        backgroundColor: "#1e293b",
                                        color: "#f1f5f9",
                                        padding: "16px 20px",
                                        borderBottom: "2px solid #334155",
                                        fontWeight: "600",
                                        fontSize: "14px"
                                    }}>
                                        Risk
                                    </th>
                                    <th style={{
                                        backgroundColor: "#1e293b",
                                        padding: "16px 20px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        fontWeight: "600",
                                        color: "#f1f5f9",
                                        fontSize: "14px"
                                    }}>
                                        Contingency
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(riskImpactTable).map(([risk, info]) => (
                                    <tr key={risk}>
                                        <td style={{
                                            padding: "12px 20px",
                                            borderBottom: "1px solid #334155",
                                            backgroundColor: "#1e293b",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {risk}
                                        </td>
                                        <td style={{
                                            padding: "12px 20px",
                                            borderBottom: "1px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: "#0f172a",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {info.percentage} {info.description}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Calculate Contingency Cost - Layout: Input Table on Left, Result on Right */}
                <div
                    style={{
                        backgroundColor: "#0f172a",
                        color: "#f1f5f9",
                        padding: "16px 20px",
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: "16px",
                        marginBottom: "20px",
                        borderRadius: "12px",
                        border: "1px solid #334155"
                    }}
                >
                    Calculate Contingency Cost
                </div>

                <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>

                    {/* Left Side - Input Table */}
                    <div style={{ flex: 1 }}>
                        <div style={{
                            backgroundColor: "#0f172a",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                            border: "1px solid #334155"
                        }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        <th style={{
                                            backgroundColor: "#1e293b",
                                            padding: "16px 20px",
                                            borderBottom: "2px solid #334155",
                                            fontWeight: "600",
                                            color: "#f1f5f9",
                                            fontSize: "14px"
                                        }}>
                                            Risk Rating
                                        </th>
                                        <th style={{
                                            backgroundColor: "#1e293b",
                                            padding: "16px 20px",
                                            borderBottom: "2px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            fontSize: "14px",
                                            color: "#f1f5f9",
                                            fontWeight: "600"
                                        }}>
                                            Module
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modules.map((module) => {
                                        const selectedRisk = riskInput.riskRatings[module] || "None";

                                        return (
                                            <tr key={module}>
                                                <td style={{
                                                    backgroundColor: "#1e293b",
                                                    padding: "16px 20px",
                                                    borderBottom: "1px solid #334155",
                                                    textAlign: "center"
                                                }}>
                                                    <select
                                                        value={selectedRisk}
                                                        onChange={(e) => updateRiskRating(module, e.target.value)}
                                                        style={{
                                                            padding: "8px 16px",
                                                            border: "2px solid #475569",
                                                            borderRadius: "6px",
                                                            backgroundColor: "#0f172a",
                                                            color: "#f1f5f9",
                                                            fontSize: "14px",
                                                            fontWeight: "500",
                                                            outline: "none",
                                                            minWidth: "140px",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        {riskOptions.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td style={{
                                                    padding: "16px 20px",
                                                    borderBottom: "1px solid #334155",
                                                    borderLeft: "1px solid #334155",
                                                    backgroundColor: "#0f172a",
                                                    color: "#e2e8f0",
                                                    fontWeight: "500",
                                                    fontSize: "14px",
                                                    textAlign: "center"
                                                }}>
                                                    {module}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Side - Output Card */}
                    <div style={{ flex: "0 0 280px" }}>
                        <div style={{
                            backgroundColor: "#3b82f6",
                            borderRadius: "12px",
                            padding: "32px 24px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                            border: "1px solid #2563eb",
                            textAlign: "center"
                        }}>
                            <div style={{
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "rgba(255, 255, 255, 0.9)",
                                marginBottom: "16px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                            }}>
                                Total Contingency
                            </div>
                            <div style={{
                                fontSize: "40px",
                                fontWeight: "700",
                                color: "white"
                            }}>
                                {getTotalContingencyCost().toFixed(0)}
                            </div>
                        </div>
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