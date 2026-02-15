import { useContract } from '../context/ContractContext';
import { useState } from 'react';

// Define deliverable types locally in this component
type DeliverableType =
    | 'Complex Screen'
    | 'Simple Screen'
    | 'Complex database'
    | 'Simple database'
    | 'Complex API'
    | 'Simple API'
    | 'Complex Report'
    | 'Simple Report';

export default function WBSForm() {
    const { wbsInput, updateWBSQuantity, getTotalQuantity } = useContract();
    const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

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

    // Info tooltips for each deliverable type
    const deliverableInfo: Record<DeliverableType, string> = {
        'Complex Screen': 'Multi-step forms, dashboards with complex interactions, screens with advanced UI components, data visualization screens, or screens requiring significant business logic.',
        'Simple Screen': 'Basic forms, simple list views, static information pages, login screens, or screens with minimal user interaction and straightforward layouts.',
        'Complex database': 'Tables with complex relationships, stored procedures, triggers, views, indexes, or databases requiring advanced data modeling and optimization.',
        'Simple database': 'Basic tables with simple relationships, standard CRUD operations, minimal business logic, or straightforward data storage requirements.',
        'Complex API': 'APIs with complex business logic, multiple integrations, advanced authentication, data transformation, or APIs requiring significant processing.',
        'Simple API': 'Basic CRUD APIs, simple data retrieval endpoints, straightforward request/response patterns, or APIs with minimal business logic.',
        'Complex Report': 'Multi-page reports, reports with complex calculations, advanced formatting, charts/graphs, drill-down capabilities, or reports requiring data aggregation.',
        'Simple Report': 'Basic list reports, simple tabular data, minimal formatting, standard templates, or reports with straightforward data presentation.'
    };

    const recommendedTotal = 570;
    const currentTotal = getTotalQuantity();

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
                Work Breakdown Structure
            </div>

            <div style={{
                backgroundColor: "#1e293b",
                padding: "40px",
                borderRadius: "0 0 12px 12px",
                color: "#e2e8f0",
                border: "1px solid #334155",
                borderTop: "none"
            }}>

                {/* WBS Diagram */}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "40px",
                    gap: "20px"
                }}>

                    {/* Project Box */}
                    <div style={{
                        backgroundColor: "#475569",
                        padding: "40px 30px",
                        borderRadius: "12px",
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: "18px",
                        minWidth: "120px",
                        color: "#f1f5f9",
                        border: "1px solid #64748b"
                    }}>
                        Project
                    </div>

                    {/* Arrow */}
                    <div style={{ fontSize: "24px", color: "#94a3b8" }}>→</div>

                    {/* Modules Box */}
                    <div style={{
                        backgroundColor: "#475569",
                        padding: "20px",
                        borderRadius: "12px",
                        textAlign: "center",
                        fontWeight: "600",
                        color: "#f1f5f9",
                        border: "1px solid #64748b"
                    }}>
                        <div>Modules (4)</div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            marginTop: "15px"
                        }}>
                            <div style={{ backgroundColor: "#3b82f6", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", color: "white" }}>GUI</div>
                            <div style={{ backgroundColor: "#3b82f6", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", color: "white" }}>Database</div>
                            <div style={{ backgroundColor: "#3b82f6", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", color: "white" }}>API</div>
                            <div style={{ backgroundColor: "#3b82f6", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", color: "white" }}>Reports</div>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div style={{ fontSize: "24px", color: "#94a3b8" }}>→</div>

                    {/* Deliverables Box */}
                    <div style={{
                        backgroundColor: "#475569",
                        padding: "20px",
                        borderRadius: "12px",
                        textAlign: "center",
                        fontWeight: "600",
                        color: "#f1f5f9",
                        border: "1px solid #64748b"
                    }}>
                        <div>Deliverables</div>
                        <div style={{ fontSize: "24px", fontWeight: "700", marginTop: "10px" }}>
                            ({recommendedTotal})
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "5px" }}>
                            Recommended
                        </div>
                    </div>
                </div>

                {/* Input Table */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                        border: "1px solid #334155"
                    }}>
                        <table style={{
                            borderCollapse: "collapse",
                            minWidth: "500px"
                        }}>
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
                                        Quantity
                                    </th>
                                    <th style={{
                                        backgroundColor: "#1e293b",
                                        color: "#f1f5f9",
                                        padding: "16px 20px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        fontWeight: "600",
                                        fontSize: "14px"
                                    }}>
                                        Adjust
                                    </th>
                                </tr>
                                <tr>
                                    <th style={{
                                        backgroundColor: "#1e293b",
                                        padding: "12px 20px",
                                        borderBottom: "1px solid #334155",
                                        fontSize: "13px",
                                        color: "#94a3b8",
                                        fontWeight: "500"
                                    }}>
                                        Deliverable Type
                                    </th>
                                    <th style={{
                                        backgroundColor: "#1e293b",
                                        padding: "12px 20px",
                                        borderBottom: "1px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        fontSize: "13px",
                                        color: "#94a3b8",
                                        fontWeight: "500"
                                    }}>
                                        Estimated Quantity
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliverables.map((deliverable) => (
                                    <tr key={deliverable}>
                                        <td style={{
                                            padding: "12px 20px",
                                            borderBottom: "1px solid #334155",
                                            backgroundColor: "#1e293b",
                                            color: "#e2e8f0",
                                            fontWeight: "500",
                                            position: "relative"
                                        }}>
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px"
                                            }}>
                                                <span>{deliverable}</span>
                                                <div
                                                    style={{
                                                        position: 'relative',
                                                        display: 'inline-block'
                                                    }}
                                                    onMouseEnter={() => setHoveredInfo(deliverable)}
                                                    onMouseLeave={() => setHoveredInfo(null)}
                                                >
                                                    <div style={{
                                                        width: '16px',
                                                        height: '16px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#3b82f6',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '10px',
                                                        fontWeight: 'bold',
                                                        cursor: 'help',
                                                        transition: 'all 0.2s ease'
                                                    }}>
                                                        i
                                                    </div>
                                                    {hoveredInfo === deliverable && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            left: '25px',
                                                            top: '-10px',
                                                            backgroundColor: '#0f172a',
                                                            border: '2px solid #3b82f6',
                                                            borderRadius: '8px',
                                                            padding: '12px',
                                                            width: '300px',
                                                            zIndex: 10000,
                                                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
                                                            fontSize: '12px',
                                                            color: '#e2e8f0',
                                                            lineHeight: '1.5',
                                                            pointerEvents: 'none'
                                                        }}>
                                                            <div style={{
                                                                fontWeight: 'bold',
                                                                color: '#60a5fa',
                                                                marginBottom: '6px'
                                                            }}>
                                                                {deliverable}
                                                            </div>
                                                            {deliverableInfo[deliverable]}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{
                                            padding: "12px 20px",
                                            borderBottom: "1px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: "#0f172a"
                                        }}>
                                            <input
                                                type="number"
                                                min="0"
                                                step="5"
                                                value={wbsInput.quantities[deliverable]}
                                                onChange={(e) => updateWBSQuantity(deliverable, parseInt(e.target.value) || 0)}
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
                                        </td>
                                    </tr>
                                ))}
                                <tr style={{ backgroundColor: "#3b82f6" }}>
                                    <td style={{
                                        padding: "16px 20px",
                                        fontWeight: "600",
                                        fontSize: "15px",
                                        color: "white"
                                    }}>
                                        Total
                                    </td>
                                    <td style={{
                                        padding: "16px 20px",
                                        borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
                                        textAlign: "center",
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        color: "white"
                                    }}>
                                        {currentTotal}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Table 1 Label */}
                <div style={{
                    textAlign: "right",
                    marginTop: "16px",
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "500"
                }}>
                    Table 1
                </div>

                {/* Summary */}
                <div style={{
                    marginTop: "24px",
                    padding: "20px",
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    border: "1px solid #334155"
                }}>
                    <p style={{ margin: "0 0 12px 0", color: "#e2e8f0" }}>
                        <strong style={{ color: "#f1f5f9" }}>Recommended Total:</strong> {recommendedTotal} deliverables
                    </p>
                    <p style={{ margin: "0", color: "#e2e8f0" }}>
                        <strong style={{ color: "#f1f5f9" }}>Your Total:</strong> {currentTotal} deliverables
                        {currentTotal !== recommendedTotal && (
                            <span style={{
                                marginLeft: "10px",
                                color: currentTotal > recommendedTotal ? "#ef4444" : "#10b981",
                                fontWeight: "600"
                            }}>
                                ({currentTotal > recommendedTotal ? "+" : ""}{currentTotal - recommendedTotal})
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}