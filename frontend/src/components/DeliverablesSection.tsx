import { useProjectData } from '../context/ProjectDataContext';

export default function DeliverablesSection() {
    const {
        deliverables,
        updateDeliverable,
        estimationAccuracy,
        setEstimationAccuracy
    } = useProjectData();

    // Backend calculations (not displayed)
    const calculateAdjustedQuantity = (quantity: number) => {
        return quantity * (100 / estimationAccuracy);
    };

    const calculateCost = (quantity: number, effortPerUnit: number) => {
        const adjustedQuantity = calculateAdjustedQuantity(quantity);
        return adjustedQuantity * effortPerUnit;
    };

    // Frontend display - Total deliverables
    const totalDeliverables = deliverables.reduce((sum, d) => sum + d.quantity, 0);

    // Total cost calculation for display
    const totalCost = deliverables.reduce((sum, d) => sum + calculateCost(d.quantity, d.effortPerUnit), 0);

    return (
        <div id="section-1" style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            border: "1px solid #334155"
        }}>
            {/* Header */}
            <div style={{
                backgroundColor: "#0f172a",
                color: "#f1f5f9",
                padding: "20px 30px",
                fontWeight: "600",
                fontSize: "20px",
                borderBottom: "1px solid #334155"
            }}>
                Deliverables & Effort Estimation
            </div>

            <div style={{
                padding: "40px",
                color: "#e2e8f0"
            }}>
                {/* Deliverables Table */}
                <div style={{
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                    border: "1px solid #334155",
                    marginBottom: "24px"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{
                                    backgroundColor: "#60a5fa",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    color: "#0f172a",
                                    textAlign: "left"
                                }}>
                                    Deliverables
                                </th>
                                <th style={{
                                    backgroundColor: "#4ade80",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    color: "#0f172a",
                                    textAlign: "center"
                                }}>
                                    No. of Deliverables
                                </th>
                                <th style={{
                                    backgroundColor: "#fbbf24",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    color: "#0f172a",
                                    textAlign: "center"
                                }}>
                                    Estimated Effort per Unit
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliverables.map((deliverable, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{
                                            padding: "12px 20px",
                                            borderBottom: "1px solid #334155",
                                            backgroundColor: "#1e293b",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {deliverable.name}
                                        </td>
                                        <td style={{
                                            padding: "12px 20px",
                                            borderBottom: "1px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: "#0f172a"
                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                                <button
                                                    onClick={() => updateDeliverable(index, 'quantity', Math.max(0, deliverable.quantity - 25))}
                                                    style={{
                                                        padding: "8px 12px",
                                                        backgroundColor: "#475569",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                        fontSize: "16px",
                                                        fontWeight: "700",
                                                        transition: "background-color 0.2s ease"
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#64748b"}
                                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#475569"}
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="25"
                                                    value={deliverable.quantity}
                                                    onChange={(e) => updateDeliverable(index, 'quantity', parseInt(e.target.value) || 0)}
                                                    style={{
                                                        width: "100px",
                                                        padding: "8px 12px",
                                                        border: "2px solid #475569",
                                                        borderRadius: "6px",
                                                        textAlign: "center",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        backgroundColor: "#0f172a",
                                                        color: "#f1f5f9",
                                                        outline: "none",
                                                        transition: "border-color 0.2s ease"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                                                    onBlur={(e) => e.target.style.borderColor = "#475569"}
                                                />
                                                <button
                                                    onClick={() => updateDeliverable(index, 'quantity', deliverable.quantity + 25)}
                                                    style={{
                                                        padding: "8px 12px",
                                                        backgroundColor: "#475569",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                        fontSize: "16px",
                                                        fontWeight: "700",
                                                        transition: "background-color 0.2s ease"
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#64748b"}
                                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#475569"}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{
                                            padding: "12px 20px",
                                            borderBottom: "1px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: "#0f172a"
                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                                <button
                                                    onClick={() => updateDeliverable(index, 'effortPerUnit', Math.max(0, deliverable.effortPerUnit - 5))}
                                                    style={{
                                                        padding: "8px 12px",
                                                        backgroundColor: "#475569",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                        fontSize: "16px",
                                                        fontWeight: "700",
                                                        transition: "background-color 0.2s ease"
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#64748b"}
                                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#475569"}
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="5"
                                                    value={deliverable.effortPerUnit}
                                                    onChange={(e) => updateDeliverable(index, 'effortPerUnit', parseInt(e.target.value) || 0)}
                                                    style={{
                                                        width: "100px",
                                                        padding: "8px 12px",
                                                        border: "2px solid #475569",
                                                        borderRadius: "6px",
                                                        textAlign: "center",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        backgroundColor: "#0f172a",
                                                        color: "#f1f5f9",
                                                        outline: "none",
                                                        transition: "border-color 0.2s ease"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                                                    onBlur={(e) => e.target.style.borderColor = "#475569"}
                                                />
                                                <button
                                                    onClick={() => updateDeliverable(index, 'effortPerUnit', deliverable.effortPerUnit + 5)}
                                                    style={{
                                                        padding: "8px 12px",
                                                        backgroundColor: "#475569",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                        fontSize: "16px",
                                                        fontWeight: "700",
                                                        transition: "background-color 0.2s ease"
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#64748b"}
                                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#475569"}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                        </tbody>
                    </table>
                </div>

                {/* Estimation Accuracy and Totals */}
                <div style={{
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    padding: "24px",
                    border: "1px solid #334155",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                }}>
                    {/* Estimation Accuracy */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#f1f5f9",
                            minWidth: "180px"
                        }}>
                            Estimation Accuracy
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <button
                                onClick={() => setEstimationAccuracy(Math.max(1, estimationAccuracy - 5))}
                                style={{
                                    padding: "10px 14px",
                                    backgroundColor: "#475569",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    transition: "background-color 0.2s ease"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#64748b"}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#475569"}
                            >
                                −
                            </button>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                step="5"
                                value={estimationAccuracy}
                                onChange={(e) => setEstimationAccuracy(parseInt(e.target.value) || 80)}
                                style={{
                                    padding: "10px 16px",
                                    border: "2px solid #475569",
                                    borderRadius: "8px",
                                    backgroundColor: "#1e293b",
                                    color: "#f1f5f9",
                                    width: "100px",
                                    textAlign: "center",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    outline: "none",
                                    transition: "border-color 0.2s ease"
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                                onBlur={(e) => e.target.style.borderColor = "#475569"}
                            />
                            <button
                                onClick={() => setEstimationAccuracy(Math.min(100, estimationAccuracy + 5))}
                                style={{
                                    padding: "10px 14px",
                                    backgroundColor: "#475569",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    transition: "background-color 0.2s ease"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#64748b"}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#475569"}
                            >
                                +
                            </button>
                            <span style={{ fontSize: "16px", color: "#94a3b8", fontWeight: "500" }}>%</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: "1px", backgroundColor: "#334155" }}></div>

                    {/* Totals */}
                    <div style={{ display: "flex", gap: "40px" }}>
                        {/* Total Deliverables */}
                        <div style={{
                            flex: 1,
                            backgroundColor: "#3b82f6",
                            borderRadius: "8px",
                            padding: "16px 20px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <span style={{
                                fontSize: "15px",
                                fontWeight: "600",
                                color: "white"
                            }}>
                                Total Deliverables
                            </span>
                            <span style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "white"
                            }}>
                                {totalDeliverables}
                            </span>
                        </div>

                        {/* Total Cost */}
                        <div style={{
                            flex: 1,
                            backgroundColor: "#3b82f6",
                            borderRadius: "8px",
                            padding: "16px 20px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <span style={{
                                fontSize: "15px",
                                fontWeight: "600",
                                color: "white"
                            }}>
                                Total Cost
                            </span>
                            <span style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "white"
                            }}>
                                {Math.round(totalCost)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
