import { useProjectData } from '../context/ProjectDataContext';

export default function ContributionMarginSection() {
    const { getContributionMarginIncludingBonus, isEditing } = useProjectData();

    const contributionMargin = getContributionMarginIncludingBonus();

    return (
        <div id="section-9" style={{
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
                Contribution Margin
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
                            <tr>
                                <td style={{
                                    padding: "16px 20px",
                                    backgroundColor: "#1e293b",
                                    color: "#e2e8f0",
                                    fontWeight: "500",
                                    width: "50%"
                                }}>
                                    Contribution Margin including Penalty & Bonus
                                </td>
                                <td style={{
                                    padding: "16px 20px",
                                    borderLeft: "1px solid #334155",
                                    textAlign: "center",
                                    backgroundColor: isEditing ? "#3b82f6" : "#0f172a",
                                    color: isEditing ? "white" : "#94a3b8",
                                    fontWeight: "700",
                                    fontSize: "24px",
                                    width: "50%"
                                }}>
                                    ${Math.round(contributionMargin).toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
