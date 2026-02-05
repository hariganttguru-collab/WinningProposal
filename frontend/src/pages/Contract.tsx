import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { ContractProvider } from "../context/ContractContext";
import { ProjectDataProvider, useProjectData } from "../context/ProjectDataContext";
import { useAuth } from "../context/AuthContext";
import { useLobby } from "../context/LobbyContext";
import Sidebar from "../components/Sidebar";
import DeliverablesSection from "../components/DeliverablesSection";
import ResourceAllocationSection from "../components/ResourceAllocationSection";
import WorkScheduleSection from "../components/WorkScheduleSection";
import PersonMonthsDisplaySection from "../components/PersonMonthsDisplaySection";
import MonthlySalarySection from "../components/MonthlySalarySection";
import PersonMonthsSection from "../components/PersonMonthsSection";
import OverheadContingencySection from "../components/OverheadContingencySection";
import BidPriceSection from "../components/BidPriceSection";
import { generateBots } from "../utils/botGenerator";

function ContractContent() {
    const [params] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentLobby, isAdmin } = useLobby();
    const {
        getContributionMarginIncludingBonus,
        isBidDisqualified,
        deliverables,
        estimationAccuracy,
        screenAllocations,
        databaseAllocations,
        workingDaysPerMonth,
        workingHoursPerDay,
        salaries,
        contingencyPercent,
        overheadPercent,
        qualityPercent,
        bidPrice,
        getTotalResourceCost,
        getTotalCost,
        getProjectDuration
    } = useProjectData();
    const mode = params.get("mode");

    const contributionMargin = getContributionMarginIncludingBonus();

    // Timer state
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const handleSubmit = () => {
        // Generate user bid data
        const userBid = {
            name: "You",
            bidPrice,
            contributionMargin,
            isDisqualified: isBidDisqualified(),
            disqualificationReasons: [],
            deliverables: {
                complexScreen: deliverables[0],
                simpleScreen: deliverables[1],
                complexDatabase: deliverables[2],
                simpleDatabase: deliverables[3]
            },
            estimationAccuracy,
            resourceAllocation: {
                complexScreen: screenAllocations[0],
                simpleScreen: screenAllocations[1],
                complexDatabase: databaseAllocations[0],
                simpleDatabase: databaseAllocations[1]
            },
            workSchedule: {
                workingDaysPerMonth,
                workingHoursPerDay
            },
            salaries,
            overhead: {
                contingencyPercent,
                overheadPercent,
                qualityPercent
            },
            totalResourceCost: getTotalResourceCost(),
            totalCost: getTotalCost(),
            projectDuration: getProjectDuration()
        };

        // Check disqualification reasons
        if (bidPrice > 500000) {
            userBid.disqualificationReasons.push(`Bid price ($${bidPrice.toLocaleString()}) exceeds budget of $500,000`);
        }

        // Check timeline violations
        deliverables.forEach((d, idx) => {
            const adjustedQuantity = d.quantity * (100 / estimationAccuracy);
            const cost = adjustedQuantity * d.effortPerUnit;

            const isUI = idx < 2;
            const allocation = isUI ? screenAllocations[idx] : databaseAllocations[idx - 2];
            const junior = isUI ? allocation.uiJunior : allocation.backendJunior;
            const senior = isUI ? allocation.uiSenior : allocation.backendSenior;

            const denominator = junior + (senior * 2);
            if (denominator > 0) {
                const personHours = cost / denominator;
                const personDays = personHours / workingHoursPerDay;
                const personMonths = personDays / workingDaysPerMonth;

                if (personMonths > 5) {
                    userBid.disqualificationReasons.push(`${d.name} timeline (${personMonths.toFixed(2)} months) exceeds 5 months`);
                }
            }
        });

        // Check if multiplayer mode
        if (mode === 'MULTI' && user && currentLobby) {
            // Save bid to localStorage for admin to see
            const playerBid = {
                userId: user.id,
                username: user.username,
                bidPrice,
                contributionMargin,
                isDisqualified: userBid.isDisqualified,
                disqualificationReasons: userBid.disqualificationReasons,
                totalResourceCost: getTotalResourceCost(),
                totalCost: getTotalCost(),
                projectDuration: getProjectDuration(),
                submittedAt: Date.now(),
                inputs: {
                    deliverables: userBid.deliverables,
                    estimationAccuracy,
                    resourceAllocation: userBid.resourceAllocation,
                    workSchedule: userBid.workSchedule,
                    salaries,
                    overhead: userBid.overhead
                }
            };

            localStorage.setItem(`lobby_${currentLobby.code}_bid_${user.id}`, JSON.stringify(playerBid));

            // Navigate to waiting screen (different for admin vs players)
            if (isAdmin(user.id)) {
                navigate('/admin-results');
            } else {
                navigate('/player-waiting');
            }
        } else {
            // Single player mode - generate 9 bots
            const bots = generateBots(9);

            // Combine and navigate to leaderboard
            navigate('/leaderboard', {
                state: {
                    userBid,
                    bots
                }
            });
        }
    };

    // Check for re-compete mode
    const isRecompeteMode = location.state?.recompeteMode;
    const recompeteMessage = location.state?.message;

    // Redirect admin to results page if in multiplayer mode
    useEffect(() => {
        if (mode === 'MULTI' && user && currentLobby && isAdmin(user.id)) {
            navigate('/admin-results');
        }
    }, [mode, user, currentLobby, isAdmin, navigate]);

    // Clear saved state when entering a new multiplayer lobby
    useEffect(() => {
        if (mode === 'MULTI' && currentLobby) {
            const lastLobbyCode = localStorage.getItem('lastMultiplayerLobby');
            if (lastLobbyCode !== currentLobby.code) {
                localStorage.removeItem('contractState');
                localStorage.setItem('lastMultiplayerLobby', currentLobby.code);
            }
        }
    }, [mode, currentLobby]);

    // Timer countdown and notifications
    useEffect(() => {
        if (mode !== 'MULTI' || !currentLobby) return;

        const timerEndTime = localStorage.getItem(`lobby_${currentLobby.code}_timer`);
        if (!timerEndTime) return;

        const notifiedIntervals = new Set<string>();

        const updateTimer = () => {
            const now = Date.now();
            const endTime = parseInt(timerEndTime);
            const remaining = Math.max(0, endTime - now);

            setTimeRemaining(remaining);

            // Check if time is up
            if (remaining === 0) {
                handleSubmit();
                return;
            }

            // Show notifications at specific intervals
            const remainingSeconds = Math.floor(remaining / 1000);
            const remainingMinutes = Math.floor(remainingSeconds / 60);

            // 5 minutes warning
            if (remainingMinutes === 5 && remainingSeconds <= 300 && remainingSeconds > 295 && !notifiedIntervals.has('5min')) {
                notifiedIntervals.add('5min');
                setNotificationMessage('⏰ 5 minutes remaining!');
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            }
            // 2 minutes warning
            else if (remainingMinutes === 2 && remainingSeconds <= 120 && remainingSeconds > 115 && !notifiedIntervals.has('2min')) {
                notifiedIntervals.add('2min');
                setNotificationMessage('⏰ 2 minutes remaining!');
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            }
            // 1 minute warning
            else if (remainingMinutes === 1 && remainingSeconds <= 60 && remainingSeconds > 55 && !notifiedIntervals.has('1min')) {
                notifiedIntervals.add('1min');
                setNotificationMessage('⏰ 1 minute remaining!');
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            }
            // 30 seconds warning
            else if (remainingSeconds === 30 && !notifiedIntervals.has('30sec')) {
                notifiedIntervals.add('30sec');
                setNotificationMessage('⏰ 30 seconds remaining!');
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [mode, currentLobby]);

    return (
        <>
            {/* Sidebar */}
            <Sidebar timeRemaining={timeRemaining} />

            {/* Main Content */}
            <div style={{
                marginLeft: '300px',
                minHeight: "100vh",
                backgroundColor: "#0f172a",
                color: "#f1f5f9",
                padding: "30px"
            }}>
                {/* Top Bar with Back Button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    {/* Back to Dashboard Button */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#1e293b",
                            color: "#e2e8f0",
                            border: "2px solid #475569",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
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
                        ← Back to Dashboard
                    </button>
                </div>

                <h1 style={{
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    margin: "0 0 10px 0",
                    color: "#f1f5f9"
                }}>
                    Fixed Price Contract Simulation
                </h1>

                {/* Re-compete Mode Notification */}
                {isRecompeteMode && (
                    <div style={{
                        backgroundColor: "#10b981",
                        color: "white",
                        padding: "16px 20px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                    }}>
                        <span style={{ fontSize: "20px" }}>🎯</span>
                        <div>
                            <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                                Re-compete Mode Active
                            </div>
                            <div style={{ fontSize: "14px", opacity: "0.9" }}>
                                {recompeteMessage} When ready, submit your bid to see the new comparison.
                            </div>
                        </div>
                    </div>
                )}

                <p style={{
                    fontSize: "1rem",
                    margin: "0 0 30px 0",
                    color: "#94a3b8"
                }}>
                    Mode: {mode}
                </p>

                {/* Notification Popup */}
                {showNotification && (
                    <div style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        padding: '20px 30px',
                        borderRadius: '12px',
                        fontSize: '18px',
                        fontWeight: '700',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
                        zIndex: 9999,
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        {notificationMessage}
                    </div>
                )}

                {/* Project Background Section */}
                <div style={{
                    backgroundColor: "#1e293b",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                    border: "1px solid #334155",
                    marginBottom: "30px"
                }}>
                    <div style={{
                        backgroundColor: "#0f172a",
                        color: "#f1f5f9",
                        padding: "20px 30px",
                        fontWeight: "600",
                        fontSize: "20px",
                        margin: "0",
                        borderBottom: "1px solid #334155"
                    }}>
                        Project Background
                    </div>
                    <div style={{
                        backgroundColor: "#1e293b",
                        padding: "30px",
                        color: "#e2e8f0",
                        lineHeight: "1.6",
                        fontSize: "16px"
                    }}>
                        <p style={{ margin: "0 0 20px 0" }}>
                            The Project is to automate the manual Test cases. The Quantity of Deliverables is derived by an onsite
                            team, who had visited the client place and estimated the work within 5 working days of time as the
                            client was needing the quote urgently. The client expects that the project to be completed within 5
                            months time and within a budget of 500,000 USD. The project shall be awarded to the lowest bidder.
                        </p>
                        <p style={{ margin: "0 0 20px 0" }}>
                            <strong style={{ color: "#fbbf24" }}>Important:</strong> The client has specified a bonus/penalty clause of <strong style={{ color: "#10b981" }}>$25,000 per month</strong>.
                            If the project is completed early, you will receive a bonus of $25,000 for each month ahead of schedule.
                            If the project is delayed, you will incur a penalty of $25,000 for each month of delay.
                        </p>
                        <p style={{ margin: "0" }}>
                            Your Bidding Team has prepared the Bid. Now you are requested by the Bidding team to apply
                            project management best practices to make a competitive Bid as well as a profitable Bid with budget
                            provisions to manage any anticipated Risks.
                        </p>
                    </div>
                </div>

                {/* Scrollable Sections Container */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px"
                }}>
                    {/* Section 1: Deliverables & Effort Estimation */}
                    <DeliverablesSection />

                    {/* Section 2: Resource Allocation */}
                    <ResourceAllocationSection />

                    {/* Section 3 & 4: Work Schedule and Person Months - Side by Side */}
                    <div style={{ display: "flex", gap: "30px", alignItems: "stretch" }}>
                        <div style={{ flex: 1, display: "flex" }}>
                            <WorkScheduleSection />
                        </div>
                        <div style={{ flex: 1, display: "flex" }}>
                            <PersonMonthsDisplaySection />
                        </div>
                    </div>

                    {/* Section 5 & 6: Monthly Salary and Resource Cost Summary - Side by Side */}
                    <div style={{ display: "flex", gap: "30px", alignItems: "stretch" }}>
                        <div style={{ flex: 1, display: "flex" }}>
                            <MonthlySalarySection />
                        </div>
                        <div style={{ flex: 1, display: "flex" }}>
                            <PersonMonthsSection />
                        </div>
                    </div>

                    {/* Section 7: Overhead & Contingency */}
                    <OverheadContingencySection />

                    {/* Section 8: Bid Price */}
                    <BidPriceSection />

                    {/* Submit Button */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: '40px',
                        marginBottom: '40px',
                        gap: '20px'
                    }}>
                        <div style={{
                            backgroundColor: '#0f172a',
                            border: '2px solid #10b981',
                            borderRadius: '12px',
                            padding: '20px 30px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                                Final Contribution Margin
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>
                                ${Math.round(contributionMargin).toLocaleString()}
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            style={{
                                padding: '16px 48px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '18px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#059669';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#10b981';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                            }}
                        >
                            ✓ Submit Bid
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function Contract() {
    return (
        <ContractProvider>
            <ProjectDataProvider>
                <ContractContent />
            </ProjectDataProvider>
        </ContractProvider>
    );
}
