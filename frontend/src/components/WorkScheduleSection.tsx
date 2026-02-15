import { useProjectData } from '../context/ProjectDataContext';

export default function WorkScheduleSection() {
    const {
        workingDaysPerMonth,
        setWorkingDaysPerMonth,
        workingHoursPerDay,
        setWorkingHoursPerDay,
        isEditing
    } = useProjectData();

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
        cursor: isEditing ? 'pointer' : 'default',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'all 0.2s',
    };

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
                padding: "10px 15px",
                fontWeight: "600",
                fontSize: "14px",
                borderBottom: "1px solid #334155"
            }}>
                Work Schedule Parameters
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
                            <tr>
                                <td style={{
                                    padding: "8px 12px",
                                    borderBottom: "1px solid #334155",
                                    backgroundColor: "#1e293b",
                                    color: "#e2e8f0",
                                    fontWeight: "500",
                                    fontSize: "12px",
                                    width: "70%"
                                }}>
                                    Working Days Per Month
                                </td>
                                <td style={{
                                    padding: "8px 12px",
                                    borderBottom: "1px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    textAlign: "center",
                                    backgroundColor: isEditing ? "#4ade80" : "#0f172a",
                                    width: "30%"
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        {isEditing && (
                                            <button
                                                onClick={() => { if (isEditing) setWorkingDaysPerMonth(Math.max(1, workingDaysPerMonth - 1)) }}
                                                style={inputBtnStyle}
                                                onMouseOver={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = 'rgba(21, 128, 61, 0.8)' }}
                                                onMouseOut={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = isEditing ? 'rgba(34, 197, 94, 0.8)' : '#334155' }}
                                            >-</button>
                                        )}
                                        <input
                                            type="number"
                                            min="1"
                                            max="31"
                                            value={workingDaysPerMonth}
                                            onChange={(e) => { if (isEditing) setWorkingDaysPerMonth(parseInt(e.target.value) || 0) }}
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
                                                if (isEditing) e.target.style.borderColor = "#3b82f6";
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = isEditing ? "#22c55e" : "#475569";
                                            }}
                                        />
                                        {isEditing && (
                                            <button
                                                onClick={() => { if (isEditing) setWorkingDaysPerMonth(Math.min(31, workingDaysPerMonth + 1)) }}
                                                style={inputBtnStyle}
                                                onMouseOver={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = 'rgba(21, 128, 61, 0.8)' }}
                                                onMouseOut={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = isEditing ? 'rgba(34, 197, 94, 0.8)' : '#334155' }}
                                            >+</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style={{
                                    padding: "8px 12px",
                                    backgroundColor: "#1e293b",
                                    color: "#e2e8f0",
                                    fontWeight: "500",
                                    fontSize: "12px"
                                }}>
                                    Working Hours per Day
                                </td>
                                <td style={{
                                    padding: "8px 12px",
                                    borderLeft: "1px solid #334155",
                                    textAlign: "center",
                                    backgroundColor: isEditing ? "#4ade80" : "#0f172a"
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        {isEditing && (
                                            <button
                                                onClick={() => { if (isEditing) setWorkingHoursPerDay(Math.max(1, workingHoursPerDay - 1)) }}
                                                style={inputBtnStyle}
                                                onMouseOver={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = 'rgba(21, 128, 61, 0.8)' }}
                                                onMouseOut={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = isEditing ? 'rgba(34, 197, 94, 0.8)' : '#334155' }}
                                            >-</button>
                                        )}
                                        <input
                                            type="number"
                                            min="1"
                                            max="16"
                                            value={workingHoursPerDay}
                                            onChange={(e) => {
                                                if (isEditing) {
                                                    const value = parseInt(e.target.value) || 0;
                                                    setWorkingHoursPerDay(Math.min(16, Math.max(1, value)));
                                                }
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
                                                if (isEditing) e.target.style.borderColor = "#3b82f6";
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = isEditing ? "#22c55e" : "#475569";
                                            }}
                                        />
                                        {isEditing && (
                                            <button
                                                onClick={() => { if (isEditing) setWorkingHoursPerDay(Math.min(16, workingHoursPerDay + 1)) }}
                                                style={inputBtnStyle}
                                                onMouseOver={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = 'rgba(21, 128, 61, 0.8)' }}
                                                onMouseOut={(e) => { if (isEditing) e.currentTarget.style.backgroundColor = isEditing ? 'rgba(34, 197, 94, 0.8)' : '#334155' }}
                                            >+</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
