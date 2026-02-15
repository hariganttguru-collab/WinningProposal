import { useProjectData } from '../context/ProjectDataContext';

export default function DeliverablesSection() {
    const {
        deliverables,
        updateDeliverable,
        estimationAccuracy,
        setEstimationAccuracy,
        isEditing
    } = useProjectData();



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
                padding: "10px 15px",
                fontWeight: "600",
                fontSize: "14px",
                borderBottom: "1px solid #334155"
            }}>
                Deliverables & Effort Estimation
            </div>

            <div style={{
                padding: "15px",
                color: "#e2e8f0"
            }}>
                {/* Deliverables Table */}
                <div style={{
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                    border: "1px solid #334155",
                    marginBottom: "15px"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{
                                    backgroundColor: isEditing ? "#60a5fa" : "#334155",
                                    padding: "8px 12px",
                                    borderBottom: "2px solid #334155",
                                    fontWeight: "600",
                                    fontSize: "12px",
                                    color: isEditing ? "#0f172a" : "#94a3b8",
                                    textAlign: "left",
                                    width: "30%"
                                }}>
                                    Deliverables
                                </th>
                                <th style={{
                                    backgroundColor: isEditing ? "#4ade80" : "#334155",
                                    padding: "8px 12px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    fontSize: "12px",
                                    color: isEditing ? "#0f172a" : "#94a3b8",
                                    textAlign: "center",
                                    width: "35%"
                                }}>
                                    No. of Deliverables
                                </th>
                                <th style={{
                                    backgroundColor: isEditing ? "#fbbf24" : "#334155",
                                    padding: "8px 12px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    fontSize: "12px",
                                    color: isEditing ? "#0f172a" : "#94a3b8",
                                    textAlign: "center",
                                    width: "35%"
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
                                            padding: "6px 12px",
                                            borderBottom: "1px solid #334155",
                                            backgroundColor: "#1e293b",
                                            color: "#e2e8f0",
                                            fontWeight: "500",
                                            fontSize: "12px"
                                        }}>
                                            {deliverable.name}
                                        </td>
                                        <td style={{
                                            padding: "6px 12px",
                                            borderBottom: "1px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: "#0f172a"
                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                                                {isEditing && (
                                                    <button
                                                        onClick={() => updateDeliverable(index, 'quantity', Math.max(0, deliverable.quantity - 25))}
                                                        style={{
                                                            padding: "8px 12px",
                                                            backgroundColor: isEditing ? "#475569" : "#334155",
                                                            color: isEditing ? "white" : "#94a3b8",
                                                            border: "none",
                                                            borderRadius: "6px",
                                                            cursor: isEditing ? "pointer" : "default",
                                                            fontSize: "16px",
                                                            fontWeight: "700",
                                                            transition: "background-color 0.2s ease"
                                                        }}
                                                        onMouseOver={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = "#64748b" }}
                                                        onMouseOut={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = isEditing ? "#475569" : "#334155" }}
                                                    >
                                                        −
                                                    </button>
                                                )}
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="25"
                                                    value={deliverable.quantity}
                                                    onChange={(e) => updateDeliverable(index, 'quantity', parseInt(e.target.value) || 0)}
                                                    style={{
                                                        width: "70px",
                                                        padding: "8px 12px",
                                                        border: "2px solid #475569",
                                                        borderRadius: "6px",
                                                        textAlign: "center",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        backgroundColor: isEditing ? "#0f172a" : "#1e293b",
                                                        color: isEditing ? "#f1f5f9" : "#94a3b8",
                                                        outline: "none",
                                                        transition: "border-color 0.2s ease"
                                                    }}
                                                    onFocus={(e) => { if (isEditing) e.target.style.borderColor = "#3b82f6" }}
                                                    onBlur={(e) => e.target.style.borderColor = "#475569"}
                                                />
                                                {isEditing && (
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
                                                )}
                                            </div>
                                        </td>
                                        <td style={{
                                            padding: "12px 20px",
                                            borderBottom: "1px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: "#0f172a"
                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                                                {isEditing && (
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
                                                )}
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="5"
                                                    value={deliverable.effortPerUnit}
                                                    onChange={(e) => updateDeliverable(index, 'effortPerUnit', parseInt(e.target.value) || 0)}
                                                    style={{
                                                        width: "70px",
                                                        padding: "8px 12px",
                                                        border: "2px solid #475569",
                                                        borderRadius: "6px",
                                                        textAlign: "center",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        backgroundColor: isEditing ? "#0f172a" : "#1e293b",
                                                        color: isEditing ? "#f1f5f9" : "#94a3b8",
                                                        outline: "none",
                                                        transition: "border-color 0.2s ease"
                                                    }}
                                                    onFocus={(e) => { if (isEditing) e.target.style.borderColor = "#3b82f6" }}
                                                    onBlur={(e) => e.target.style.borderColor = "#475569"}
                                                />
                                                {isEditing && (
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
                                                )}
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
                    borderRadius: "8px",
                    padding: "12px",
                    border: "1px solid #334155",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}>
                    {/* Estimation Accuracy */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#f1f5f9",
                            minWidth: "120px"
                        }}>
                            Estimation Accuracy
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            {isEditing && (
                                <button
                                    onClick={() => setEstimationAccuracy(Math.max(1, estimationAccuracy - 5))}
                                    style={{
                                        padding: "4px 8px",
                                        backgroundColor: isEditing ? "#475569" : "#334155",
                                        color: isEditing ? "white" : "#94a3b8",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: isEditing ? "pointer" : "default",
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        transition: "background-color 0.2s ease"
                                    }}
                                    onMouseOver={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = "#64748b" }}
                                    onMouseOut={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = isEditing ? "#475569" : "#334155" }}
                                >
                                    −
                                </button>
                            )}
                            <input
                                type="number"
                                min="1"
                                max="100"
                                step="5"
                                value={estimationAccuracy}
                                onChange={(e) => setEstimationAccuracy(parseInt(e.target.value) || 80)}
                                style={{
                                    padding: "4px 8px",
                                    border: "1px solid #475569",
                                    borderRadius: "4px",
                                    backgroundColor: isEditing ? "#1e293b" : "#0f172a",
                                    color: isEditing ? "#f1f5f9" : "#94a3b8",
                                    width: "60px",
                                    textAlign: "center",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    outline: "none",
                                    transition: "border-color 0.2s ease"
                                }}
                                onFocus={(e) => { if (isEditing) e.target.style.borderColor = "#3b82f6" }}
                                onBlur={(e) => e.target.style.borderColor = "#475569"}
                            />
                            {isEditing && (
                                <button
                                    onClick={() => setEstimationAccuracy(Math.min(100, estimationAccuracy + 5))}
                                    style={{
                                        padding: "4px 8px",
                                        backgroundColor: "#475569",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        transition: "background-color 0.2s ease"
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#64748b"}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#475569"}
                                >
                                    +
                                </button>
                            )}
                            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
