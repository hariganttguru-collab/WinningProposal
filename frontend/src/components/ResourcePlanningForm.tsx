import { useContract } from '../context/ContractContext';

export default function ResourcePlanningForm() {
    const {
        resourcePlanningInput,
        updateLifecycleDistribution,
        updateWorkingDays,
        updateProductiveHours,
        getMilestoneResourceRequirement
    } = useContract();

    const phases = ['Requirements', 'Design', 'Coding', 'Testing', 'Deployment'];

    // Calculate current total percentage
    const currentTotal = resourcePlanningInput.lifecycleDistributionPct.reduce((sum, val) => sum + val, 0);
    const isInvalid = currentTotal !== 100;

    // Calculate total milestone resources
    const totalMilestoneResources = [0, 1, 2, 3, 4].reduce((sum, i) => sum + getMilestoneResourceRequirement(i), 0);

    // Handle input change with validation
    const handleLifecycleChange = (index: number, newValue: number) => {
        const newPercentages = [...resourcePlanningInput.lifecycleDistributionPct];
        newPercentages[index] = newValue;
        const newTotal = newPercentages.reduce((sum, val) => sum + val, 0);

        if (newTotal <= 100) {
            updateLifecycleDistribution(index, newValue);
        }
    };

    return (
        <div style={{ marginTop: "30px" }}>
            {/* Header */}
            <div style={{
                backgroundColor: "#0f172a",
                color: "#f1f5f9",
                padding: "20px 30px",
                fontWeight: "600",
                fontSize: "20px",
                borderRadius: "12px 12px 0 0",
                borderBottom: "1px solid #334155"
            }}>
                Calculate Resources
            </div>

            <div style={{
                backgroundColor: "#1e293b",
                padding: "40px",
                borderRadius: "0 0 12px 12px",
                color: "#e2e8f0",
                border: "1px solid #334155",
                borderTop: "none"
            }}>

                {/* Lifecycle Distribution */}
                <div style={{
                    backgroundColor: "#0f172a",
                    padding: "24px",
                    borderRadius: "12px",
                    border: "1px solid #334155",
                    marginBottom: "24px"
                }}>
                    <div style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#f1f5f9",
                        marginBottom: "20px",
                        textAlign: "center"
                    }}>
                        Software Life Cycle Distribution
                    </div>
                    <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                        {phases.map((phase, index) => (
                            <div key={phase} style={{ textAlign: "center", flex: 1 }}>
                                <div style={{
                                    fontSize: "13px",
                                    marginBottom: "8px",
                                    color: "#94a3b8",
                                    fontWeight: "500"
                                }}>
                                    {phase}
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={resourcePlanningInput.lifecycleDistributionPct[index]}
                                    onChange={(e) => handleLifecycleChange(index, parseFloat(e.target.value) || 0)}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        textAlign: "center",
                                        border: "2px solid #475569",
                                        borderRadius: "6px",
                                        fontSize: "16px",
                                        backgroundColor: "#1e293b",
                                        color: "#f1f5f9",
                                        fontWeight: "600",
                                        outline: "none"
                                    }}
                                />
                                <div style={{
                                    fontSize: "12px",
                                    marginTop: "4px",
                                    color: "#64748b"
                                }}>
                                    %
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: currentTotal === 100 ? "#10b981" : "#ef4444",
                        padding: "12px",
                        backgroundColor: currentTotal === 100 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        borderRadius: "6px"
                    }}>
                        Total: {currentTotal.toFixed(1)}%
                        {isInvalid && " (Must equal 100%)"}
                        {currentTotal === 100 && " ✓"}
                    </div>
                </div>

                {/* Working Parameters and Total */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px'
                }}>
                    {/* Working Days */}
                    <div style={{
                        backgroundColor: "#0f172a",
                        padding: "24px",
                        borderRadius: "12px",
                        border: "1px solid #334155",
                        textAlign: "center"
                    }}>
                        <div style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#94a3b8",
                            marginBottom: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}>
                            Working Days/Month
                        </div>
                        <input
                            type="number"
                            min="1"
                            value={resourcePlanningInput.workingDaysPerMonth}
                            onChange={(e) => updateWorkingDays(parseInt(e.target.value) || 22)}
                            style={{
                                width: "100px",
                                padding: "12px",
                                textAlign: "center",
                                border: "2px solid #475569",
                                borderRadius: "6px",
                                fontSize: "24px",
                                backgroundColor: "#1e293b",
                                color: "#f1f5f9",
                                fontWeight: "700",
                                outline: "none"
                            }}
                        />
                    </div>

                    {/* Productive Hours */}
                    <div style={{
                        backgroundColor: "#0f172a",
                        padding: "24px",
                        borderRadius: "12px",
                        border: "1px solid #334155",
                        textAlign: "center"
                    }}>
                        <div style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#94a3b8",
                            marginBottom: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}>
                            Productive Hours/Day
                        </div>
                        <input
                            type="number"
                            min="1"
                            max="24"
                            step="0.5"
                            value={resourcePlanningInput.productiveHoursPerDay}
                            onChange={(e) => updateProductiveHours(parseFloat(e.target.value) || 7)}
                            style={{
                                width: "100px",
                                padding: "12px",
                                textAlign: "center",
                                border: "2px solid #475569",
                                borderRadius: "6px",
                                fontSize: "24px",
                                backgroundColor: "#1e293b",
                                color: "#f1f5f9",
                                fontWeight: "700",
                                outline: "none"
                            }}
                        />
                    </div>

                    {/* Total Resources */}
                    <div style={{
                        backgroundColor: "#3b82f6",
                        padding: "24px",
                        borderRadius: "12px",
                        border: "1px solid #2563eb",
                        textAlign: "center",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                    }}>
                        <div style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "rgba(255, 255, 255, 0.9)",
                            marginBottom: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}>
                            Total Resources
                        </div>
                        <div style={{
                            fontSize: "32px",
                            fontWeight: "700",
                            color: "white",
                            lineHeight: "1"
                        }}>
                            {totalMilestoneResources.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
