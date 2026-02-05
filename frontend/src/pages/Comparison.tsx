import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ContractProvider, useContract } from '../context/ContractContext';

export default function Comparison() {
    return (
        <ContractProvider>
            <ComparisonContent />
        </ContractProvider>
    );
}

function ComparisonContent() {
    const location = useLocation();
    const navigate = useNavigate();
    const [botData, setBotData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState([]);

    // Check if this is multiplayer comparison
    const isMultiplayer = location.state?.isMultiplayer || false;

    // Get current contract context for fresh comparison
    const {
        getTotalResourceCost,
        getOnsiteCoordinatorCost,
        getTotalInfrastructureCost,
        getTotalSubContractCost,
        getTotalContingencyCost,
        getTotalProjectManagementCost,
        getResourceCostAfterSubcontracting,
        overheadProfitInput,
        getTotalFinancingCharges,
        wbsInput,
        effortInput,
        resourcePlanningInput,
        resourceCostInput,
        projectManagementInput,
        heuristicInput,
        onsiteInput,
        subContractInput,
        riskInput,
        infrastructureInput,
        financingInput
    } = useContract();

    useEffect(() => {
        if (location.state?.botData && location.state?.userData) {
            setBotData(location.state.botData);
            setUserData(location.state.userData);
            setLeaderboardData(location.state.leaderboardData || []);
        } else {
            navigate("/");
        }
    }, [location.state, navigate]);

    const isRecompete = location.state?.isRecompete;

    if (!botData || !userData) {
        return <div>Loading...</div>;
    }

    const ComparisonRow = ({ label, userValue, botValue, unit = "", isPercentage = false, isCurrency = false }) => {
        const userNum = typeof userValue === 'number' ? userValue : parseFloat(userValue) || 0;
        const botNum = typeof botValue === 'number' ? botValue : parseFloat(botValue) || 0;

        let userDisplay = userValue;
        let botDisplay = botValue;
        let advantage = "neutral";

        if (isCurrency) {
            userDisplay = `$${userNum.toFixed(0)}`;
            botDisplay = `$${botNum.toFixed(0)}`;
            advantage = userNum < botNum ? "user" : userNum > botNum ? "bot" : "neutral";
        } else if (isPercentage) {
            userDisplay = `${userNum.toFixed(1)}%`;
            botDisplay = `${botNum.toFixed(1)}%`;
            advantage = userNum < botNum ? "user" : userNum > botNum ? "bot" : "neutral";
        } else if (typeof userValue === 'number') {
            userDisplay = userNum.toFixed(1);
            botDisplay = botNum.toFixed(1);
            advantage = userNum < botNum ? "user" : userNum > botNum ? "bot" : "neutral";
        }

        const getAdvantageColor = (isUser) => {
            if (advantage === "neutral") return "#94a3b8";
            if (advantage === "user") return isUser ? "#10b981" : "#ef4444";
            return isUser ? "#ef4444" : "#10b981";
        };

        const advantageText = advantage === "user" ? "You Win" : advantage === "bot" ? (isMultiplayer ? "They Win" : "Bot Wins") : "Tie";

        return (
            <tr>
                <td style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #334155",
                    backgroundColor: "#1e293b",
                    color: "#e2e8f0",
                    fontWeight: "500"
                }}>
                    {label}
                </td>
                <td style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #334155",
                    borderLeft: "1px solid #334155",
                    textAlign: "center",
                    backgroundColor: "#0f172a",
                    color: getAdvantageColor(true),
                    fontWeight: "600"
                }}>
                    {userDisplay}{unit}
                </td>
                <td style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #334155",
                    borderLeft: "1px solid #334155",
                    textAlign: "center",
                    backgroundColor: "#0f172a",
                    color: getAdvantageColor(false),
                    fontWeight: "600"
                }}>
                    {botDisplay}{unit}
                </td>
                <td style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #334155",
                    borderLeft: "1px solid #334155",
                    textAlign: "center",
                    backgroundColor: "#0f172a",
                    color: advantage === "user" ? "#10b981" : advantage === "bot" ? "#ef4444" : "#94a3b8",
                    fontWeight: "600",
                    fontSize: "14px"
                }}>
                    {advantageText}
                </td>
            </tr>
        );
    };

    const handleRecompete = () => {
        // Save bot data to localStorage for later comparison
        localStorage.setItem('savedBotForComparison', JSON.stringify({
            botData: botData,
            timestamp: Date.now()
        }));

        // Navigate back to contract form with a flag indicating re-compete mode
        navigate('/contract', {
            state: {
                recompeteMode: true,
                savedBotName: botData.name,
                message: `Bot strategy saved! Adjust your inputs and submit to compare against ${botData.name}.`
            }
        });
    };

    const getFreshUserData = () => {
        // Calculate current user bid based on current context
        const modules = ["Requirements", "Design", "Coding", "Testing", "Deployment"];
        const offshoreResourceCost = modules.reduce((total, module) => total + getResourceCostAfterSubcontracting(module), 0);
        const onsiteCost = getOnsiteCoordinatorCost();
        const infrastructureCost = getTotalInfrastructureCost();
        const subContractCost = getTotalSubContractCost();
        const contingencyCost = getTotalContingencyCost();
        const projectManagementCost = getTotalProjectManagementCost();

        const baseCosts = offshoreResourceCost + onsiteCost + infrastructureCost +
            subContractCost + contingencyCost + projectManagementCost;
        const overheadCost = baseCosts * (overheadProfitInput.overheadChargesPercentage / 100);
        const financingCost = getTotalFinancingCharges();
        const totalCostBeforeProfit = baseCosts + overheadCost + financingCost;
        const profitPercentageDecimal = overheadProfitInput.profitPercentage / 100;
        const finalBidPrice = totalCostBeforeProfit / (1 - profitPercentageDecimal);
        const profitAmount = finalBidPrice * profitPercentageDecimal;

        return {
            name: "You (Current)",
            bidPrice: finalBidPrice,
            profitPercentage: overheadProfitInput.profitPercentage,
            overheadPercentage: overheadProfitInput.overheadChargesPercentage,
            costOfCapital: financingInput.costOfCapital,
            baseCosts: baseCosts,
            overheadCost: overheadCost,
            financingCost: financingCost,
            profitAmount: profitAmount,
            isBot: false,
            rank: finalBidPrice < botData.bidPrice ? 1 : 2,
            inputs: {
                wbs: wbsInput,
                effort: effortInput,
                resourcePlanning: resourcePlanningInput,
                resourceCost: resourceCostInput,
                projectManagement: projectManagementInput,
                heuristic: heuristicInput,
                onsite: onsiteInput,
                subContract: subContractInput,
                risk: riskInput,
                infrastructure: infrastructureInput,
                financing: financingInput,
                overheadProfit: overheadProfitInput
            }
        };
    };

    const handleCompareAgain = () => {
        const freshUserData = getFreshUserData();
        const updatedBotData = {
            ...botData,
            rank: freshUserData.bidPrice < botData.bidPrice ? 2 : 1
        };

        // Update the current comparison with fresh data
        setUserData(freshUserData);
        setBotData(updatedBotData);
        setLeaderboardData([freshUserData, updatedBotData].sort((a, b) => a.bidPrice - b.bidPrice));
    };

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
                    onClick={() => {
                        if (isMultiplayer) {
                            // Multiplayer: go back to admin results
                            navigate("/admin-results");
                        } else {
                            // Single player: go back to contract with leaderboard
                            navigate("/contract", {
                                state: {
                                    showLeaderboard: true,
                                    leaderboardData: leaderboardData
                                }
                            });
                        }
                    }}
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
                        e.currentTarget.style.backgroundColor = "#334155";
                        e.currentTarget.style.borderColor = "#64748b";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#1e293b";
                        e.currentTarget.style.borderColor = "#475569";
                    }}
                >
                    ← Back to {isMultiplayer ? "Results" : "Leaderboard"}
                </button>

                <h1 style={{
                    fontSize: "2.5rem",
                    fontWeight: "600",
                    margin: "0 0 10px 0",
                    color: "#f1f5f9"
                }}>
                    📊 Comparative Analysis: You vs {botData.name}
                </h1>

                <div style={{
                    fontSize: "1.2rem",
                    color: "#94a3b8",
                    marginBottom: "20px"
                }}>
                    {isRecompete ?
                        `🎯 Re-compete Results: Your updated strategy vs ${botData.name}` :
                        isMultiplayer ?
                            `Analyzing your strategy against ${botData.name}` :
                            `Analyzing why ${botData.name} (Rank #${botData.rank}) outperformed your bid (Rank #${userData.rank})`
                    }
                </div>

                {/* Summary Cards */}
                <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
                    <div style={{
                        flex: 1,
                        backgroundColor: userData.bidPrice < botData.bidPrice ? "#10b981" : "#7f1d1d",
                        padding: "20px",
                        borderRadius: "12px",
                        border: userData.bidPrice < botData.bidPrice ? "1px solid #10b981" : "1px solid #ef4444"
                    }}>
                        <h3 style={{ margin: "0 0 10px 0", color: userData.bidPrice < botData.bidPrice ? "white" : "#fecaca" }}>
                            {isRecompete ? "Your Updated Bid" : "Your Bid"}
                        </h3>
                        <div style={{ fontSize: "24px", fontWeight: "700", color: userData.bidPrice < botData.bidPrice ? "white" : "#fecaca" }}>
                            ${userData.bidPrice.toFixed(0)}
                        </div>
                        <div style={{ fontSize: "14px", color: userData.bidPrice < botData.bidPrice ? "rgba(255,255,255,0.8)" : "#fecaca" }}>
                            Profit: {userData.profitPercentage.toFixed(1)}% | Overhead: {userData.overheadPercentage.toFixed(1)}%
                        </div>
                    </div>
                    <div style={{
                        flex: 1,
                        backgroundColor: botData.bidPrice < userData.bidPrice ? "#10b981" : "#1e293b",
                        padding: "20px",
                        borderRadius: "12px",
                        border: botData.bidPrice < userData.bidPrice ? "1px solid #10b981" : "1px solid #334155"
                    }}>
                        <h3 style={{ margin: "0 0 10px 0", color: botData.bidPrice < userData.bidPrice ? "white" : "#3b82f6" }}>{botData.name}</h3>
                        <div style={{ fontSize: "24px", fontWeight: "700", color: botData.bidPrice < userData.bidPrice ? "white" : "#f1f5f9" }}>
                            ${botData.bidPrice.toFixed(0)}
                        </div>
                        <div style={{ fontSize: "14px", color: botData.bidPrice < userData.bidPrice ? "rgba(255,255,255,0.8)" : "#94a3b8" }}>
                            Profit: {botData.profitPercentage.toFixed(1)}% | Overhead: {botData.overheadPercentage.toFixed(1)}%
                        </div>
                    </div>
                    <div style={{
                        flex: 1,
                        backgroundColor: userData.bidPrice < botData.bidPrice ? "#10b981" : "#7f1d1d",
                        padding: "20px",
                        borderRadius: "12px",
                        border: userData.bidPrice < botData.bidPrice ? "1px solid #10b981" : "1px solid #ef4444"
                    }}>
                        <h3 style={{ margin: "0 0 10px 0", color: userData.bidPrice < botData.bidPrice ? "white" : "#fecaca" }}>
                            {userData.bidPrice < botData.bidPrice ? "🎉 You Won!" : "Difference"}
                        </h3>
                        <div style={{ fontSize: "24px", fontWeight: "700", color: userData.bidPrice < botData.bidPrice ? "white" : "#fecaca" }}>
                            {userData.bidPrice < botData.bidPrice ?
                                `-$${(botData.bidPrice - userData.bidPrice).toFixed(0)}` :
                                `$${(userData.bidPrice - botData.bidPrice).toFixed(0)}`
                            }
                        </div>
                        <div style={{ fontSize: "14px", color: userData.bidPrice < botData.bidPrice ? "rgba(255,255,255,0.8)" : "#fecaca" }}>
                            {userData.bidPrice < botData.bidPrice ?
                                `You bid ${((botData.bidPrice / userData.bidPrice - 1) * 100).toFixed(1)}% lower` :
                                `You bid ${((userData.bidPrice / botData.bidPrice - 1) * 100).toFixed(1)}% higher`
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Comparison */}
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
                    💰 Financial Strategy Comparison
                </div>
                <div style={{
                    backgroundColor: "#0f172a",
                    borderRadius: "0 0 12px 12px",
                    overflow: "hidden"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    fontWeight: "600",
                                    color: "#f1f5f9",
                                    textAlign: "left"
                                }}>
                                    Metric
                                </th>
                                <th style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    color: "#f1f5f9",
                                    textAlign: "center"
                                }}>
                                    Your Value
                                </th>
                                <th style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    color: "#f1f5f9",
                                    textAlign: "center"
                                }}>
                                    {botData.name}
                                </th>
                                <th style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    color: "#f1f5f9",
                                    textAlign: "center"
                                }}>
                                    Advantage
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <ComparisonRow
                                label="Final Bid Price"
                                userValue={userData.bidPrice}
                                botValue={botData.bidPrice}
                                isCurrency={true}
                            />
                            <ComparisonRow
                                label="Profit Percentage"
                                userValue={userData.profitPercentage}
                                botValue={botData.profitPercentage}
                                isPercentage={true}
                            />
                            <ComparisonRow
                                label="Overhead Percentage"
                                userValue={userData.overheadPercentage}
                                botValue={botData.overheadPercentage}
                                isPercentage={true}
                            />
                            <ComparisonRow
                                label="Cost of Capital"
                                userValue={userData.inputs.financing.costOfCapital}
                                botValue={botData.inputs.financing.costOfCapital}
                                isPercentage={true}
                            />
                            <ComparisonRow
                                label="Base Costs"
                                userValue={userData.baseCosts}
                                botValue={botData.baseCosts}
                                isCurrency={true}
                            />
                            <ComparisonRow
                                label="Financing Cost"
                                userValue={userData.financingCost}
                                botValue={botData.financingCost}
                                isCurrency={true}
                            />
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Resource Strategy Comparison */}
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
                    👥 Resource Strategy Comparison
                </div>
                <div style={{
                    backgroundColor: "#0f172a",
                    borderRadius: "0 0 12px 12px",
                    overflow: "hidden"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    fontWeight: "600",
                                    color: "#f1f5f9",
                                    textAlign: "left"
                                }}>
                                    Metric
                                </th>
                                <th style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    color: "#f1f5f9",
                                    textAlign: "center"
                                }}>
                                    Your Value
                                </th>
                                <th style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    color: "#f1f5f9",
                                    textAlign: "center"
                                }}>
                                    {botData.name}
                                </th>
                                <th style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    color: "#f1f5f9",
                                    textAlign: "center"
                                }}>
                                    Advantage
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <ComparisonRow
                                label="Estimation Accuracy"
                                userValue={userData.inputs.effort.estimationAccuracyPct}
                                botValue={botData.inputs.effort.estimationAccuracyPct}
                                isPercentage={true}
                            />
                            <ComparisonRow
                                label="Permanent vs Temp Ratio"
                                userValue={userData.inputs.resourceCost.permanentVsTempRatio}
                                botValue={botData.inputs.resourceCost.permanentVsTempRatio}
                                unit="% permanent"
                            />
                            <ComparisonRow
                                label="Permanent Salary"
                                userValue={userData.inputs.resourceCost.permanentMonthlySalary}
                                botValue={botData.inputs.resourceCost.permanentMonthlySalary}
                                isCurrency={true}
                            />
                            <ComparisonRow
                                label="Temporary Salary"
                                userValue={userData.inputs.resourceCost.temporaryMonthlySalary}
                                botValue={botData.inputs.resourceCost.temporaryMonthlySalary}
                                isCurrency={true}
                            />
                            <ComparisonRow
                                label="Team Members per Team"
                                userValue={userData.inputs.projectManagement.teamMembersPerTeam}
                                botValue={botData.inputs.projectManagement.teamMembersPerTeam}
                            />
                            <ComparisonRow
                                label="Team Lead Salary"
                                userValue={userData.inputs.projectManagement.teamLeadSalary}
                                botValue={botData.inputs.projectManagement.teamLeadSalary}
                                isCurrency={true}
                            />
                            <ComparisonRow
                                label="PM Salary"
                                userValue={userData.inputs.projectManagement.pmSalary}
                                botValue={botData.inputs.projectManagement.pmSalary}
                                isCurrency={true}
                            />
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Operational Strategy Comparison */}
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
                    🏗️ Operational Strategy Comparison
                </div>
                <div style={{
                    backgroundColor: "#0f172a",
                    borderRadius: "0 0 12px 12px",
                    overflow: "hidden"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    fontWeight: "600",
                                    color: "#f1f5f9",
                                    textAlign: "left"
                                }}>
                                    Metric
                                </th>
                                <th style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    color: "#f1f5f9",
                                    textAlign: "center"
                                }}>
                                    Your Value
                                </th>
                                <th style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    color: "#f1f5f9",
                                    textAlign: "center"
                                }}>
                                    {botData.name}
                                </th>
                                <th style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    color: "#f1f5f9",
                                    textAlign: "center"
                                }}>
                                    Advantage
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <ComparisonRow
                                label="Heuristic Buffer"
                                userValue={userData.inputs.heuristic.heuristicPct}
                                botValue={botData.inputs.heuristic.heuristicPct}
                                isPercentage={true}
                            />
                            <ComparisonRow
                                label="Infrastructure Cost/Resource"
                                userValue={userData.inputs.infrastructure.costPerResource}
                                botValue={botData.inputs.infrastructure.costPerResource}
                                isCurrency={true}
                            />
                            <ComparisonRow
                                label="Onsite Coordinator Salary"
                                userValue={userData.inputs.onsite.onsiteCoordinatorSalary}
                                botValue={botData.inputs.onsite.onsiteCoordinatorSalary}
                                isCurrency={true}
                            />
                            <ComparisonRow
                                label="Working Days per Month"
                                userValue={userData.inputs.resourcePlanning.workingDaysPerMonth}
                                botValue={botData.inputs.resourcePlanning.workingDaysPerMonth}
                            />
                            <ComparisonRow
                                label="Productive Hours per Day"
                                userValue={userData.inputs.resourcePlanning.productiveHoursPerDay}
                                botValue={botData.inputs.resourcePlanning.productiveHoursPerDay}
                            />
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Key Insights */}
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                padding: "30px",
                border: "1px solid #334155",
                marginBottom: "30px"
            }}>
                <h3 style={{
                    margin: "0 0 20px 0",
                    color: "#f1f5f9",
                    fontSize: "18px",
                    fontWeight: "600"
                }}>
                    🎯 Key Insights & Recommendations
                </h3>
                <div style={{ fontSize: "14px", color: "#e2e8f0", lineHeight: "1.6" }}>
                    <div style={{ marginBottom: "15px" }}>
                        <strong style={{ color: "#f1f5f9" }}>Price Difference:</strong> {botData.name} bid ${(userData.bidPrice - botData.bidPrice).toFixed(0)} less than you,
                        representing a {((userData.bidPrice / botData.bidPrice - 1) * 100).toFixed(1)}% cost advantage.
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <strong style={{ color: "#f1f5f9" }}>Profit Strategy:</strong> {botData.name} targeted {botData.profitPercentage.toFixed(1)}% profit vs your {userData.profitPercentage.toFixed(1)}%,
                        {botData.profitPercentage < userData.profitPercentage ? " showing more aggressive pricing." : " showing higher profit expectations."}
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <strong style={{ color: "#f1f5f9" }}>Resource Efficiency:</strong> {botData.name} used {botData.inputs.resourceCost.permanentVsTempRatio.toFixed(0)}% permanent staff vs your {userData.inputs.resourceCost.permanentVsTempRatio.toFixed(0)}%,
                        with permanent salaries at ${botData.inputs.resourceCost.permanentMonthlySalary.toFixed(0)} vs your ${userData.inputs.resourceCost.permanentMonthlySalary.toFixed(0)}.
                    </div>
                    <div>
                        <strong style={{ color: "#f1f5f9" }}>Recommendation:</strong> Consider adjusting your profit margins, salary structures, or operational efficiency to compete more effectively in future bids.
                    </div>
                </div>
            </div>

            {/* Re-compete Section */}
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                padding: "30px",
                border: "1px solid #334155",
                marginBottom: "30px"
            }}>
                <h3 style={{
                    margin: "0 0 20px 0",
                    color: "#f1f5f9",
                    fontSize: "18px",
                    fontWeight: "600"
                }}>
                    🔄 Want to Try Again?
                </h3>
                <div style={{
                    fontSize: "14px",
                    color: "#e2e8f0",
                    lineHeight: "1.6",
                    marginBottom: "20px"
                }}>
                    <p style={{ margin: "0 0 12px 0" }}>
                        Based on this analysis, you have two options:
                    </p>
                    <ul style={{ margin: "0", paddingLeft: "20px" }}>
                        <li style={{ marginBottom: "8px" }}>
                            <strong style={{ color: "#10b981" }}>Adjust & Re-compete:</strong> Go back to modify your inputs and submit a new bid
                        </li>
                        <li>
                            <strong style={{ color: "#3b82f6" }}>Compare Current:</strong> See how your current inputs (if changed) compare right now
                        </li>
                    </ul>
                </div>

                <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                    <button
                        onClick={() => handleRecompete()}
                        style={{
                            padding: "12px 24px",
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "600",
                            transition: "all 0.2s ease",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#059669";
                            e.target.style.transform = "translateY(-1px)";
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = "#10b981";
                            e.target.style.transform = "translateY(0)";
                        }}
                    >
                        🎯 Adjust My Strategy & Re-compete
                    </button>

                    <button
                        onClick={() => handleCompareAgain()}
                        style={{
                            padding: "12px 24px",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "600",
                            transition: "all 0.2s ease",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                        }}
                        onMouseOver={(e) => {
                            const target = e.currentTarget as HTMLButtonElement;
                            target.style.backgroundColor = "#2563eb";
                            target.style.transform = "translateY(-1px)";
                        }}
                        onMouseOut={(e) => {
                            const target = e.currentTarget as HTMLButtonElement;
                            target.style.backgroundColor = "#3b82f6";
                            target.style.transform = "translateY(0)";
                        }}
                    >
                        🔄 Compare with Current Inputs
                    </button>

                    <div style={{
                        padding: "8px 16px",
                        backgroundColor: "#0f172a",
                        borderRadius: "6px",
                        border: "1px solid #334155",
                        fontSize: "12px",
                        color: "#94a3b8"
                    }}>
                        {botData.name}'s strategy will be saved for comparison
                    </div>
                </div>
            </div>
        </div>
    );
}