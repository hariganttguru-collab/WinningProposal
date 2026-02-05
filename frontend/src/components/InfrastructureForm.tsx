import { useContract } from '../context/ContractContext';

export default function InfrastructureForm() {
    const {
        infrastructureInput,
        updateInfrastructureCostPerResource,
        getTotalInternalResourcesAfterSubcontracting,
        getTotalInfrastructureCost
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
                Infrastructure Cost
            </div>

            <div style={{
                backgroundColor: "#1e293b",
                padding: "40px",
                borderRadius: "0 0 12px 12px",
                color: "#e2e8f0",
                border: "1px solid #334155",
                borderTop: "none"
            }}>

                {/* Infrastructure Cost Table */}
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
                                    Infrastructure Cost
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
                                    Total Infrastructure Cost
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    textAlign: "center"
                                }}>
                                    <input
                                        type="number"
                                        value={infrastructureInput.costPerResource}
                                        onChange={(e) => updateInfrastructureCostPerResource(Number(e.target.value))}
                                        style={{
                                            padding: "8px 12px",
                                            border: "2px solid #475569",
                                            borderRadius: "6px",
                                            backgroundColor: "#0f172a",
                                            color: "#f1f5f9",
                                            width: "120px",
                                            textAlign: "center",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            outline: "none",
                                            transition: "border-color 0.2s ease"
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                                        onBlur={(e) => e.target.style.borderColor = "#475569"}
                                    />
                                </td>
                                <td style={{
                                    padding: "16px 20px",
                                    borderLeft: "1px solid #334155",
                                    textAlign: "center",
                                    backgroundColor: "#0f172a",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    color: "#f1f5f9"
                                }}>
                                    {getTotalInfrastructureCost().toFixed(0)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Additional Info */}
                <div style={{
                    marginTop: "24px",
                    fontSize: "14px",
                    color: "#e2e8f0",
                    backgroundColor: "#0f172a",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #334155"
                }}>
                    <p style={{ margin: "0 0 8px 0" }}>
                        <strong style={{ color: "#f1f5f9" }}>Cost per Resource:</strong> {infrastructureInput.costPerResource}
                    </p>
                    <p style={{ margin: "0 0 8px 0" }}>
                        <strong style={{ color: "#f1f5f9" }}>Total Internal Resources after Subcontracting:</strong> {getTotalInternalResourcesAfterSubcontracting().toFixed(2)}
                    </p>
                    <p style={{ margin: "0", fontWeight: "600", color: "#f1f5f9" }}>
                        <strong>Total Infrastructure Cost:</strong> {infrastructureInput.costPerResource} × {getTotalInternalResourcesAfterSubcontracting().toFixed(2)} = {getTotalInfrastructureCost().toFixed(0)}
                    </p>
                </div>

                {/* Table Label */}
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