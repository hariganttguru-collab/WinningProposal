import { useProjectData } from '../context/ProjectDataContext';

export default function OverheadContingencySection() {
    const {
        contingencyPercent,
        setContingencyPercent,
        overheadPercent,
        setOverheadPercent,
        qualityPercent,
        setQualityPercent,
        getTotalResourceCost,
        isEditing
    } = useProjectData();

    const totalResourceCost = getTotalResourceCost();
    const contingencyCost = totalResourceCost * (contingencyPercent / 100);
    const overheadCost = totalResourceCost * (overheadPercent / 100);
    const qualityCost = totalResourceCost * (qualityPercent / 100);

    const rows = [
        { label: 'Contingency (% of Resource Cost)', percent: contingencyPercent, setPercent: setContingencyPercent, cost: contingencyCost },
        { label: 'Overhead (% of Resource Cost)', percent: overheadPercent, setPercent: setOverheadPercent, cost: overheadCost },
        { label: 'Quality (Rework % of Resource Cost)', percent: qualityPercent, setPercent: setQualityPercent, cost: qualityCost }
    ];

    const inputBtnStyle = {
        padding: '0',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isEditing ? 'rgba(34, 197, 94, 0.8)' : '#334155', // Darker green or neutral
        color: isEditing ? '#064e3b' : '#94a3b8',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'all 0.2s',
    };

    return (
        <div id="section-7" style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            border: "1px solid #334155",
            display: "flex",
            flexDirection: "column",
            width: "100%"
        }}>
            <div style={{
                backgroundColor: "#0f172a",
                color: "#f1f5f9",
                padding: "10px 15px",
                fontWeight: "600",
                fontSize: "14px",
                borderBottom: "1px solid #334155"
            }}>
                Overhead & Contingency
            </div>

            <div style={{
                padding: "15px",
                color: "#e2e8f0"
            }}>
                <div style={{
                    backgroundColor: "#0f172a",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                    border: "1px solid #334155"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    <td style={{
                                        padding: "8px 12px",
                                        borderBottom: index < rows.length - 1 ? "1px solid #334155" : "none",
                                        backgroundColor: "#1e293b",
                                        color: "#e2e8f0",
                                        fontWeight: "500",
                                        fontSize: "11px",
                                        width: "70%"
                                    }}>
                                        {row.label}
                                    </td>
                                    <td style={{
                                        padding: "8px 12px",
                                        borderBottom: index < rows.length - 1 ? "1px solid #334155" : "none",
                                        borderLeft: "1px solid #334155",
                                        textAlign: "center",
                                        backgroundColor: isEditing ? "#4ade80" : "#0f172a",
                                        width: "30%"
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                            {isEditing && (
                                                <button
                                                    onClick={() => row.setPercent(Math.max(0, row.percent - 1))}
                                                    style={inputBtnStyle}
                                                    onMouseOver={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = 'rgba(21, 128, 61, 0.8)' }}
                                                    onMouseOut={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.8)' }}
                                                >-</button>
                                            )}
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={row.percent}
                                                    onChange={(e) => row.setPercent(parseInt(e.target.value) || 0)}
                                                    style={{
                                                        width: "35px",
                                                        padding: "4px",
                                                        border: isEditing ? "1px solid #22c55e" : "1px solid #475569",
                                                        borderRadius: "4px",
                                                        textAlign: "center",
                                                        fontSize: "12px",
                                                        fontWeight: isEditing ? "600" : "500",
                                                        backgroundColor: isEditing ? "#dcfce7" : "#0f172a",
                                                        color: isEditing ? "#0f172a" : "#f1f5f9",
                                                        outline: "none",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = "#3b82f6";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = isEditing ? "#22c55e" : "#475569";
                                                    }}
                                                />
                                            </div>
                                            {isEditing && (
                                                <button
                                                    onClick={() => row.setPercent(Math.min(100, row.percent + 1))}
                                                    style={inputBtnStyle}
                                                    onMouseOver={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = 'rgba(21, 128, 61, 0.8)' }}
                                                    onMouseOut={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.8)' }}
                                                >+</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
