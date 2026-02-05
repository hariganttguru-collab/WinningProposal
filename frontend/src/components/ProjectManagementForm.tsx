import { useContract } from '../context/ContractContext';

export default function ProjectManagementForm() {
    const {
        projectManagementInput,
        updateTeamMembersPerTeam,
        updateTeamLeadSalary,
        updateTeamLeadsPerManager,
        updatePMSalary,
        getTotalProjectManagementCost
    } = useContract();

    // Custom rounding function is no longer needed since we removed the intermediate calculations

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
                Project Management
            </div>

            <div style={{
                backgroundColor: "#1e293b",
                padding: "40px",
                borderRadius: "0 0 12px 12px",
                color: "#e2e8f0",
                border: "1px solid #334155",
                borderTop: "none"
            }}>

                {/* Input Cards Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "20px",
                    marginBottom: "32px"
                }}>
                    {/* Project Duration */}
                    <div style={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        padding: "24px",
                        border: "1px solid #334155",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                    }}>
                        <div style={{
                            fontSize: "14px",
                            color: "#94a3b8",
                            marginBottom: "12px",
                            fontWeight: "500",
                            textAlign: "center"
                        }}>
                            Project Duration in Months
                        </div>
                        <div style={{
                            fontSize: "28px",
                            fontWeight: "700",
                            color: "#f1f5f9",
                            textAlign: "center"
                        }}>
                            {projectManagementInput.projectDurationMonths}
                        </div>
                    </div>

                    {/* Team Leader - Team Member Ratio */}
                    <div style={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        padding: "24px",
                        border: "1px solid #334155",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                    }}>
                        <div style={{
                            fontSize: "14px",
                            color: "#94a3b8",
                            marginBottom: "12px",
                            fontWeight: "500",
                            textAlign: "center"
                        }}>
                            Team Leader - Team Member Ratio
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <select
                                value={`1-${projectManagementInput.teamMembersPerTeam}`}
                                onChange={(e) => {
                                    const ratio = e.target.value.split('-')[1];
                                    updateTeamMembersPerTeam(parseInt(ratio));
                                }}
                                style={{
                                    padding: "10px 16px",
                                    border: "2px solid #475569",
                                    borderRadius: "8px",
                                    backgroundColor: "#1e293b",
                                    color: "#f1f5f9",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    minWidth: "100px",
                                    outline: "none",
                                    cursor: "pointer"
                                }}
                            >
                                <option value="1-5">1-5</option>
                                <option value="1-7">1-7</option>
                                <option value="1-10">1-10</option>
                                <option value="1-12">1-12</option>
                            </select>
                        </div>
                    </div>

                    {/* Team Lead Salary */}
                    <div style={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        padding: "24px",
                        border: "1px solid #334155",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                    }}>
                        <div style={{
                            fontSize: "14px",
                            color: "#94a3b8",
                            marginBottom: "12px",
                            fontWeight: "500",
                            textAlign: "center"
                        }}>
                            Team Lead Salary
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <input
                                type="number"
                                min="0"
                                value={projectManagementInput.teamLeadSalary}
                                onChange={(e) => updateTeamLeadSalary(parseInt(e.target.value) || 0)}
                                style={{
                                    padding: "10px 16px",
                                    border: "2px solid #475569",
                                    borderRadius: "8px",
                                    backgroundColor: "#1e293b",
                                    color: "#f1f5f9",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    textAlign: "center",
                                    width: "140px",
                                    outline: "none",
                                    transition: "border-color 0.2s ease"
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                                onBlur={(e) => e.target.style.borderColor = "#475569"}
                            />
                        </div>
                    </div>

                    {/* Project Manager - Team Lead Ratio */}
                    <div style={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        padding: "24px",
                        border: "1px solid #334155",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                    }}>
                        <div style={{
                            fontSize: "14px",
                            color: "#94a3b8",
                            marginBottom: "12px",
                            fontWeight: "500",
                            textAlign: "center"
                        }}>
                            Project Manager - Team Lead Ratio
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <select
                                value={`1-${projectManagementInput.teamLeadsPerManager}`}
                                onChange={(e) => {
                                    const ratio = e.target.value.split('-')[1];
                                    updateTeamLeadsPerManager(parseInt(ratio));
                                }}
                                style={{
                                    padding: "10px 16px",
                                    border: "2px solid #475569",
                                    borderRadius: "8px",
                                    backgroundColor: "#1e293b",
                                    color: "#f1f5f9",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    minWidth: "100px",
                                    outline: "none",
                                    cursor: "pointer"
                                }}
                            >
                                <option value="1-5">1-5</option>
                                <option value="1-7">1-7</option>
                                <option value="1-10">1-10</option>
                                <option value="1-12">1-12</option>
                            </select>
                        </div>
                    </div>

                    {/* PM Salary */}
                    <div style={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        padding: "24px",
                        border: "1px solid #334155",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                    }}>
                        <div style={{
                            fontSize: "14px",
                            color: "#94a3b8",
                            marginBottom: "12px",
                            fontWeight: "500",
                            textAlign: "center"
                        }}>
                            PM Salary
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <input
                                type="number"
                                min="0"
                                value={projectManagementInput.pmSalary}
                                onChange={(e) => updatePMSalary(parseInt(e.target.value) || 0)}
                                style={{
                                    padding: "10px 16px",
                                    border: "2px solid #475569",
                                    borderRadius: "8px",
                                    backgroundColor: "#1e293b",
                                    color: "#f1f5f9",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    textAlign: "center",
                                    width: "140px",
                                    outline: "none",
                                    transition: "border-color 0.2s ease"
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                                onBlur={(e) => e.target.style.borderColor = "#475569"}
                            />
                        </div>
                    </div>
                </div>

                {/* Final Result Card */}
                <div style={{
                    backgroundColor: "#3b82f6",
                    borderRadius: "12px",
                    padding: "24px 32px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                    border: "1px solid #2563eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div style={{
                        fontWeight: "600",
                        fontSize: "18px",
                        color: "white"
                    }}>
                        Project Management Cost - Cal
                    </div>
                    <div style={{
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "white"
                    }}>
                        {getTotalProjectManagementCost().toFixed(0)}
                    </div>
                </div>

                {/* Table 5 Label */}
                <div style={{
                    textAlign: "right",
                    marginTop: "16px",
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "500"
                }}>
                    Table 5
                </div>
            </div>
        </div>
    );
}