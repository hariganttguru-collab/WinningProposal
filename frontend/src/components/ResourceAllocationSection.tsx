import { useProjectData } from '../context/ProjectDataContext';


export default function ResourceAllocationSection() {
    const {
        screenAllocations,
        updateScreenResource,
        databaseAllocations,
        updateDatabaseResource,
        isEditing
    } = useProjectData();

    const renderInput = (value: number, onChange: (val: number) => void) => {
        const isActive = value > 0;
        const showColors = isEditing;
        const btnBg = (isActive && showColors) ? 'rgba(34, 197, 94, 0.8)' : '#334155';
        const btnHoverBg = (isActive && showColors) ? 'rgba(21, 128, 61, 0.8)' : '#475569';
        const btnColor = (isActive && showColors) ? '#064e3b' : '#94a3b8';

        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                {isEditing && (
                    <button
                        onClick={() => onChange(Math.max(0, value - 1))}
                        style={{
                            padding: "4px 8px",
                            backgroundColor: btnBg,
                            color: btnColor,
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "700",
                            transition: "all 0.2s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = btnHoverBg}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = btnBg}
                    >
                        −
                    </button>
                )}
                <input
                    type="number"
                    min="0"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                    style={{
                        width: "40px",
                        padding: "4px 6px",
                        border: (isActive && showColors) ? "1px solid #22c55e" : "1px solid #475569",
                        borderRadius: "4px",
                        textAlign: "center",
                        fontSize: "12px",
                        fontWeight: (isActive && showColors) ? "600" : "500",
                        backgroundColor: (isActive && showColors) ? "#dcfce7" : "#0f172a",
                        color: (isActive && showColors) ? "#0f172a" : "#f1f5f9",
                        outline: "none",
                        transition: "all 0.2s ease"
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = "#3b82f6";
                        e.target.style.backgroundColor = isActive ? "#dcfce7" : "#1e293b";
                    }}
                    onBlur={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        e.target.style.borderColor = newValue > 0 ? "#22c55e" : "#475569";
                        e.target.style.backgroundColor = newValue > 0 ? "#dcfce7" : "#0f172a";
                    }}
                />
                {isEditing && (
                    <button
                        onClick={() => onChange(value + 1)}
                        style={{
                            padding: "4px 8px",
                            backgroundColor: btnBg,
                            color: btnColor,
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "700",
                            transition: "all 0.2s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = btnHoverBg}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = btnBg}
                    >
                        +
                    </button>
                )}
            </div>
        );
    };

    return (
        <div id="section-2" style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            border: "1px solid #334155"
        }}>
            <div style={{
                backgroundColor: "#0f172a",
                color: "#f1f5f9",
                padding: "10px 15px",
                fontWeight: "600",
                fontSize: "14px",
                borderBottom: "1px solid #334155"
            }}>
                Resource Allocation
            </div>

            <div style={{
                padding: "15px",
                color: "#e2e8f0",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
            }}>
                {/* Screen Deliverables Table */}
                <div>
                    <h3 style={{
                        color: "#f1f5f9",
                        fontSize: "13px",
                        fontWeight: "600",
                        marginBottom: "8px",
                        marginTop: "0"
                    }}>
                        Screen Deliverables
                    </h3>
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
                                        backgroundColor: isEditing ? "#60a5fa" : "#334155",
                                        padding: "6px 10px",
                                        borderBottom: "2px solid #334155",
                                        fontWeight: "600",
                                        fontSize: "11px",
                                        color: isEditing ? "#0f172a" : "#94a3b8",
                                        textAlign: "left",
                                        width: "40%"
                                    }}>
                                        Deliverables
                                    </th>
                                    <th style={{
                                        backgroundColor: isEditing ? "#f1f5f9" : "#334155",
                                        padding: "6px 10px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        fontWeight: "600",
                                        fontSize: "10px",
                                        color: isEditing ? "#0f172a" : "#94a3b8",
                                        textAlign: "center",
                                        width: "30%"
                                    }}>
                                        UI Dev Senior
                                    </th>
                                    <th style={{
                                        backgroundColor: isEditing ? "#f1f5f9" : "#334155",
                                        padding: "6px 10px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        fontWeight: "600",
                                        fontSize: "10px",
                                        color: isEditing ? "#0f172a" : "#94a3b8",
                                        textAlign: "center",
                                        width: "30%"
                                    }}>

                                        UI Dev Junior
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {screenAllocations.map((allocation, index) => (
                                    <tr key={index}>
                                        <td style={{
                                            padding: "6px 10px",
                                            borderBottom: index < screenAllocations.length - 1 ? "1px solid #334155" : "none",
                                            backgroundColor: "#1e293b",
                                            color: "#e2e8f0",
                                            fontWeight: "500",
                                            fontSize: "11px"
                                        }}>
                                            {allocation.deliverable}
                                        </td>
                                        <td style={{
                                            padding: "8px 10px",
                                            borderBottom: index < screenAllocations.length - 1 ? "1px solid #334155" : "none",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: (allocation.uiSenior > 0 && isEditing) ? "#4ade80" : "#0f172a"
                                        }}>
                                            {renderInput(allocation.uiSenior, (val) => updateScreenResource(index, 'uiSenior', val))}
                                        </td>
                                        <td style={{
                                            padding: "8px 10px",
                                            borderBottom: index < screenAllocations.length - 1 ? "1px solid #334155" : "none",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: (allocation.uiJunior > 0 && isEditing) ? "#4ade80" : "#0f172a"
                                        }}>
                                            {renderInput(allocation.uiJunior, (val) => updateScreenResource(index, 'uiJunior', val))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Database Deliverables Table */}
                <div>
                    <h3 style={{
                        color: "#f1f5f9",
                        fontSize: "13px",
                        fontWeight: "600",
                        marginBottom: "8px",
                        marginTop: "0"
                    }}>
                        Database Deliverables
                    </h3>
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
                                        backgroundColor: isEditing ? "#60a5fa" : "#334155",
                                        padding: "6px 10px",
                                        borderBottom: "2px solid #334155",
                                        fontWeight: "600",
                                        fontSize: "11px",
                                        color: isEditing ? "#0f172a" : "#94a3b8",
                                        textAlign: "left",
                                        width: "40%"
                                    }}>
                                        Deliverables
                                    </th>
                                    <th style={{
                                        backgroundColor: isEditing ? "#f1f5f9" : "#334155",
                                        padding: "6px 10px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        fontWeight: "600",
                                        fontSize: "10px",
                                        color: isEditing ? "#0f172a" : "#94a3b8",
                                        textAlign: "center",
                                        width: "30%"
                                    }}>
                                        Backend Dev Senior
                                    </th>
                                    <th style={{
                                        backgroundColor: isEditing ? "#f1f5f9" : "#334155",
                                        padding: "6px 10px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        fontWeight: "600",
                                        fontSize: "10px",
                                        color: isEditing ? "#0f172a" : "#94a3b8",
                                        textAlign: "center",
                                        width: "30%"
                                    }}>

                                        Backend Dev Junior
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {databaseAllocations.map((allocation, index) => (
                                    <tr key={index}>
                                        <td style={{
                                            padding: "6px 10px",
                                            borderBottom: index < databaseAllocations.length - 1 ? "1px solid #334155" : "none",
                                            backgroundColor: "#1e293b",
                                            color: "#e2e8f0",
                                            fontWeight: "500",
                                            fontSize: "11px"
                                        }}>
                                            {allocation.deliverable}
                                        </td>
                                        <td style={{
                                            padding: "8px 10px",
                                            borderBottom: index < databaseAllocations.length - 1 ? "1px solid #334155" : "none",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: (allocation.backendSenior > 0 && isEditing) ? "#4ade80" : "#0f172a"
                                        }}>
                                            {renderInput(allocation.backendSenior, (val) => updateDatabaseResource(index, 'backendSenior', val))}
                                        </td>
                                        <td style={{
                                            padding: "8px 10px",
                                            borderBottom: index < databaseAllocations.length - 1 ? "1px solid #334155" : "none",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: (allocation.backendJunior > 0 && isEditing) ? "#4ade80" : "#0f172a"
                                        }}>
                                            {renderInput(allocation.backendJunior, (val) => updateDatabaseResource(index, 'backendJunior', val))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Box */}
                <div style={{
                    padding: "8px 10px",
                    backgroundColor: "#0f172a",
                    borderRadius: "6px",
                    border: "1px solid #334155",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <div style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: "bold",
                        flexShrink: 0
                    }}>
                        i
                    </div>
                    <div style={{ fontSize: "10px", color: "#94a3b8", lineHeight: "1.3" }}>
                        <span style={{ color: "#4ade80", fontWeight: "600" }}>Green cells</span> = active allocations
                    </div>
                </div>
            </div>
        </div>
    );
}
