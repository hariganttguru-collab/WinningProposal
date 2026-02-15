import { useContract } from '../context/ContractContext';

// Define deliverable types locally
type DeliverableType =
    | 'Complex Screen'
    | 'Simple Screen'
    | 'Complex database'
    | 'Simple database'
    | 'Complex API'
    | 'Simple API'
    | 'Complex Report'
    | 'Simple Report';

type ProductivityLevel = 'Low' | 'Medium' | 'High';

export default function EffortForm() {
    const {
        wbsInput,
        effortInput,
        updateEffortAccuracy,
        updateProductivity,
        calculateEffortHours,
        getTotalEffortHours,
        getEffortPerUnit
    } = useContract();

    const deliverables: DeliverableType[] = [
        'Complex Screen',
        'Simple Screen',
        'Complex database',
        'Simple database',
        'Complex API',
        'Simple API',
        'Complex Report',
        'Simple Report'
    ];

    // Group deliverables by module
    const moduleGroups = {
        'Module 1 - GUI': ['Complex Screen', 'Simple Screen'],
        'Module 2 - Database': ['Complex database', 'Simple database'],
        'Module 3 - API': ['Complex API', 'Simple API'],
        'Module 4 - Reports': ['Complex Report', 'Simple Report']
    };

    const getModuleEffort = (deliverableTypes: string[]) => {
        return deliverableTypes.reduce((total, type) =>
            total + calculateEffortHours(type as DeliverableType), 0
        );
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
                Adjust Effort
            </div>

            <div style={{
                backgroundColor: "#1e293b",
                padding: "40px",
                borderRadius: "0 0 12px 12px",
                color: "#e2e8f0",
                border: "1px solid #334155",
                borderTop: "none"
            }}>

                {/* Estimation Accuracy */}
                <div style={{ marginBottom: "32px" }}>
                    <div
                        style={{
                            backgroundColor: "#0f172a",
                            color: "#f1f5f9",
                            padding: "16px 20px",
                            fontWeight: "600",
                            marginBottom: "16px",
                            borderRadius: "8px",
                            border: "1px solid #334155"
                        }}
                    >
                        Estimation Accuracy Level
                    </div>
                    <div style={{
                        padding: "20px",
                        backgroundColor: "#0f172a",
                        borderRadius: "8px",
                        border: "1px solid #334155",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px"
                    }}>
                        <input
                            type="range"
                            min="50"
                            max="100"
                            step="5"
                            value={effortInput.estimationAccuracyPct}
                            onChange={(e) => updateEffortAccuracy(parseInt(e.target.value))}
                            style={{
                                width: "200px",
                                accentColor: "#3b82f6"
                            }}
                        />
                        <span style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#f1f5f9"
                        }}>
                            {effortInput.estimationAccuracyPct}%
                        </span>
                    </div>
                </div>

                {/* Layout: Table on Left, Total on Right */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 280px',
                    gap: '24px',
                    alignItems: 'start'
                }}>
                    {/* Productivity Table */}
                    <div style={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                        border: "1px solid #334155"
                    }}>
                        <table style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            tableLayout: "fixed"
                        }}>
                            <colgroup>
                                <col style={{ width: "25%" }} />
                                <col style={{ width: "25%" }} />
                                <col style={{ width: "50%" }} />
                            </colgroup>
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
                                        Productivity
                                    </th>
                                    <th style={{
                                        backgroundColor: "#1e293b",
                                        padding: "16px 12px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        fontSize: "13px",
                                        fontWeight: "500",
                                        color: "#94a3b8",
                                        textAlign: "center"
                                    }}>
                                        Effort Per Unit
                                    </th>
                                    <th style={{
                                        backgroundColor: "#1e293b",
                                        padding: "16px 12px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        fontSize: "13px",
                                        fontWeight: "500",
                                        color: "#94a3b8"
                                    }}>
                                        Deliverable Type
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliverables.map((deliverable, index) => {
                                    const quantity = wbsInput.quantities[deliverable];
                                    const effortPerUnit = getEffortPerUnit(deliverable);

                                    return (
                                        <tr key={deliverable}>
                                            <td style={{
                                                padding: "12px 20px",
                                                borderBottom: "1px solid #334155",
                                                textAlign: "center",
                                                backgroundColor: "#1e293b"
                                            }}>
                                                <select
                                                    value={effortInput.productivity[deliverable]}
                                                    onChange={(e) => updateProductivity(deliverable, e.target.value as ProductivityLevel)}
                                                    style={{
                                                        padding: "6px 12px",
                                                        border: "2px solid #475569",
                                                        borderRadius: "6px",
                                                        backgroundColor: "#0f172a",
                                                        color: "#f1f5f9",
                                                        fontSize: "13px",
                                                        fontWeight: "500",
                                                        outline: "none"
                                                    }}
                                                >
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                </select>
                                            </td>
                                            <td style={{
                                                padding: "12px",
                                                borderBottom: "1px solid #334155",
                                                borderLeft: "1px solid #334155",
                                                textAlign: "center",
                                                backgroundColor: "#0f172a",
                                                color: "#e2e8f0",
                                                fontWeight: "500"
                                            }}>
                                                {effortPerUnit}
                                            </td>
                                            <td style={{
                                                padding: "12px",
                                                borderBottom: "1px solid #334155",
                                                borderLeft: "1px solid #334155",
                                                textAlign: "center",
                                                backgroundColor: "#1e293b",
                                                color: "#e2e8f0",
                                                fontWeight: "500"
                                            }}>
                                                {deliverable}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Total Effort Hours Card */}
                    <div style={{
                        backgroundColor: "#3b82f6",
                        borderRadius: "12px",
                        padding: "32px 24px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                        border: "1px solid #2563eb",
                        textAlign: "center",
                        position: 'sticky',
                        top: '20px'
                    }}>
                        <div style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "rgba(255, 255, 255, 0.9)",
                            marginBottom: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}>
                            Total Effort Hours
                        </div>
                        <div style={{
                            fontSize: "48px",
                            fontWeight: "700",
                            color: "white",
                            lineHeight: "1"
                        }}>
                            {getTotalEffortHours()}
                        </div>
                    </div>
                </div>

                {/* Table Label */}
                <div style={{
                    textAlign: "right",
                    marginTop: "16px",
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "500"
                }}>
                    Table 2
                </div>
            </div>
        </div>
    );
}