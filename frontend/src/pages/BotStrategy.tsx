import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BotStrategy() {
    const location = useLocation();
    const navigate = useNavigate();
    const [botData, setBotData] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        if (location.state?.botData) {
            setBotData(location.state.botData);
            setLeaderboardData(location.state.leaderboardData || []);
        } else {
            navigate("/");
        }
    }, [location.state, navigate]);

    if (!botData) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#0f172a",
            color: "#e2e8f0",
            padding: "20px"
        }}>
            {/* Header */}
            <div style={{ marginBottom: "30px" }}>
                <button
                    onClick={() => navigate("/contract", {
                        state: {
                            showLeaderboard: true,
                            leaderboardData: leaderboardData
                        }
                    })}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "#1e293b",
                        color: "#e2e8f0",
                        border: "2px solid #475569",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginBottom: "20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#334155";
                        e.target.style.borderColor = "#64748b";
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#1e293b";
                        e.target.style.borderColor = "#475569";
                    }}
                >
                    ← Back to Leaderboard
                </button>

                <h1 style={{
                    fontSize: "2.5rem",
                    fontWeight: "600",
                    margin: "0 0 10px 0",
                    color: "#f1f5f9"
                }}>
                    🤖 {botData.name} - Detailed Strategy Analysis
                </h1>

                <div style={{
                    fontSize: "1.2rem",
                    color: "#10b981",
                    fontWeight: "600"
                }}>
                    Final Bid: ${botData.bidPrice.toFixed(0)} (Rank #{botData.rank})
                </div>
            </div>

            {/* Final Bid Breakdown */}
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                marginBottom: "30px",
                border: "1px solid #334155"
            }}>
                <div style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "20px 30px",
                    fontWeight: "600",
                    fontSize: "18px"
                }}>
                    💰 Final Bid Breakdown
                </div>
                <div style={{ padding: "30px", color: "#e2e8f0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "16px" }}>
                        <div><strong style={{ color: "#f1f5f9" }}>Final Bid Price:</strong> ${botData.bidPrice.toFixed(0)}</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Base Costs:</strong> ${botData.baseCosts.toFixed(0)}</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Overhead ({botData.overheadPercentage.toFixed(1)}%):</strong> ${botData.overheadCost.toFixed(0)}</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Financing Cost:</strong> ${botData.financingCost.toFixed(0)}</div>
                        <div style={{ gridColumn: "1 / -1", borderTop: "1px solid #334155", paddingTop: "15px", marginTop: "15px" }}>
                            <strong style={{ color: "#f1f5f9" }}>Profit ({botData.profitPercentage.toFixed(1)}%):</strong> ${botData.profitAmount.toFixed(0)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Strategy Decisions */}
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                marginBottom: "30px",
                border: "1px solid #334155"
            }}>
                <div style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "20px 30px",
                    fontWeight: "600",
                    fontSize: "18px"
                }}>
                    📊 Key Strategy Decisions
                </div>
                <div style={{ padding: "30px", color: "#e2e8f0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "16px" }}>
                        <div><strong style={{ color: "#f1f5f9" }}>Estimation Accuracy:</strong> {botData.inputs.effort.estimationAccuracyPct.toFixed(0)}%</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Permanent vs Temp Staff:</strong> {botData.inputs.resourceCost.permanentVsTempRatio.toFixed(0)}% permanent</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Permanent Salary:</strong> ${botData.inputs.resourceCost.permanentMonthlySalary.toFixed(0)}</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Temporary Salary:</strong> ${botData.inputs.resourceCost.temporaryMonthlySalary.toFixed(0)}</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Heuristic Buffer:</strong> {botData.inputs.heuristic.heuristicPct.toFixed(1)}%</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Infrastructure Cost/Resource:</strong> ${botData.inputs.infrastructure.costPerResource.toFixed(0)}</div>
                    </div>
                </div>
            </div>

            {/* Project Management Approach */}
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                marginBottom: "30px",
                border: "1px solid #334155"
            }}>
                <div style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "20px 30px",
                    fontWeight: "600",
                    fontSize: "18px"
                }}>
                    👥 Project Management Approach
                </div>
                <div style={{ padding: "30px", color: "#e2e8f0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "16px" }}>
                        <div><strong style={{ color: "#f1f5f9" }}>Team Members per Team:</strong> {botData.inputs.projectManagement.teamMembersPerTeam.toFixed(0)}</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Team Lead Salary:</strong> ${botData.inputs.projectManagement.teamLeadSalary.toFixed(0)}</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Team Leads per Manager:</strong> {botData.inputs.projectManagement.teamLeadsPerManager.toFixed(0)}</div>
                        <div><strong style={{ color: "#f1f5f9" }}>PM Salary:</strong> ${botData.inputs.projectManagement.pmSalary.toFixed(0)}</div>
                    </div>
                </div>
            </div>

            {/* Onsite Strategy */}
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                marginBottom: "30px",
                border: "1px solid #334155"
            }}>
                <div style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "20px 30px",
                    fontWeight: "600",
                    fontSize: "18px"
                }}>
                    🌍 Onsite Strategy
                </div>
                <div style={{ padding: "30px", color: "#e2e8f0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "16px" }}>
                        <div><strong style={{ color: "#f1f5f9" }}>Onsite/Offshore Ratio:</strong> 1:{botData.inputs.onsite.onsiteOffshoreRatio.toFixed(0)}</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Onsite Coordinator Salary:</strong> ${botData.inputs.onsite.onsiteCoordinatorSalary.toFixed(0)}</div>
                    </div>
                </div>
            </div>

            {/* Financing Approach */}
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                marginBottom: "30px",
                border: "1px solid #334155"
            }}>
                <div style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "20px 30px",
                    fontWeight: "600",
                    fontSize: "18px"
                }}>
                    📈 Financing Approach
                </div>
                <div style={{ padding: "30px", color: "#e2e8f0" }}>
                    <div style={{ fontSize: "16px" }}>
                        <div style={{ marginBottom: "15px" }}><strong style={{ color: "#f1f5f9" }}>Cost of Capital:</strong> {botData.inputs.financing.costOfCapital.toFixed(1)}%</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Cash In Distribution:</strong> [{botData.inputs.financing.cashInPercentages.join('%, ')}%]</div>
                    </div>
                </div>
            </div>

            {/* Subcontracting Decisions */}
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                marginBottom: "30px",
                border: "1px solid #334155"
            }}>
                <div style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "20px 30px",
                    fontWeight: "600",
                    fontSize: "18px"
                }}>
                    🏗️ Subcontracting Decisions
                </div>
                <div style={{ padding: "30px", color: "#e2e8f0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "16px" }}>
                        {Object.entries(botData.inputs.subContract.selectedSubcontractors).map(([module, choice]) => (
                            <div key={module}><strong style={{ color: "#f1f5f9" }}>{module}:</strong> {choice}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Risk Management */}
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                marginBottom: "30px",
                border: "1px solid #334155"
            }}>
                <div style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "20px 30px",
                    fontWeight: "600",
                    fontSize: "18px"
                }}>
                    ⚠️ Risk Management
                </div>
                <div style={{ padding: "30px", color: "#e2e8f0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "16px" }}>
                        {Object.entries(botData.inputs.risk.riskRatings).map(([module, rating]) => (
                            <div key={module}><strong style={{ color: "#f1f5f9" }}>{module}:</strong> {rating}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* WBS Quantities */}
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                marginBottom: "30px",
                border: "1px solid #334155"
            }}>
                <div style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "20px 30px",
                    fontWeight: "600",
                    fontSize: "18px"
                }}>
                    📋 WBS Quantities
                </div>
                <div style={{ padding: "30px", color: "#e2e8f0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "16px" }}>
                        {Object.entries(botData.inputs.wbs.quantities).map(([deliverable, qty]) => (
                            <div key={deliverable}><strong style={{ color: "#f1f5f9" }}>{deliverable}:</strong> {qty}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Productivity Levels */}
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                marginBottom: "30px",
                border: "1px solid #334155"
            }}>
                <div style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "20px 30px",
                    fontWeight: "600",
                    fontSize: "18px"
                }}>
                    🎯 Productivity Levels
                </div>
                <div style={{ padding: "30px", color: "#e2e8f0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "16px" }}>
                        {Object.entries(botData.inputs.effort.productivity).map(([deliverable, level]) => (
                            <div key={deliverable}><strong style={{ color: "#f1f5f9" }}>{deliverable}:</strong> {level}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lifecycle Distribution */}
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                marginBottom: "30px",
                border: "1px solid #334155"
            }}>
                <div style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "20px 30px",
                    fontWeight: "600",
                    fontSize: "18px"
                }}>
                    📅 Lifecycle Distribution
                </div>
                <div style={{ padding: "30px", color: "#e2e8f0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "16px" }}>
                        <div><strong style={{ color: "#f1f5f9" }}>Requirements:</strong> {botData.inputs.resourcePlanning.lifecycleDistributionPct[0].toFixed(1)}%</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Design:</strong> {botData.inputs.resourcePlanning.lifecycleDistributionPct[1].toFixed(1)}%</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Coding:</strong> {botData.inputs.resourcePlanning.lifecycleDistributionPct[2].toFixed(1)}%</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Testing:</strong> {botData.inputs.resourcePlanning.lifecycleDistributionPct[3].toFixed(1)}%</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Deployment:</strong> {botData.inputs.resourcePlanning.lifecycleDistributionPct[4].toFixed(1)}%</div>
                    </div>
                </div>
            </div>

            {/* Work Schedule */}
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                marginBottom: "30px",
                border: "1px solid #334155"
            }}>
                <div style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "20px 30px",
                    fontWeight: "600",
                    fontSize: "18px"
                }}>
                    ⏰ Work Schedule
                </div>
                <div style={{ padding: "30px", color: "#e2e8f0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "16px" }}>
                        <div><strong style={{ color: "#f1f5f9" }}>Working Days/Month:</strong> {botData.inputs.resourcePlanning.workingDaysPerMonth.toFixed(0)}</div>
                        <div><strong style={{ color: "#f1f5f9" }}>Productive Hours/Day:</strong> {botData.inputs.resourcePlanning.productiveHoursPerDay.toFixed(1)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}