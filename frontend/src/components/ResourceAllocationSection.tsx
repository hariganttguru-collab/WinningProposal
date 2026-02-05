import { useProjectData } from '../context/ProjectDataContext';

interface ScreenAllocation {
    deliverable: string;
    uiSenior: number;
    uiJunior: number;
}

interface DatabaseAllocation {
    deliverable: string;
    backendSenior: number;
    backendJunior: number;
}

export default function ResourceAllocationSection() {
    const {
        screenAllocations,
        updateScreenResource,
        databaseAllocations,
        updateDatabaseResource
    } = useProjectData();

    const renderInput = (value: number, onChange: (val: number) => void) => (
        <input
            type="number"
            min="0"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            style={{
                width: "100px",
                padding: "10px 14px",
                border: value > 0 ? "2px solid #22c55e" : "2px solid #475569",
                borderRadius: "6px",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: value > 0 ? "600" : "500",
                backgroundColor: value > 0 ? "#dcfce7" : "#0f172a",
                color: value > 0 ? "#0f172a" : "#f1f5f9",
                outline: "none",
                transition: "all 0.2s ease"
            }}
            onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.backgroundColor = value > 0 ? "#dcfce7" : "#1e293b";
            }}
            onBlur={(e) => {
                const newValue = parseInt(e.target.value) || 0;
                e.target.style.borderColor = newValue > 0 ? "#22c55e" : "#475569";
                e.target.style.backgroundColor = newValue > 0 ? "#dcfce7" : "#0f172a";
            }}
        />
    );

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
                padding: "20px 30px",
                fontWeight: "600",
                fontSize: "20px",
                borderBottom: "1px solid #334155"
            }}>
                Resource Allocation
            </div>

            <div style={{
                padding: "40px",
                color: "#e2e8f0",
                display: "flex",
                flexDirection: "column",
                gap: "30px"
            }}>
                {/* Screen Deliverables Table */}
                <div>
                    <h3 style={{
                        color: "#f1f5f9",
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "16px",
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
                                        backgroundColor: "#60a5fa",
                                        padding: "16px 20px",
                                        borderBottom: "2px solid #334155",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        color: "#0f172a",
                                        textAlign: "left",
                                        width: "40%"
                                    }}>
                                        Deliverables
                                    </th>
                                    <th style={{
                                        backgroundColor: "#f1f5f9",
                                        padding: "16px 20px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        color: "#0f172a",
                                        textAlign: "center",
                                        width: "30%"
                                    }}>
                                        UI Developer Senior
                                    </th>
                                    <th style={{
                                        backgroundColor: "#f1f5f9",
                                        padding: "16px 20px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        color: "#0f172a",
                                        textAlign: "center",
                                        width: "30%"
                                    }}>
                                        UI Developer Junior
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {screenAllocations.map((allocation, index) => (
                                    <tr key={index}>
                                        <td style={{
                                            padding: "14px 20px",
                                            borderBottom: index < screenAllocations.length - 1 ? "1px solid #334155" : "none",
                                            backgroundColor: "#1e293b",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {allocation.deliverable}
                                        </td>
                                        <td style={{
                                            padding: "14px 20px",
                                            borderBottom: index < screenAllocations.length - 1 ? "1px solid #334155" : "none",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: allocation.uiSenior > 0 ? "#4ade80" : "#0f172a"
                                        }}>
                                            {renderInput(allocation.uiSenior, (val) => updateScreenResource(index, 'uiSenior', val))}
                                        </td>
                                        <td style={{
                                            padding: "14px 20px",
                                            borderBottom: index < screenAllocations.length - 1 ? "1px solid #334155" : "none",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: allocation.uiJunior > 0 ? "#4ade80" : "#0f172a"
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
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "16px",
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
                                        backgroundColor: "#60a5fa",
                                        padding: "16px 20px",
                                        borderBottom: "2px solid #334155",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        color: "#0f172a",
                                        textAlign: "left",
                                        width: "40%"
                                    }}>
                                        Deliverables
                                    </th>
                                    <th style={{
                                        backgroundColor: "#f1f5f9",
                                        padding: "16px 20px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        color: "#0f172a",
                                        textAlign: "center",
                                        width: "30%"
                                    }}>
                                        Backend Developer Senior
                                    </th>
                                    <th style={{
                                        backgroundColor: "#f1f5f9",
                                        padding: "16px 20px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        color: "#0f172a",
                                        textAlign: "center",
                                        width: "30%"
                                    }}>
                                        Backend Developer Junior
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {databaseAllocations.map((allocation, index) => (
                                    <tr key={index}>
                                        <td style={{
                                            padding: "14px 20px",
                                            borderBottom: index < databaseAllocations.length - 1 ? "1px solid #334155" : "none",
                                            backgroundColor: "#1e293b",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {allocation.deliverable}
                                        </td>
                                        <td style={{
                                            padding: "14px 20px",
                                            borderBottom: index < databaseAllocations.length - 1 ? "1px solid #334155" : "none",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: allocation.backendSenior > 0 ? "#4ade80" : "#0f172a"
                                        }}>
                                            {renderInput(allocation.backendSenior, (val) => updateDatabaseResource(index, 'backendSenior', val))}
                                        </td>
                                        <td style={{
                                            padding: "14px 20px",
                                            borderBottom: index < databaseAllocations.length - 1 ? "1px solid #334155" : "none",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: allocation.backendJunior > 0 ? "#4ade80" : "#0f172a"
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
                    padding: "16px 20px",
                    backgroundColor: "#0f172a",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                }}>
                    <div style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "bold",
                        flexShrink: 0
                    }}>
                        i
                    </div>
                    <div style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.5" }}>
                        <span style={{ color: "#4ade80", fontWeight: "600" }}>Green cells</span> indicate active allocations.
                        Allocate UI developers to screen deliverables and backend developers to database deliverables.
                    </div>
                </div>
            </div>
        </div>
    );
}
