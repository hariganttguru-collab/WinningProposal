import { useProjectData } from '../context/ProjectDataContext';

export default function MonthlySalarySection() {
    const { salaries, updateSalary, isEditing } = useProjectData();

    // Default values for calculating limits
    const defaultValues = {
        uiJunior: 4000,
        uiSenior: 7500,
        backendJunior: 4800,
        backendSenior: 9000
    };

    const salaryRows = [
        { label: 'Junior UI Developer', key: 'uiJunior' as const },
        { label: 'Senior UI Developer', key: 'uiSenior' as const },
        { label: 'Junior Backend Developer', key: 'backendJunior' as const },
        { label: 'Senior Backend Developer', key: 'backendSenior' as const }
    ];

    const inputBtnStyle = {
        padding: '0',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isEditing ? 'rgba(34, 197, 94, 0.8)' : '#334155', // Darker green or neutral
        color: isEditing ? '#064e3b' : '#94a3b8',
        border: 'none',
        borderRadius: '4px',
        cursor: isEditing ? 'pointer' : 'default', // Added check for cursor
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'all 0.2s',
    };

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
                padding: "10px 15px",
                fontWeight: "600",
                fontSize: "14px",
                borderBottom: "1px solid #334155"
            }}>
                Monthly Salary
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
                            {salaryRows.map((row, index) => (
                                <tr key={row.key}>
                                    <td style={{
                                        padding: "8px 12px",
                                        borderBottom: index < salaryRows.length - 1 ? "1px solid #334155" : "none",
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
                                        borderBottom: index < salaryRows.length - 1 ? "1px solid #334155" : "none",
                                        borderLeft: "1px solid #334155",
                                        textAlign: "center",
                                        backgroundColor: isEditing ? "#4ade80" : "#0f172a",
                                        width: "30%"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                            {isEditing && (
                                                <button
                                                    onClick={() => {
                                                        const minValue = Math.max(0, defaultValues[row.key] - 2000); // Increased range
                                                        updateSalary(row.key, Math.max(minValue, salaries[row.key] - 100));
                                                    }}
                                                    style={inputBtnStyle}
                                                    onMouseOver={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = 'rgba(21, 128, 61, 0.8)' }}
                                                    onMouseOut={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.8)' }}
                                                >
                                                    −
                                                </button>
                                            )}
                                            <input
                                                type="number"
                                                min={Math.max(0, defaultValues[row.key] - 2000)} // Increased range
                                                max={defaultValues[row.key] + 2000} // Increased range
                                                step="100"
                                                value={salaries[row.key]}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value) || 0;
                                                    const minValue = Math.max(0, defaultValues[row.key] - 2000);
                                                    const maxValue = defaultValues[row.key] + 2000;
                                                    updateSalary(row.key, Math.min(maxValue, Math.max(minValue, value)));
                                                }}

                                                style={{
                                                    width: "60px",
                                                    padding: "4px 8px",
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
                                            {isEditing && (
                                                <button
                                                    onClick={() => {
                                                        const maxValue = defaultValues[row.key] + 2000;
                                                        updateSalary(row.key, Math.min(maxValue, salaries[row.key] + 100));
                                                    }}

                                                    style={inputBtnStyle}
                                                    onMouseOver={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = 'rgba(21, 128, 61, 0.8)' }}
                                                    onMouseOut={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.8)' }}
                                                >
                                                    +
                                                </button>
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
