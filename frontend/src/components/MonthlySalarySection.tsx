import { useProjectData } from '../context/ProjectDataContext';

export default function MonthlySalarySection() {
    const { salaries, updateSalary } = useProjectData();

    // Default values for calculating limits
    const defaultValues = {
        uiJunior: 1800,
        uiSenior: 2300,
        backendJunior: 2000,
        backendSenior: 2500
    };

    const salaryRows = [
        { label: 'Monthly Salary of Junior UI Developer in USD', key: 'uiJunior' as const },
        { label: 'Monthly Salary of Senior UI Developer in USD', key: 'uiSenior' as const },
        { label: 'Monthly Salary of Junior Backend Developer in USD', key: 'backendJunior' as const },
        { label: 'Monthly Salary of Senior Backend Developer in USD', key: 'backendSenior' as const }
    ];

    return (
        <div id="section-5" style={{
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
                Monthly Salary
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
                            {salaryRows.map((row, index) => (
                                <tr key={row.key}>
                                    <td style={{
                                        padding: "16px 20px",
                                        borderBottom: index < salaryRows.length - 1 ? "1px solid #334155" : "none",
                                        backgroundColor: "#1e293b",
                                        color: "#e2e8f0",
                                        fontWeight: "500",
                                        width: "70%"
                                    }}>
                                        {row.label}
                                    </td>
                                    <td style={{
                                        padding: "16px 20px",
                                        borderBottom: index < salaryRows.length - 1 ? "1px solid #334155" : "none",
                                        borderLeft: "1px solid #334155",
                                        textAlign: "center",
                                        backgroundColor: "#4ade80",
                                        width: "30%"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                            <button
                                                onClick={() => {
                                                    const minValue = defaultValues[row.key] - 1000;
                                                    updateSalary(row.key, Math.max(minValue, salaries[row.key] - 100));
                                                }}
                                                style={{
                                                    padding: "10px 14px",
                                                    backgroundColor: "#22c55e",
                                                    color: "#0f172a",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    fontSize: "16px",
                                                    fontWeight: "700",
                                                    transition: "background-color 0.2s ease"
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#16a34a"}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#22c55e"}
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                min={defaultValues[row.key] - 1000}
                                                max={defaultValues[row.key] + 1000}
                                                step="100"
                                                value={salaries[row.key]}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value) || 0;
                                                    const minValue = defaultValues[row.key] - 1000;
                                                    const maxValue = defaultValues[row.key] + 1000;
                                                    updateSalary(row.key, Math.min(maxValue, Math.max(minValue, value)));
                                                }}
                                                style={{
                                                    width: "120px",
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
                                            <button
                                                onClick={() => {
                                                    const maxValue = defaultValues[row.key] + 1000;
                                                    updateSalary(row.key, Math.min(maxValue, salaries[row.key] + 100));
                                                }}
                                                style={{
                                                    padding: "10px 14px",
                                                    backgroundColor: "#22c55e",
                                                    color: "#0f172a",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    fontSize: "16px",
                                                    fontWeight: "700",
                                                    transition: "background-color 0.2s ease"
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#16a34a"}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#22c55e"}
                                            >
                                                +
                                            </button>
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
