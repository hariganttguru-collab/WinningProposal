import { useContract } from '../context/ContractContext';
import { useState } from 'react';

export default function FinancingChargesForm() {
    const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

    const {
        financingInput,
        updateCostOfCapital,
        setCashInPreset,
        updateCashInPercentageForMonth,
        getTotalFinancingCharges
    } = useContract();

    const months = ["Month -1", "Month -2", "Month -3", "Month -4", "Month -5"];

    const currentTotal = financingInput.cashInPercentages.reduce((sum, val) => sum + val, 0);
    const isOverLimit = currentTotal > 100;
    const isUnderLimit = currentTotal < 100;
    const isInvalid = currentTotal !== 100;

    const cashInPresets = [
        { name: "Frontend Loaded", values: [40, 30, 20, 10, 0] },
        { name: "Balanced", values: [20, 20, 20, 20, 20] },
        { name: "Late Heavy", values: [0, 10, 20, 30, 40] },
        { name: "Standard", values: [5, 10, 15, 30, 40] },
        { name: "Backend Loaded", values: [5, 5, 10, 35, 45] }
    ];

    const handleCashInChange = (index: number, newValue: number) => {
        const newPercentages = [...financingInput.cashInPercentages];
        newPercentages[index] = newValue;
        const newTotal = newPercentages.reduce((sum, val) => sum + val, 0);

        if (newTotal <= 100) {
            updateCashInPercentageForMonth(index, newValue);
        }
    };

    return (
        <div style={{ marginTop: "30px" }}>
            <div style={{
                backgroundColor: "#0f172a",
                color: "#f1f5f9",
                padding: "20px 30px",
                fontWeight: "600",
                fontSize: "20px",
                borderRadius: "12px 12px 0 0",
                borderBottom: "1px solid #334155"
            }}>
                Financing Charges
            </div>

            <div style={{
                backgroundColor: "#1e293b",
                padding: "40px",
                borderRadius: "0 0 12px 12px",
                color: "#e2e8f0",
                border: "1px solid #334155",
                borderTop: "none"
            }}>

                <div style={{ marginBottom: "32px" }}>
                    <h4 style={{ margin: "0 0 16px 0", color: "#f1f5f9", fontSize: "16px", fontWeight: "600" }}>
                        Cash In Distribution Presets
                        <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "400", marginLeft: "8px" }}>
                            (Total: 100%)
                        </span>
                    </h4>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        {cashInPresets.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => setCashInPreset(preset.values)}
                                style={{
                                    padding: "12px 20px",
                                    backgroundColor: JSON.stringify(financingInput.cashInPercentages) === JSON.stringify(preset.values) ? "#3b82f6" : "#0f172a",
                                    color: JSON.stringify(financingInput.cashInPercentages) === JSON.stringify(preset.values) ? "white" : "#e2e8f0",
                                    border: JSON.stringify(financingInput.cashInPercentages) === JSON.stringify(preset.values) ? "2px solid #3b82f6" : "2px solid #475569",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    transition: "all 0.2s ease",
                                    boxShadow: JSON.stringify(financingInput.cashInPercentages) === JSON.stringify(preset.values) ? "0 4px 12px rgba(59, 130, 246, 0.25)" : "0 2px 4px rgba(0, 0, 0, 0.3)"
                                }}
                                onMouseOver={(e) => {
                                    if (JSON.stringify(financingInput.cashInPercentages) !== JSON.stringify(preset.values)) {
                                        e.currentTarget.style.borderColor = "#64748b";
                                        e.currentTarget.style.backgroundColor = "#334155";
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (JSON.stringify(financingInput.cashInPercentages) !== JSON.stringify(preset.values)) {
                                        e.currentTarget.style.borderColor = "#475569";
                                        e.currentTarget.style.backgroundColor = "#0f172a";
                                    }
                                }}
                            >
                                <div style={{ fontWeight: "600", marginBottom: "4px" }}>{preset.name}</div>
                                <div style={{ fontSize: "11px", opacity: "0.8", fontFamily: "monospace" }}>
                                    [{preset.values.join(", ")}]
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                    <div style={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        padding: "24px",
                        border: "1px solid #334155",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", fontWeight: "600", color: "#f1f5f9" }}>
                                Cost of Capital
                                <span style={{ display: "inline-block", width: "6px", height: "6px", backgroundColor: "#ef4444", borderRadius: "50%", flexShrink: 0 }}></span>
                                <div
                                    style={{
                                        position: 'relative',
                                        display: 'inline-block'
                                    }}
                                    onMouseEnter={() => setHoveredInfo('costOfCapital')}
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
                                    {hoveredInfo === 'costOfCapital' && (
                                        <div style={{
                                            position: 'absolute',
                                            left: '25px',
                                            top: '-10px',
                                            backgroundColor: '#0f172a',
                                            border: '2px solid #3b82f6',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            width: '280px',
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
                                                Cost of Capital
                                            </div>
                                            The annual interest rate your company pays to finance the project. This represents the cost of borrowing money or the opportunity cost of using company funds. Typical range is 8-15% depending on company size and market conditions.
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <input
                                    type="number"
                                    value={financingInput.costOfCapital}
                                    onChange={(e) => updateCostOfCapital(Number(e.target.value))}
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
                                <span style={{ fontSize: "16px", color: "#94a3b8", fontWeight: "500" }}>%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
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
                                            fontSize: "14px",
                                            color: "#f1f5f9",
                                            textAlign: "left"
                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                Cash In %
                                                <span style={{ display: "inline-block", width: "6px", height: "6px", backgroundColor: "#ef4444", borderRadius: "50%", flexShrink: 0 }}></span>
                                                <div
                                                    style={{
                                                        position: 'relative',
                                                        display: 'inline-block'
                                                    }}
                                                    onMouseEnter={() => setHoveredInfo('cashIn')}
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
                                                    {hoveredInfo === 'cashIn' && (
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
                                                                Cash In Distribution
                                                            </div>
                                                            Percentage of total project payment received each month. Frontend Loaded means more payment upfront, Backend Loaded means more payment at project completion. Must total exactly 100%.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{
                                                fontSize: "12px",
                                                color: isInvalid ? "#ef4444" : "#10b981",
                                                marginTop: "4px",
                                                fontWeight: "400"
                                            }}>
                                                Total: {currentTotal}%
                                                {isOverLimit && <span style={{ marginLeft: "8px", fontSize: "11px", color: "#ef4444", fontWeight: "500" }}>(Exceeds 100%)</span>}
                                                {isUnderLimit && <span style={{ marginLeft: "8px", fontSize: "11px", color: "#ef4444", fontWeight: "500" }}>(Must equal 100%)</span>}
                                                {currentTotal === 100 && <span style={{ marginLeft: "8px", fontSize: "11px", color: "#10b981", fontWeight: "500" }}>✓</span>}
                                            </div>
                                        </th>
                                        {months.map((month) => (
                                            <th key={month} style={{
                                                backgroundColor: "#1e293b",
                                                padding: "16px 12px",
                                                borderBottom: "2px solid #334155",
                                                borderLeft: "1px solid #334155",
                                                fontSize: "13px",
                                                fontWeight: "500",
                                                color: "#94a3b8",
                                                textAlign: "center"
                                            }}>
                                                {month}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ backgroundColor: "#1e293b", padding: "16px 20px", fontWeight: "500", color: "#f1f5f9" }}>
                                            Cash In %
                                        </td>
                                        {months.map((month, index) => (
                                            <td key={month} style={{ padding: "16px 12px", textAlign: "center", backgroundColor: "#0f172a", borderLeft: "1px solid #334155" }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                                                    <input
                                                        type="number"
                                                        step="5"
                                                        min="0"
                                                        max="100"
                                                        value={financingInput.cashInPercentages[index]}
                                                        onChange={(e) => handleCashInChange(index, Number(e.target.value))}
                                                        style={{
                                                            padding: "6px 8px",
                                                            border: isInvalid ? "2px solid #ef4444" : "2px solid #475569",
                                                            borderRadius: "6px",
                                                            backgroundColor: "#1e293b",
                                                            color: "#f1f5f9",
                                                            width: "60px",
                                                            textAlign: "center",
                                                            fontSize: "13px",
                                                            fontWeight: "500",
                                                            outline: "none",
                                                            transition: "border-color 0.2s ease"
                                                        }}
                                                        onFocus={(e) => e.target.style.borderColor = isInvalid ? "#ef4444" : "#3b82f6"}
                                                        onBlur={(e) => e.target.style.borderColor = isInvalid ? "#ef4444" : "#475569"}
                                                    />
                                                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>%</span>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

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
                                Total Financing Charges
                            </div>
                            <div style={{ fontSize: "40px", fontWeight: "700", color: "white" }}>
                                {getTotalFinancingCharges().toFixed(0)}
                            </div>
                        </div>
                    </div>
                </div>

                {isInvalid && (
                    <div style={{
                        marginTop: "16px",
                        padding: "12px 16px",
                        backgroundColor: isOverLimit ? "#7f1d1d" : "#92400e",
                        border: isOverLimit ? "1px solid #ef4444" : "1px solid #f59e0b",
                        borderRadius: "8px",
                        color: isOverLimit ? "#fecaca" : "#fde68a",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        <span style={{
                            display: "inline-block",
                            width: "16px",
                            height: "16px",
                            backgroundColor: isOverLimit ? "#ef4444" : "#f59e0b",
                            borderRadius: "50%",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "600",
                            textAlign: "center",
                            lineHeight: "16px",
                            flexShrink: 0
                        }}>{isOverLimit ? "!" : "⚠"}</span>
                        {isOverLimit
                            ? `Cash In percentages total ${currentTotal}% which exceeds 100%. Please reduce values to total exactly 100%.`
                            : `Cash In percentages total ${currentTotal}% which is less than 100%. Please add ${100 - currentTotal}% more to reach exactly 100%.`
                        }
                    </div>
                )}

                <div style={{ textAlign: "right", marginTop: "16px", fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                    Table 9
                </div>
            </div>
        </div>
    );
}
