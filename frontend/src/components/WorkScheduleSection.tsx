import { useProjectData } from '../context/ProjectDataContext';

export default function WorkScheduleSection() {
    const {
        workingDaysPerMonth,
        setWorkingDaysPerMonth,
        workingHoursPerDay,
        setWorkingHoursPerDay
    } = useProjectData();

    return (
        <div id="section-3" style={{
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
                Work Schedule Parameters
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
                                    borderBottom: "1px solid #334155",
                                    backgroundColor: "#1e293b",
                                    color: "#e2e8f0",
                                    fontWeight: "500",
                                    width: "70%"
                                }}>
                                    Number of Working Days Per Month
                                </td>
                                <td style={{
                                    padding: "16px 20px",
                                    borderBottom: "1px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    textAlign: "center",
                                    backgroundColor: "#4ade80",
                                    width: "30%"
                                }}>
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={workingDaysPerMonth}
                                        onChange={(e) => setWorkingDaysPerMonth(parseInt(e.target.value) || 0)}
                                        style={{
                                            width: "100px",
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
                                </td>
                            </tr>
                            <tr>
                                <td style={{
                                    padding: "16px 20px",
                                    backgroundColor: "#1e293b",
                                    color: "#e2e8f0",
                                    fontWeight: "500"
                                }}>
                                    Number of Working Hours per Day
                                </td>
                                <td style={{
                                    padding: "16px 20px",
                                    borderLeft: "1px solid #334155",
                                    textAlign: "center",
                                    backgroundColor: "#4ade80"
                                }}>
                                    <input
                                        type="number"
                                        min="1"
                                        max="16"
                                        value={workingHoursPerDay}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 0;
                                            setWorkingHoursPerDay(Math.min(16, Math.max(1, value)));
                                        }}
                                        style={{
                                            width: "100px",
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
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
