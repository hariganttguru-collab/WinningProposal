import { useContract } from '../context/ContractContext';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLobby } from '../context/LobbyContext';

interface BidData {
    name?: string;
    username?: string;
    userId?: string;
    bidPrice: number | null;
    profitPercentage: number | null;
    overheadPercentage: number | null;
    costOfCapital?: number;
    baseCosts?: number;
    overheadCost?: number;
    financingCost?: number;
    profitAmount?: number;
    isBot?: boolean;
    isCurrentUser?: boolean;
    isWaiting?: boolean;
    rank?: number;
    submittedAt?: number;
    inputs?: any;
}

export default function FinalBidSummaryForm() {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState<BidData[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const { currentLobby } = useLobby();

    // Check if we're in multiplayer mode
    const isMultiplayerMode = searchParams.get('mode') === 'MULTI' && currentLobby;

    // Check if we're returning from bot strategy page with leaderboard data
    useEffect(() => {
        if (location.state?.showLeaderboard && location.state?.leaderboardData) {
            setShowLeaderboard(true);
            setLeaderboardData(location.state.leaderboardData);
        }
    }, [location.state]);

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
        getTotalProjectCostWithOverhead,
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
        financingInput,
        saveCurrentState
    } = useContract();

    // Calculate all cost components
    const modules = ["Requirements", "Design", "Coding", "Testing", "Deployment"];
    const offshoreResourceCost = modules.reduce((total, module) => total + getResourceCostAfterSubcontracting(module), 0);
    const onsiteCost = getOnsiteCoordinatorCost();
    const infrastructureCost = getTotalInfrastructureCost();
    const subContractCost = getTotalSubContractCost();
    const contingencyCost = getTotalContingencyCost();
    const projectManagementCost = getTotalProjectManagementCost();

    // Calculate overhead cost (base costs * overhead percentage)
    const baseCosts = offshoreResourceCost + onsiteCost + infrastructureCost +
        subContractCost + contingencyCost + projectManagementCost;
    const overheadCost = baseCosts * (overheadProfitInput.overheadChargesPercentage / 100);

    // Get financing cost
    const financingCost = getTotalFinancingCharges();

    // Calculate total cost before profit
    const totalCostBeforeProfit = baseCosts + overheadCost + financingCost;

    // Calculate final bid price to achieve the desired profit percentage
    // If profit should be X% of final bid, then: Bid Price = Total Costs ÷ (1 - X%)
    const profitPercentageDecimal = overheadProfitInput.profitPercentage / 100;
    const finalBidPrice = totalCostBeforeProfit / (1 - profitPercentageDecimal);

    // Calculate profit amount (should be exactly the desired percentage of bid price)
    const profitAmount = finalBidPrice * profitPercentageDecimal;

    // Cost components for the table
    const costComponents = [
        { name: "Offshore Cost", cost: offshoreResourceCost },
        { name: "Onsite Cost", cost: onsiteCost },
        { name: "Infrastructure cost", cost: infrastructureCost },
        { name: "Sub -contract", cost: subContractCost },
        { name: "Contigency Cost", cost: contingencyCost },
        { name: "Project Management cost", cost: projectManagementCost },
        { name: "Overhead Cost", cost: overheadCost },
        { name: "Financing Cost", cost: financingCost },
        { name: "Profit", cost: profitAmount }
    ];

    // Generate bot bids
    const generateBotBids = () => {
        const bots = [];

        for (let i = 1; i <= 9; i++) {
            // Generate random variations for each bot
            const botOverheadPct = 2 + Math.random() * 4; // 2-6%
            const botProfitPct = 15 + Math.random() * 20; // 15-35%
            const botCostOfCapital = 8 + Math.random() * 6; // 8-14%

            // Vary some base costs slightly
            const costVariation = 0.9 + Math.random() * 0.2; // 90-110% of base costs
            const botBaseCosts = baseCosts * costVariation;
            const botOverheadCost = botBaseCosts * (botOverheadPct / 100);
            const botFinancingCost = financingCost * (0.8 + Math.random() * 0.4); // 80-120% of user's financing

            const botTotalCostBeforeProfit = botBaseCosts + botOverheadCost + botFinancingCost;
            const botFinalBidPrice = botTotalCostBeforeProfit / (1 - botProfitPct / 100);
            const botProfitAmount = botFinalBidPrice * (botProfitPct / 100);

            bots.push({
                name: `Bot ${i}`,
                bidPrice: botFinalBidPrice,
                profitPercentage: botProfitPct,
                overheadPercentage: botOverheadPct,
                costOfCapital: botCostOfCapital,
                baseCosts: botBaseCosts,
                overheadCost: botOverheadCost,
                financingCost: botFinancingCost,
                profitAmount: botProfitAmount,
                isBot: true,
                inputs: {
                    // Generate realistic bot inputs
                    wbs: {
                        quantities: Object.fromEntries(
                            Object.entries(wbsInput.quantities).map(([key, value]) => [
                                key, Math.max(1, Math.round(value * (0.8 + Math.random() * 0.4)))
                            ])
                        )
                    },
                    effort: {
                        estimationAccuracyPct: 60 + Math.random() * 30,
                        productivity: Object.fromEntries(
                            Object.keys(effortInput.productivity).map(key => [
                                key, ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
                            ])
                        )
                    },
                    resourcePlanning: {
                        lifecycleDistributionPct: [
                            5 + Math.random() * 10,
                            10 + Math.random() * 10,
                            30 + Math.random() * 20,
                            20 + Math.random() * 15,
                            5 + Math.random() * 10
                        ],
                        workingDaysPerMonth: 20 + Math.random() * 4,
                        productiveHoursPerDay: 6 + Math.random() * 2
                    },
                    resourceCost: {
                        permanentVsTempRatio: 60 + Math.random() * 40,
                        permanentMonthlySalary: 1200 + Math.random() * 400,
                        temporaryMonthlySalary: 900 + Math.random() * 400
                    },
                    projectManagement: {
                        teamMembersPerTeam: 8 + Math.random() * 6,
                        teamLeadSalary: 2000 + Math.random() * 1000,
                        teamLeadsPerManager: 10 + Math.random() * 6,
                        pmSalary: 3000 + Math.random() * 1000
                    },
                    heuristic: {
                        heuristicPct: 5 + Math.random() * 10
                    },
                    onsite: {
                        onsiteOffshoreRatio: 10 + Math.random() * 8,
                        onsiteCoordinatorSalary: 3500 + Math.random() * 1000
                    },
                    subContract: {
                        selectedSubcontractors: Object.fromEntries(
                            ["Requirements", "Design", "Coding", "Testing", "Deployment"].map(module => [
                                module, Math.random() < 0.3 ? ["SubCon-1", "SubCon-2", "SubCon-3"][Math.floor(Math.random() * 3)] : "None"
                            ])
                        )
                    },
                    risk: {
                        riskRatings: Object.fromEntries(
                            ["Requirements", "Design", "Coding", "Testing", "Deployment"].map(module => [
                                module, ["Insignificant", "Minor", "Significant", "Major", "Catastrophic", "None"][Math.floor(Math.random() * 6)]
                            ])
                        )
                    },
                    infrastructure: {
                        costPerResource: 400 + Math.random() * 200
                    },
                    financing: {
                        costOfCapital: botCostOfCapital,
                        cashInPercentages: (() => {
                            const percentages = [
                                Math.random() * 15,
                                5 + Math.random() * 15,
                                10 + Math.random() * 20,
                                20 + Math.random() * 30,
                                20 + Math.random() * 30
                            ];
                            const total = percentages.reduce((sum, val) => sum + val, 0);
                            return percentages.map(val => Math.round((val / total) * 100));
                        })()
                    },
                    overheadProfit: {
                        overheadChargesPercentage: botOverheadPct,
                        profitPercentage: botProfitPct
                    }
                }
            });
        }

        return bots;
    };

    const showComparison = (bot) => {
        const userBid = leaderboardData.find(b => b.name === "You");
        navigate('/comparison', {
            state: {
                botData: bot,
                userData: userBid,
                leaderboardData: leaderboardData
            }
        });
    };

    const showMultiplayerComparison = (otherPlayerBid) => {
        const currentUserBid = leaderboardData.find(b => b.isCurrentUser);

        // Format player bids for comparison page (which expects bot/user format)
        const formattedOtherPlayer = {
            name: otherPlayerBid.username,
            bidPrice: otherPlayerBid.bidPrice,
            profitPercentage: otherPlayerBid.profitPercentage,
            overheadPercentage: otherPlayerBid.overheadPercentage,
            costOfCapital: otherPlayerBid.inputs.financing.costOfCapital,
            baseCosts: otherPlayerBid.baseCosts,
            overheadCost: otherPlayerBid.overheadCost,
            financingCost: otherPlayerBid.financingCost,
            profitAmount: otherPlayerBid.profitAmount,
            isBot: false,
            rank: otherPlayerBid.rank,
            inputs: otherPlayerBid.inputs
        };

        const formattedCurrentUser = {
            name: "You",
            bidPrice: currentUserBid.bidPrice,
            profitPercentage: currentUserBid.profitPercentage,
            overheadPercentage: currentUserBid.overheadPercentage,
            costOfCapital: currentUserBid.inputs.financing.costOfCapital,
            baseCosts: currentUserBid.baseCosts,
            overheadCost: currentUserBid.overheadCost,
            financingCost: currentUserBid.financingCost,
            profitAmount: currentUserBid.profitAmount,
            isBot: false,
            rank: currentUserBid.rank,
            inputs: currentUserBid.inputs
        };

        navigate('/comparison', {
            state: {
                botData: formattedOtherPlayer,
                userData: formattedCurrentUser,
                leaderboardData: leaderboardData,
                isMultiplayer: true
            }
        });
    };

    const showDetailedStrategy = (bot) => {
        const strategyDetails = `🤖 ${bot.name} - Detailed Strategy Analysis

💰 FINAL BID BREAKDOWN:
• Final Bid Price: $${bot.bidPrice.toFixed(0)}
• Base Costs: $${bot.baseCosts.toFixed(0)}
• Overhead (${bot.overheadPercentage.toFixed(1)}%): $${bot.overheadCost.toFixed(0)}
• Financing Cost: $${bot.financingCost.toFixed(0)}
• Profit (${bot.profitPercentage.toFixed(1)}%): $${bot.profitAmount.toFixed(0)}

📊 KEY STRATEGY DECISIONS:
• Estimation Accuracy: ${bot.inputs.effort.estimationAccuracyPct.toFixed(0)}%
• Permanent vs Temp Staff: ${bot.inputs.resourceCost.permanentVsTempRatio.toFixed(0)}% permanent
• Permanent Salary: $${bot.inputs.resourceCost.permanentMonthlySalary.toFixed(0)}
• Temporary Salary: $${bot.inputs.resourceCost.temporaryMonthlySalary.toFixed(0)}
• Heuristic Buffer: ${bot.inputs.heuristic.heuristicPct.toFixed(1)}%
• Infrastructure Cost/Resource: $${bot.inputs.infrastructure.costPerResource.toFixed(0)}

👥 PROJECT MANAGEMENT APPROACH:
• Team Members per Team: ${bot.inputs.projectManagement.teamMembersPerTeam.toFixed(0)}
• Team Lead Salary: $${bot.inputs.projectManagement.teamLeadSalary.toFixed(0)}
• Team Leads per Manager: ${bot.inputs.projectManagement.teamLeadsPerManager.toFixed(0)}
• PM Salary: $${bot.inputs.projectManagement.pmSalary.toFixed(0)}

🌍 ONSITE STRATEGY:
• Onsite/Offshore Ratio: 1:${bot.inputs.onsite.onsiteOffshoreRatio.toFixed(0)}
• Onsite Coordinator Salary: $${bot.inputs.onsite.onsiteCoordinatorSalary.toFixed(0)}

📈 FINANCING APPROACH:
• Cost of Capital: ${bot.inputs.financing.costOfCapital.toFixed(1)}%
• Cash In Distribution: [${bot.inputs.financing.cashInPercentages.join('%, ')}%]

🏗️ SUBCONTRACTING DECISIONS:
${Object.entries(bot.inputs.subContract.selectedSubcontractors)
                .map(([module, choice]) => `• ${module}: ${choice}`)
                .join('\n')}

⚠️ RISK MANAGEMENT:
${Object.entries(bot.inputs.risk.riskRatings)
                .map(([module, rating]) => `• ${module}: ${rating}`)
                .join('\n')}

📋 WBS QUANTITIES:
${Object.entries(bot.inputs.wbs.quantities)
                .map(([deliverable, qty]) => `• ${deliverable}: ${qty}`)
                .join('\n')}

🎯 PRODUCTIVITY LEVELS:
${Object.entries(bot.inputs.effort.productivity)
                .map(([deliverable, level]) => `• ${deliverable}: ${level}`)
                .join('\n')}

📅 LIFECYCLE DISTRIBUTION:
• Requirements: ${bot.inputs.resourcePlanning.lifecycleDistributionPct[0].toFixed(1)}%
• Design: ${bot.inputs.resourcePlanning.lifecycleDistributionPct[1].toFixed(1)}%
• Coding: ${bot.inputs.resourcePlanning.lifecycleDistributionPct[2].toFixed(1)}%
• Testing: ${bot.inputs.resourcePlanning.lifecycleDistributionPct[3].toFixed(1)}%
• Deployment: ${bot.inputs.resourcePlanning.lifecycleDistributionPct[4].toFixed(1)}%

⏰ WORK SCHEDULE:
• Working Days/Month: ${bot.inputs.resourcePlanning.workingDaysPerMonth.toFixed(0)}
• Productive Hours/Day: ${bot.inputs.resourcePlanning.productiveHoursPerDay.toFixed(1)}
        `;

        navigate('/bot-strategy', {
            state: {
                botData: bot,
                leaderboardData: leaderboardData
            }
        });
    };

    const handleSubmitBid = () => {
        // Save current state before processing
        saveCurrentState();

        // MULTIPLAYER MODE: Store player bid and show leaderboard
        if (isMultiplayerMode && user && currentLobby) {
            const playerBid = {
                userId: user.id,
                username: user.username,
                bidPrice: finalBidPrice,
                profitPercentage: overheadProfitInput.profitPercentage,
                overheadPercentage: overheadProfitInput.overheadChargesPercentage,
                costOfCapital: financingInput.costOfCapital,
                baseCosts: baseCosts,
                overheadCost: overheadCost,
                financingCost: financingCost,
                profitAmount: profitAmount,
                submittedAt: Date.now(),
                isCurrentUser: true,
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

            // Store this player's bid
            localStorage.setItem(`lobby_${currentLobby.code}_bid_${user.id}`, JSON.stringify(playerBid));

            // Build leaderboard with all players (submitted and waiting)
            const allPlayers = currentLobby.players.filter(p => p.role !== 'admin');
            const leaderboard = allPlayers.map(p => {
                const bidData = localStorage.getItem(`lobby_${currentLobby.code}_bid_${p.id}`);
                if (bidData) {
                    const bid = JSON.parse(bidData);
                    bid.isCurrentUser = bid.userId === user.id;
                    return bid;
                } else {
                    // Player hasn't submitted yet
                    return {
                        userId: p.id,
                        username: p.username,
                        bidPrice: null,
                        profitPercentage: null,
                        overheadPercentage: null,
                        isWaiting: true,
                        isCurrentUser: p.id === user.id
                    };
                }
            });

            // Sort: submitted bids first (by price), then waiting players
            const submittedBids = leaderboard.filter(b => !b.isWaiting).sort((a, b) => a.bidPrice! - b.bidPrice!);
            const waitingPlayers = leaderboard.filter(b => b.isWaiting);

            // Add bots if total players < 5 (generate once and store)
            const totalPlayers = allPlayers.length;
            const botsNeeded = Math.max(0, 5 - totalPlayers);
            let botBids: BidData[] = [];

            if (botsNeeded > 0) {
                // Check if bots already exist for this lobby
                const storedBots = localStorage.getItem(`lobby_${currentLobby.code}_bots`);
                if (storedBots) {
                    botBids = JSON.parse(storedBots);
                } else {
                    // Generate new bots and store them
                    botBids = generateBotBids().slice(0, botsNeeded);
                    localStorage.setItem(`lobby_${currentLobby.code}_bots`, JSON.stringify(botBids));
                }
            }

            // Combine all bids and sort
            const allBids = [...submittedBids, ...botBids].sort((a, b) => a.bidPrice! - b.bidPrice!);

            // Assign ranks to all submitted bids (players + bots)
            allBids.forEach((bid, index) => {
                bid.rank = index + 1;
            });

            const finalLeaderboard = [...allBids, ...waitingPlayers];
            setLeaderboardData(finalLeaderboard);
            setShowLeaderboard(true);

            // Start polling for other submissions
            const pollInterval = setInterval(() => {
                const updatedLeaderboard = allPlayers.map(p => {
                    const bidData = localStorage.getItem(`lobby_${currentLobby.code}_bid_${p.id}`);
                    if (bidData) {
                        const bid = JSON.parse(bidData);
                        bid.isCurrentUser = bid.userId === user.id;
                        return bid;
                    } else {
                        return {
                            userId: p.id,
                            username: p.username,
                            bidPrice: null,
                            profitPercentage: null,
                            overheadPercentage: null,
                            isWaiting: true,
                            isCurrentUser: p.id === user.id
                        };
                    }
                });

                const updatedSubmitted = updatedLeaderboard.filter(b => !b.isWaiting).sort((a, b) => a.bidPrice! - b.bidPrice!);
                const updatedWaiting = updatedLeaderboard.filter(b => b.isWaiting);

                // Add bots if total players < 5 (retrieve stored bots)
                const totalPlayers = allPlayers.length;
                const botsNeeded = Math.max(0, 5 - totalPlayers);
                let botBids: BidData[] = [];

                if (botsNeeded > 0) {
                    const storedBots = localStorage.getItem(`lobby_${currentLobby.code}_bots`);
                    if (storedBots) {
                        botBids = JSON.parse(storedBots);
                    }
                }

                // Combine all bids and sort
                const allBids = [...updatedSubmitted, ...botBids].sort((a, b) => a.bidPrice! - b.bidPrice!);

                allBids.forEach((bid, index) => {
                    bid.rank = index + 1;
                });

                const updatedFinal = [...allBids, ...updatedWaiting];
                setLeaderboardData(updatedFinal);

                // Stop polling if all submitted
                if (updatedWaiting.length === 0) {
                    clearInterval(pollInterval);
                }
            }, 1000);

            // Clean up interval after 5 minutes
            setTimeout(() => clearInterval(pollInterval), 300000);

            return;
        }

        // Check if we're in re-compete mode
        const savedBotData = localStorage.getItem('savedBotForComparison');

        if (savedBotData) {
            const { botData } = JSON.parse(savedBotData);

            // Create user bid for comparison
            const userBid = {
                name: "You (Updated)",
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

            // Update bot rank based on comparison
            const updatedBotData = {
                ...botData,
                rank: finalBidPrice < botData.bidPrice ? 2 : 1
            };

            // Clear saved bot data
            localStorage.removeItem('savedBotForComparison');

            // Navigate directly to comparison with updated data
            navigate('/comparison', {
                state: {
                    botData: updatedBotData,
                    userData: userBid,
                    isRecompete: true,
                    leaderboardData: [userBid, updatedBotData].sort((a, b) => a.bidPrice - b.bidPrice)
                }
            });
            return;
        }

        // Original bid submission logic (single player vs bots)
        const userBid = {
            name: "You",
            bidPrice: finalBidPrice,
            profitPercentage: overheadProfitInput.profitPercentage,
            overheadPercentage: overheadProfitInput.overheadChargesPercentage,
            costOfCapital: financingInput.costOfCapital,
            baseCosts: baseCosts,
            overheadCost: overheadCost,
            financingCost: financingCost,
            profitAmount: profitAmount,
            isBot: false,
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

        const botBids = generateBotBids();
        const allBids = [userBid, ...botBids];

        // Sort by bid price (lowest first)
        allBids.sort((a, b) => a.bidPrice - b.bidPrice);

        // Add rank
        allBids.forEach((bid, index) => {
            bid.rank = index + 1;
        });

        setLeaderboardData(allBids);
        setShowLeaderboard(true);
    };

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
                Final Bid Summary
            </div>

            <div style={{
                backgroundColor: "#1e293b",
                padding: "40px",
                borderRadius: "0 0 12px 12px",
                color: "#e2e8f0",
                border: "1px solid #334155",
                borderTop: "none"
            }}>

                {/* Final Bid Summary Table */}
                <div style={{
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                    border: "1px solid #334155"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    fontWeight: "600",
                                    textAlign: "left",
                                    color: "#f1f5f9",
                                    fontSize: "14px"
                                }}>
                                    Cost Component
                                </th>
                                <th style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    textAlign: "center",
                                    color: "#f1f5f9",
                                    fontSize: "14px"
                                }}>
                                    Cost in USD
                                </th>
                                <th style={{
                                    backgroundColor: "#1e293b",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    textAlign: "center",
                                    color: "#f1f5f9",
                                    fontSize: "14px"
                                }}>
                                    Cost Distribution
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {costComponents.map((component, index) => {
                                const percentage = (component.cost / finalBidPrice) * 100;
                                return (
                                    <tr key={component.name}>
                                        <td style={{
                                            padding: "12px 20px",
                                            borderBottom: "1px solid #334155",
                                            backgroundColor: "#1e293b",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {component.name}
                                        </td>
                                        <td style={{
                                            padding: "12px 20px",
                                            borderBottom: "1px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "right",
                                            backgroundColor: "#0f172a",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {component.cost.toFixed(0)}
                                        </td>
                                        <td style={{
                                            padding: "12px 20px",
                                            borderBottom: "1px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "right",
                                            backgroundColor: "#0f172a",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {percentage.toFixed(percentage < 1 ? 2 : 0)}%
                                        </td>
                                    </tr>
                                );
                            })}

                            {/* Final Bid Price Row */}
                            <tr style={{ backgroundColor: "#3b82f6" }}>
                                <td style={{
                                    padding: "20px",
                                    fontWeight: "700",
                                    fontSize: "16px",
                                    color: "white"
                                }}>
                                    BID PRICE
                                </td>
                                <td style={{
                                    padding: "20px",
                                    borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
                                    textAlign: "right",
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    color: "white"
                                }}>
                                    {finalBidPrice.toFixed(0)}
                                </td>
                                <td style={{
                                    padding: "20px",
                                    borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
                                    textAlign: "right",
                                    fontWeight: "700",
                                    color: "white"
                                }}>
                                    100%
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Additional Summary Info */}
                <div style={{
                    marginTop: "24px",
                    padding: "20px",
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    border: "1px solid #334155"
                }}>
                    <h4 style={{ margin: "0 0 16px 0", color: "#f1f5f9", fontSize: "16px", fontWeight: "600" }}>Summary</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "14px" }}>
                        <div style={{ color: "#e2e8f0" }}>
                            <strong style={{ color: "#f1f5f9" }}>Total Base Costs:</strong> ${baseCosts.toFixed(0)}
                        </div>
                        <div style={{ color: "#e2e8f0" }}>
                            <strong style={{ color: "#f1f5f9" }}>Overhead ({overheadProfitInput.overheadChargesPercentage}%):</strong> ${overheadCost.toFixed(0)}
                        </div>
                        <div style={{ color: "#e2e8f0" }}>
                            <strong style={{ color: "#f1f5f9" }}>Financing Charges:</strong> ${financingCost.toFixed(0)}
                        </div>
                        <div style={{ color: "#e2e8f0" }}>
                            <strong style={{ color: "#f1f5f9" }}>Profit ({overheadProfitInput.profitPercentage}%):</strong> ${profitAmount.toFixed(0)}
                        </div>
                        <div style={{
                            gridColumn: "1 / -1",
                            borderTop: "1px solid #334155",
                            paddingTop: "12px",
                            marginTop: "12px"
                        }}>
                            <strong style={{ fontSize: "16px", color: "#f1f5f9" }}>
                                Final Bid Price: ${finalBidPrice.toFixed(0)}
                            </strong>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div style={{ marginTop: "32px", textAlign: "center" }}>
                    <button
                        onClick={handleSubmitBid}
                        style={{
                            padding: "16px 40px",
                            fontSize: "18px",
                            fontWeight: "600",
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                            transition: "all 0.2s ease"
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
                        Submit Bid & Compete with Bots
                    </button>
                </div>

                {/* Leaderboard */}
                {showLeaderboard && (
                    <div style={{ marginTop: "40px" }}>
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
                            Competition Results - Leaderboard
                        </div>

                        <div style={{
                            backgroundColor: "#1e293b",
                            padding: "30px",
                            borderRadius: "0 0 12px 12px",
                            border: "1px solid #334155",
                            borderTop: "none"
                        }}>
                            <div style={{
                                backgroundColor: "#0f172a",
                                borderRadius: "12px",
                                overflow: "hidden",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                                border: "1px solid #334155"
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
                                                fontSize: "14px"
                                            }}>
                                                Rank
                                            </th>
                                            <th style={{
                                                backgroundColor: "#1e293b",
                                                padding: "16px 20px",
                                                borderBottom: "2px solid #334155",
                                                borderLeft: "1px solid #334155",
                                                fontWeight: "600",
                                                color: "#f1f5f9",
                                                fontSize: "14px"
                                            }}>
                                                Bidder
                                            </th>
                                            <th style={{
                                                backgroundColor: "#1e293b",
                                                padding: "16px 20px",
                                                borderBottom: "2px solid #334155",
                                                borderLeft: "1px solid #334155",
                                                fontWeight: "600",
                                                color: "#f1f5f9",
                                                fontSize: "14px"
                                            }}>
                                                Bid Price
                                            </th>
                                            <th style={{
                                                backgroundColor: "#1e293b",
                                                padding: "16px 20px",
                                                borderBottom: "2px solid #334155",
                                                borderLeft: "1px solid #334155",
                                                fontWeight: "600",
                                                color: "#f1f5f9",
                                                fontSize: "14px"
                                            }}>
                                                Profit %
                                            </th>
                                            <th style={{
                                                backgroundColor: "#1e293b",
                                                padding: "16px 20px",
                                                borderBottom: "2px solid #334155",
                                                borderLeft: "1px solid #334155",
                                                fontWeight: "600",
                                                color: "#f1f5f9",
                                                fontSize: "14px"
                                            }}>
                                                Overhead %
                                            </th>
                                            <th style={{
                                                backgroundColor: "#1e293b",
                                                padding: "16px 20px",
                                                borderBottom: "2px solid #334155",
                                                borderLeft: "1px solid #334155",
                                                fontWeight: "600",
                                                color: "#f1f5f9",
                                                fontSize: "14px"
                                            }}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboardData.map((bid, index) => {
                                            const isCurrentUser = isMultiplayerMode ? bid.isCurrentUser : bid.name === "You";
                                            const displayName = isMultiplayerMode ? bid.username : bid.name;
                                            const isWaiting = bid.isWaiting || false;

                                            return (
                                                <tr key={isMultiplayerMode ? bid.userId : bid.name} style={{
                                                    backgroundColor: isCurrentUser && !isWaiting ? "#10b981" : isWaiting ? "#475569" : "#0f172a",
                                                    fontWeight: isCurrentUser ? "600" : "normal",
                                                    opacity: isWaiting ? 0.6 : 1
                                                }}>
                                                    <td style={{
                                                        padding: "12px 20px",
                                                        borderBottom: "1px solid #334155",
                                                        textAlign: "center",
                                                        color: isCurrentUser && !isWaiting ? "white" : "#e2e8f0",
                                                        fontWeight: "500"
                                                    }}>
                                                        {isWaiting ? "—" : (
                                                            <>
                                                                {bid.rank}
                                                                {bid.rank === 1 && " 🏆"}
                                                                {bid.rank === 2 && " 🥈"}
                                                                {bid.rank === 3 && " 🥉"}
                                                            </>
                                                        )}
                                                    </td>
                                                    <td style={{
                                                        padding: "12px 20px",
                                                        borderBottom: "1px solid #334155",
                                                        borderLeft: "1px solid #334155",
                                                        color: isCurrentUser && !isWaiting ? "white" : "#e2e8f0",
                                                        fontWeight: "500"
                                                    }}>
                                                        {displayName}
                                                        {isCurrentUser && !isWaiting && " (You)"}
                                                        {isWaiting && (
                                                            <span style={{
                                                                marginLeft: "8px",
                                                                fontSize: "12px",
                                                                color: "#94a3b8",
                                                                fontStyle: "italic"
                                                            }}>
                                                                (Not yet submitted)
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td style={{
                                                        padding: "12px 20px",
                                                        borderBottom: "1px solid #334155",
                                                        borderLeft: "1px solid #334155",
                                                        textAlign: "right",
                                                        color: isCurrentUser && !isWaiting ? "white" : "#e2e8f0",
                                                        fontWeight: "500"
                                                    }}>
                                                        {isWaiting ? "—" : `$${bid.bidPrice?.toFixed(0)}`}
                                                    </td>
                                                    <td style={{
                                                        padding: "12px 20px",
                                                        borderBottom: "1px solid #334155",
                                                        borderLeft: "1px solid #334155",
                                                        textAlign: "center",
                                                        color: isCurrentUser && !isWaiting ? "white" : "#e2e8f0",
                                                        fontWeight: "500"
                                                    }}>
                                                        {isWaiting ? "—" : `${bid.profitPercentage?.toFixed(1)}%`}
                                                    </td>
                                                    <td style={{
                                                        padding: "12px 20px",
                                                        borderBottom: "1px solid #334155",
                                                        borderLeft: "1px solid #334155",
                                                        textAlign: "center",
                                                        color: isCurrentUser && !isWaiting ? "white" : "#e2e8f0",
                                                        fontWeight: "500"
                                                    }}>
                                                        {isWaiting ? "—" : `${bid.overheadPercentage?.toFixed(1)}%`}
                                                    </td>
                                                    <td style={{
                                                        padding: "12px 20px",
                                                        borderBottom: "1px solid #334155",
                                                        borderLeft: "1px solid #334155",
                                                        textAlign: "center"
                                                    }}>
                                                        {/* Multiplayer Mode: Show compare button for other players (only if not waiting) */}
                                                        {isMultiplayerMode && !isCurrentUser && !isWaiting && (
                                                            <button
                                                                onClick={() => showMultiplayerComparison(bid)}
                                                                style={{
                                                                    padding: "6px 12px",
                                                                    fontSize: "12px",
                                                                    backgroundColor: "#10b981",
                                                                    color: "white",
                                                                    border: "none",
                                                                    borderRadius: "6px",
                                                                    cursor: "pointer",
                                                                    fontWeight: "500",
                                                                    transition: "all 0.2s ease"
                                                                }}
                                                                onMouseOver={(e) => {
                                                                    const target = e.currentTarget as HTMLButtonElement;
                                                                    target.style.backgroundColor = "#059669";
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    const target = e.currentTarget as HTMLButtonElement;
                                                                    target.style.backgroundColor = "#10b981";
                                                                }}
                                                            >
                                                                Compare
                                                            </button>
                                                        )}
                                                        {/* Show waiting message */}
                                                        {isWaiting && (
                                                            <span style={{
                                                                fontSize: "12px",
                                                                color: "#94a3b8",
                                                                fontStyle: "italic"
                                                            }}>
                                                                Waiting...
                                                            </span>
                                                        )}
                                                        {/* Single Player Mode: Show bot comparison buttons */}
                                                        {!isMultiplayerMode && bid.rank && bid.rank < (leaderboardData.find(b => b.name === "You")?.rank || 999) && bid.isBot && (
                                                            <div style={{ display: "flex", gap: "8px" }}>
                                                                <button
                                                                    onClick={() => showDetailedStrategy(bid)}
                                                                    style={{
                                                                        padding: "6px 12px",
                                                                        fontSize: "12px",
                                                                        backgroundColor: "#3b82f6",
                                                                        color: "white",
                                                                        border: "none",
                                                                        borderRadius: "6px",
                                                                        cursor: "pointer",
                                                                        fontWeight: "500",
                                                                        transition: "all 0.2s ease"
                                                                    }}
                                                                    onMouseOver={(e) => {
                                                                        const target = e.currentTarget as HTMLButtonElement;
                                                                        target.style.backgroundColor = "#2563eb";
                                                                    }}
                                                                    onMouseOut={(e) => {
                                                                        const target = e.currentTarget as HTMLButtonElement;
                                                                        target.style.backgroundColor = "#3b82f6";
                                                                    }}
                                                                >
                                                                    View Strategy
                                                                </button>
                                                                <button
                                                                    onClick={() => showComparison(bid)}
                                                                    style={{
                                                                        padding: "6px 12px",
                                                                        fontSize: "12px",
                                                                        backgroundColor: "#10b981",
                                                                        color: "white",
                                                                        border: "none",
                                                                        borderRadius: "6px",
                                                                        cursor: "pointer",
                                                                        fontWeight: "500",
                                                                        transition: "all 0.2s ease"
                                                                    }}
                                                                    onMouseOver={(e) => {
                                                                        const target = e.currentTarget as HTMLButtonElement;
                                                                        target.style.backgroundColor = "#059669";
                                                                    }}
                                                                    onMouseOut={(e) => {
                                                                        const target = e.currentTarget as HTMLButtonElement;
                                                                        target.style.backgroundColor = "#10b981";
                                                                    }}
                                                                >
                                                                    Compare
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{
                                marginTop: "24px",
                                padding: "20px",
                                backgroundColor: "#0f172a",
                                borderRadius: "12px",
                                border: "1px solid #334155"
                            }}>
                                <h4 style={{
                                    margin: "0 0 12px 0",
                                    color: "#f1f5f9",
                                    fontSize: "16px",
                                    fontWeight: "600"
                                }}>
                                    Competition Analysis
                                </h4>
                                <div style={{ fontSize: "14px", color: "#e2e8f0" }}>
                                    {(() => {
                                        const userRank = leaderboardData.find(b => b.name === "You")?.rank;
                                        const totalBidders = leaderboardData.length;
                                        const betterBids = leaderboardData.filter(b => b.rank < userRank && b.isBot).length;

                                        if (userRank === 1) {
                                            return <p style={{ color: "#10b981", fontWeight: "600" }}>🎉 Congratulations! You won the bid with the lowest price!</p>;
                                        } else {
                                            return (
                                                <div>
                                                    <p>Your bid ranked <strong style={{ color: "#f1f5f9" }}>#{userRank}</strong> out of {totalBidders} bidders.</p>
                                                    <p><strong style={{ color: "#f1f5f9" }}>{betterBids}</strong> bot(s) submitted lower bids than yours.</p>
                                                    <p>Click "View Strategy" on better-performing bots to see their approach.</p>
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Label */}
                <div style={{
                    textAlign: "right",
                    marginTop: "10px",
                    fontSize: "14px",
                    color: "#666"
                }}>
                    Table 11
                </div>
            </div>
        </div>
    );
}