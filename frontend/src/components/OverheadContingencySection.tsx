import { useProjectData } from '../context/ProjectDataContext';

export default function OverheadContingencySection() {
    const {
        contingencyPercent,
        setContingencyPercent,
        overheadPercent,
        setOverheadPercent,
        qualityPercent,
        setQualityPercent,
        getTotalResourceCost
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
                padding: "20px 30px",
                fontWeight: "600",
                fontSize: "20px",
                borderBottom: "1px solid #334155"
            }}>
                Overhead & Contingency
            </div>

            <div style={{
                padding: "40px",
                color: "#e2e8f0"
            }}>
                <div style={{
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                    border: "1px solid #334155"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    <td style={{
                                        padding: "16px 20px",
                                        borderBottom: index < rows.length - 1 ? "1px solid #334155" : "none",
                                        backgroundColor: "#1e293b",
                                        color: "#e2e8f0",
                                        fontWeight: "500",
                                        width: "50%"
                                    }}>
                                        {row.label}
                                    </td>
                                    <td style={{
                                        padding: "16px 20px",
                                        borderBottom: index < rows.length - 1 ? "1px solid #334155" : "none",
                                        borderLeft: "1px solid #334155",
                                        textAlign: "center",
                                        backgroundColor: "#4ade80",
                                        width: "15%"
                                    }}>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={row.percent}
                                            onChange={(e) => row.setPercent(parseInt(e.target.value) || 0)}
                                            style={{
                                                width: "80px",
                                                padding: "10px 14px",
                                                border: "2px solid #22c55e",
                                                borderRadius: "6px",
                                                textAlign: "center",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                backgroundColor: "#dcfce7",
                                                color: "#0f172a",
                                                outline: "none",
                                                transition: "all 0.2s ease"
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = "#3b82f6";
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = "#22c55e";
                                            }}
                                        />
                                        <span style={{ marginLeft: "8px", fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>%</span>
                                    </td>
                                    <td style={{
                                        padding: "16px 20px",
                                        borderBottom: index < rows.length - 1 ? "1px solid #334155" : "none",
                                        borderLeft: "1px solid #334155",
                                        textAlign: "center",
                                        backgroundColor: "#3b82f6",
                                        color: "white",
                                        fontWeight: "700",
                                        fontSize: "18px",
                                        width: "35%"
                                    }}>
                                        ${Math.round(row.cost).toLocaleString()}
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
