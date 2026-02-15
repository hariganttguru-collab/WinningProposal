import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ContractProvider } from "../context/ContractContext";
import { ProjectDataProvider, useProjectData } from "../context/ProjectDataContext";
import { useAuth } from "../context/AuthContext";
import { useLobby } from "../context/LobbyContext";
import DeliverablesSection from "../components/DeliverablesSection";
import ResourceAllocationSection from "../components/ResourceAllocationSection";
import WorkScheduleSection from "../components/WorkScheduleSection";
import MonthlySalarySection from "../components/MonthlySalarySection";
import OverheadContingencySection from "../components/OverheadContingencySection";
import BidPriceSection from "../components/BidPriceSection";
import ContributionMarginGraph from "../components/ContributionMarginGraph";
import { generateBots } from "../utils/botGenerator";
import { formatFullK } from "../utils/formatters";

type TabType = 'scope' | 'workplan' | 'idc' | 'bidprice';

const SECTION_INFO: Record<TabType, { title: string, description: string }> = {
    scope: {
        title: "Project Scope",
        description: "Define the core deliverables of the project. Adjust the quantity and estimated effort per unit. Your accuracy in these estimates affects the overall project duration and risk."
    },
    workplan: {
        title: "Direct Cost (Resource Allocation)",
        description: "Allocate Junior and Senior developers to each task. Senior developers are 2x more productive than Juniors. Balancing your team is key to meeting the 5-month deadline without overspending."
    },
    idc: {
        title: "Indirect Cost & Overheads",
        description: "Factor in additional costs like Contingency (risk buffer), Overhead (operational costs), and Quality Assurance. These are calculated as percentages of your total resource cost."
    },
    bidprice: {
        title: "Bid Price & Margin",
        description: "Set your final bid price. The difference between your bid price and total cost is your Contribution Margin. Remember: the lowest valid bid (with positive margin) wins the contract!"
    }
};


function ContractContent() {
    const [params] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentLobby, isAdmin, submitBid } = useLobby();
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
        getProjectDuration,
        getRawProjectDuration,
        getProjectCompletedEarlyBy,
        earlyFinishBonus,
        expectedProjectDuration,
        showBonus,
        isEditing,
        setIsEditing
    } = useProjectData();
    const mode = params.get("mode");
    const { setShowBonus } = useProjectData();
    const contributionMargin = getContributionMarginIncludingBonus();


    // Calculate Alerts
    const isOverBudget = bidPrice > 1000000;


    // Check timeline violations
    const durationAlerts: string[] = [];
    deliverables.forEach((d, idx) => {
        const adjustedQuantity = d.quantity * (100 / estimationAccuracy);
        const cost = adjustedQuantity * d.effortPerUnit;

        const isUI = idx < 2;
        const allocation: any = isUI ? screenAllocations?.[idx] : databaseAllocations?.[idx - 2];
        if (!allocation) return;

        const junior = isUI ? allocation.uiJunior : allocation.backendJunior;
        const senior = isUI ? allocation.uiSenior : allocation.backendSenior;

        const denominator = junior + (senior * 2);
        if (denominator > 0) {
            const personHours = cost / denominator;
            const personDays = personHours / workingHoursPerDay;
            const personMonths = personDays / workingDaysPerMonth;

            if (personMonths > 5) {
                durationAlerts.push(`${d.name}: ${personMonths.toFixed(1)}m`);
            }
        }
    });

    // Game Flow State
    const [gamePhase, setGamePhase] = useState<'briefing' | 'guided' | 'review' | 'free' | 'submitted'>('briefing');
    const [briefingPage, setBriefingPage] = useState(1);
    const totalBriefingPages = 11;


    // Tab state
    const [activeTab, setActiveTab] = useState<TabType>('scope');
    const [completedSteps, setCompletedSteps] = useState(0);
    const [bidNews, setBidNews] = useState<{ id: number; text: string; type: 'info' | 'competitor' }[]>([]);
    const [activeNewsPopup, setActiveNewsPopup] = useState<{ id: number; text: string; type: 'info' | 'competitor' } | null>(null);
    const [activeAlertPopup, setActiveAlertPopup] = useState<{ title: string; detail: string | string[] } | null>(null);
    const [activeInfoPopup, setActiveInfoPopup] = useState<TabType | null>(null);


    // Derived state for alerts (must be after state declarations)
    const hasSalaryNews = bidNews.some(n => n.id === 1);
    const isSeniorSalaryLow = hasSalaryNews && (salaries.uiSenior < 8000 || salaries.backendSenior < 8000);

    const hasAlerts = isOverBudget || durationAlerts.length > 0 || isSeniorSalaryLow;

    const tabs: { id: TabType, label: string }[] = [
        { id: 'scope', label: 'Scope' },
        { id: 'workplan', label: 'Direct Cost' },
        { id: 'idc', label: 'Indirect Cost' },
        { id: 'bidprice', label: 'Bid Price' }
    ];

    const handleStartGame = () => {
        setGamePhase('guided');
        setActiveTab('scope');
        setIsEditing(false);
    };

    const handleNextStep = () => {
        const currentIndex = tabs.findIndex(t => t.id === activeTab);
        const nextIndex = currentIndex + 1;

        // Move to next tab or Review
        if (nextIndex < tabs.length) {
            setActiveTab(tabs[nextIndex].id);
            setIsEditing(false); // Reset edit mode for next tab
            setCompletedSteps(nextIndex);
        } else {
            // Generate News when entering Review phase (Finish and Review)
            const salaryNews = {
                id: 1,
                text: "Market Update: Analysis shows that Senior Developers are rejecting offers below $8,000/month.",

                type: 'info' as const
            };

            const randomCompetitorBid = Math.floor(Math.random() * (995000 - 940000 + 1)) + 940000;
            const competitorBidPrice = Math.min(randomCompetitorBid, bidPrice - 15000);


            const competitorNews = {
                id: 2,
                text: `Competitor Alert: A rival bidder has submitted a Bid Price of ${formatFullK(competitorBidPrice)}. This is one of the lowest bids observed in the market.`,
                type: 'competitor' as const
            };

            const completedEarlyBy = getProjectCompletedEarlyBy();
            const totalBonus = completedEarlyBy * earlyFinishBonus;
            const bonusNews = {
                id: 3,
                text: `Project Incentive: Due to your optimized schedule, you are eligible for an efficiency bonus of ${formatFullK(earlyFinishBonus)} per month. Total impact: ${formatFullK(totalBonus)}.`,
                type: 'info' as const
            };

            // Ensure all are in bidNews
            setBidNews(prev => {
                const next = [...prev];
                if (!next.some(n => n.id === 1)) next.push(salaryNews);
                if (!next.some(n => n.id === 2)) next.push(competitorNews);
                if (!next.some(n => n.id === 3)) next.push(bonusNews);
                return next;
            });

            // Trigger unified popup
            setActiveNewsPopup({
                id: 99,
                text: "Multiple", // Signal for multi-rendering
                type: 'info'
            });

            // Delay showing bonus effect until news is shown
            setShowBonus(true);
        }
    };

    const handleSavePlan = () => {
        // This is kept for the 'Save' button in Free Mode
        const currentIndex = tabs.findIndex(t => t.id === activeTab);
        const nextIndex = currentIndex + 1;

        // Unlock next step if not already done
        if (completedSteps < nextIndex) {
            setCompletedSteps(nextIndex);
        }

        // Navigate to next tab if available
        if (nextIndex < tabs.length) {
            setActiveTab(tabs[nextIndex].id);
        }
    };

    // Project Background Modal state
    const [showProjectBackground, setShowProjectBackground] = useState(false);

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
            disqualificationReasons: [] as string[],
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
        if (bidPrice > 1000000) {
            userBid.disqualificationReasons.push(`Bid price (${formatFullK(bidPrice)}) exceeds budget of $1,000,000`);
        }


        if (isSeniorSalaryLow) {
            userBid.disqualificationReasons.push("Senior Developer salary is below the market minimum of $2,500");
        }

        // Check timeline violations
        deliverables.forEach((d, idx) => {
            const adjustedQuantity = d.quantity * (100 / estimationAccuracy);
            const cost = adjustedQuantity * d.effortPerUnit;

            const isUI = idx < 2;
            const allocation = (isUI ? screenAllocations[idx] : databaseAllocations[idx - 2]) as any;
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

            // Save bid to Supabase
            submitBid(user.id, playerBid).then(() => {
                // Navigate to waiting screen (different for admin vs players)
                if (isAdmin(user.id)) {
                    navigate('/admin-results');
                } else {
                    navigate('/player-waiting');
                }
            });
            return;
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

    // Format timer display
    const formatTime = (ms: number | null) => {
        if (ms === null) return '';
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Show project background on first load
    useEffect(() => {
        // Auto-popup removed as requested - Briefing screen handles introduction
        // setShowProjectBackground(true);
    }, []);

    // --- RENDER HELPERS ---

    // 1. Overhauled Briefing Screen (11-slide story)
    if (gamePhase === 'briefing') {
        const renderBriefingSlide = () => {
            switch (briefingPage) {
                case 1:
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: '#f1f5f9' }}>“The Four Deliverables”</h1>
                            <p style={{ fontSize: '24px', color: '#94a3b8', fontStyle: 'italic' }}>A Test Automation Pre-Bid Cost Strategy Story</p>
                        </div>
                    );

                case 2:
                    return (
                        <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
                            <h2 style={{ fontSize: '24px', color: '#60a5fa', marginBottom: '24px' }}>Day 4: After Client Workshops</h2>

                            <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '20px' }}>
                                The discovery workshops were finally complete. For three days, the project team had met the client’s product owners, architects, and QA leads. What began as a vague automation transformation initiative was now clearer.
                            </p>
                            <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '20px' }}>
                                By the end of the analysis, the team categorised the scope into four distinct deliverables:
                            </p>
                            <ul style={{ color: '#60a5fa', fontSize: '20px', fontWeight: 'bold', listStyle: 'none', padding: 0 }}>
                                <li>1. Complex Screen Automation</li>
                                <li>2. Simple Screen Automation</li>
                                <li>3. Complex Database Validation</li>
                                <li>4. Simple Database Validation</li>
                            </ul>
                            <p style={{ fontSize: '18px', color: '#cbd5e1', marginTop: '20px' }}>
                                On paper, it looked structured. Controlled. Estimable. But Arjun, the Automation Cost Lead, knew better. <strong>Structured deliverables hide unstructured effort.</strong>
                            </p>
                        </div>
                    );
                case 3:
                    return (
                        <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
                            <h2 style={{ fontSize: '24px', color: '#60a5fa', marginBottom: '24px' }}>The First Internal Review</h2>

                            <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '20px' }}>
                                In the war room, the Business Analyst projected the findings. “We estimate approximately:”
                            </p>
                            <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ color: '#f1f5f9' }}>• <strong>180</strong> Complex Screens</div>
                                <div style={{ color: '#f1f5f9' }}>• <strong>410</strong> Simple Screens</div>
                                <div style={{ color: '#f1f5f9' }}>• <strong>95</strong> Complex Database components</div>
                                <div style={{ color: '#f1f5f9' }}>• <strong>210</strong> Simple Database components</div>
                            </div>
                            <p style={{ fontSize: '18px', color: '#cbd5e1', marginTop: '24px' }}>
                                At first glance, the breakdown was logical. But then came the real question...
                            </p>
                        </div>
                    );
                case 4:
                    return (
                        <div style={{ textAlign: 'center', lineHeight: '1.8' }}>
                            <h2 style={{ fontSize: '24px', color: '#60a5fa', marginBottom: '32px' }}>Who builds what?</h2>

                            <p style={{ fontSize: '20px', color: '#cbd5e1', marginBottom: '32px' }}>
                                The organisation had four developer categories:
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
                                {['Junior UI Dev', 'Senior UI Dev', 'Junior Backend Dev', 'Senior Backend Dev'].map(role => (
                                    <div key={role} style={{ backgroundColor: '#1e293b', padding: '12px 24px', borderRadius: '8px', border: '1px solid #3b82f6', color: '#f1f5f9', fontWeight: '600' }}>
                                        {role}
                                    </div>
                                ))}
                            </div>
                            <p style={{ fontSize: '20px', color: '#94a3b8', fontStyle: 'italic' }}>
                                "This was no longer about counting deliverables. This was about assigning the right capability at the right cost."
                            </p>
                        </div>
                    );
                case 5:
                    return (
                        <div style={{ textAlign: 'left' }}>
                            <h2 style={{ fontSize: '24px', color: '#60a5fa', marginBottom: '24px' }}>Skill Cost Matrix</h2>

                            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f1f5f9' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#1e293b', textAlign: 'left' }}>
                                        <th style={{ padding: '12px', border: '1px solid #334155' }}>Role</th>
                                        <th style={{ padding: '12px', border: '1px solid #334155' }}>Hours/Month</th>
                                        <th style={{ padding: '12px', border: '1px solid #334155' }}>Salary ($)</th>
                                        <th style={{ padding: '12px', border: '1px solid #334155' }}>Productivity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { role: 'Junior UI Developer', hours: 160, salary: 4000, prod: '1.0x' },
                                        { role: 'Senior UI Developer', hours: 160, salary: 7500, prod: '2.0x' },
                                        { role: 'Junior Backend Developer', hours: 160, salary: 4800, prod: '1.0x' },
                                        { role: 'Senior Backend Developer', hours: 160, salary: 9000, prod: '2.0x' },
                                    ].map((row, i) => (
                                        <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#0f172a' : '#111827' }}>
                                            <td style={{ padding: '12px', border: '1px solid #334155' }}>{row.role}</td>
                                            <td style={{ padding: '12px', border: '1px solid #334155' }}>{row.hours}</td>
                                            <td style={{ padding: '12px', border: '1px solid #334155' }}>{row.salary}</td>
                                            <td style={{ padding: '12px', border: '1px solid #334155', color: '#10b981', fontWeight: 'bold' }}>{row.prod}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                case 6:
                    return (
                        <div className="briefing-scrollable" style={{ textAlign: 'left', lineHeight: '1.5', fontSize: '13px', overflowY: 'auto', maxHeight: '400px', paddingRight: '10px' }}>
                            <h2 style={{ fontSize: '20px', color: '#60a5fa', marginBottom: '16px' }}>Constraints by Stakeholders</h2>


                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                                    <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 'bold' }}>Finance:</p>
                                    <p style={{ margin: 0, color: '#cbd5e1' }}>“Maintain minimum 10% margin. No exceptions.”</p>
                                </div>
                                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                                    <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 'bold' }}>Delivery Head:</p>
                                    <p style={{ margin: 0, color: '#cbd5e1' }}>“If we overload juniors on complex components, rework will increase.”</p>
                                </div>
                            </div>

                            <div style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '16px' }}>
                                <p style={{ margin: 0, color: '#94a3b8', fontStyle: 'italic' }}>During the workshop, the client casually mentioned:</p>
                                <p style={{ margin: '4px 0 0 0', color: '#f1f5f9' }}>“Some complex screens include dynamic validations and third-party integrations.”</p>
                                <p style={{ margin: '4px 0 0 0', color: '#60a5fa', fontSize: '12px' }}>That single sentence could shift effort per complex screen from 40 to 55 hours. No formal documentation supported this.</p>
                            </div>

                            <div style={{ color: '#cbd5e1', marginBottom: '16px' }}>
                                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#f1f5f9' }}>The Technical Lead commented:</p>
                                <p style={{ margin: '0 0 4px 0' }}>Complex database validation required: Stored procedure verification, data reconciliation, performance validation, and exception handling automation.</p>
                                <p style={{ margin: '0 0 8px 0' }}>Backend seniors could execute efficiently but were expensive. If juniors attempted it, review cycles would increase.</p>
                            </div>

                            <div style={{ color: '#f87171', fontWeight: 'bold', marginBottom: '16px' }}>
                                <p style={{ margin: 0 }}>Sales hint: “Competitors were known to undercut aggressively. We need to look lean.”</p>
                            </div>

                            <div style={{ color: '#cbd5e1' }}>
                                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#f1f5f9' }}>Now the tension was clear:</p>
                                <p style={{ margin: '0 0 4px 0' }}>• Seniors cost more but reduce risk.</p>
                                <p style={{ margin: '0 0 4px 0' }}>• Juniors cost less but increase supervision and rework.</p>
                                <p style={{ margin: '0 0 4px 0' }}>• Over-optimising cost may damage margin during execution.</p>
                            </div>
                        </div>
                    );

                case 7:
                    return (
                        <div style={{ textAlign: 'left' }}>
                            <h2 style={{ fontSize: '24px', color: '#60a5fa', marginBottom: '20px' }}>Estimation Assumptions</h2>

                            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f1f5f9', marginBottom: '20px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#1e293b' }}>
                                        <th style={{ padding: '10px', border: '1px solid #334155' }}>Deliverable</th>
                                        <th style={{ padding: '10px', border: '1px solid #334155' }}>Base Hours (Ideal)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { d: 'Complex Screen', h: 40 },
                                        { d: 'Simple Screen', h: 16 },
                                        { d: 'Complex Database', h: 32 },
                                        { d: 'Simple Database', h: 12 },
                                    ].map((row, i) => (
                                        <tr key={i}>
                                            <td style={{ padding: '10px', border: '1px solid #334155' }}>{row.d}</td>
                                            <td style={{ padding: '10px', border: '1px solid #334155' }}>{row.h} hours</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                "If a junior handles a complex screen, effort may increase by 35%. If a senior handles simple screens, cost efficiency drops. The game is about effort elasticity based on skill mix."
                            </p>
                        </div>
                    );
                case 8:
                    return (
                        <div style={{ textAlign: 'left', fontSize: '13px' }}>
                            <h2 style={{ fontSize: '22px', color: '#60a5fa', marginBottom: '16px' }}>Staffing Strategies</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                <div style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                                    <h4 style={{ color: '#60a5fa', margin: '0 0 8px 0' }}>A: Senior-Heavy</h4>
                                    <p style={{ color: '#10b981' }}>+ Low rework, high quality</p>
                                    <p style={{ color: '#ef4444' }}>- High cost, lower win prob</p>
                                </div>
                                <div style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                                    <h4 style={{ color: '#60a5fa', margin: '0 0 8px 0' }}>B: Junior-Optimised</h4>
                                    <p style={{ color: '#10b981' }}>+ Lower bid, competitive</p>
                                    <p style={{ color: '#ef4444' }}>- High defect leakage, rework risk</p>
                                </div>
                                <div style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                                    <h4 style={{ color: '#60a5fa', margin: '0 0 8px 0' }}>C: Blended Model</h4>
                                    <p style={{ color: '#10b981' }}>+ Controlled cost, balanced risk</p>
                                    <p style={{ color: '#ef4444' }}>- Requires strong governance</p>
                                </div>
                            </div>
                        </div>
                    );
                case 9:
                    return (
                        <div style={{ textAlign: 'left', lineHeight: '1.6' }}>
                            <h2 style={{ fontSize: '24px', color: '#60a5fa', marginBottom: '24px' }}>The Realisation</h2>

                            <p style={{ fontSize: '18px', color: '#f1f5f9', fontWeight: '600' }}>This was not a technical estimate. This was a strategic cost positioning exercise.</p>
                            <div style={{ color: '#cbd5e1', marginTop: '16px' }}>
                                <p>• Assumptions become commitments.</p>
                                <p>• Commitments become financial realities.</p>
                                <p>• Decisions influence win probability and client confidence.</p>
                            </div>
                        </div>
                    );
                case 10:
                    return (
                        <div style={{ textAlign: 'left', lineHeight: '1.6' }}>
                            <h2 style={{ fontSize: '24px', color: '#60a5fa', marginBottom: '24px' }}>The Final Question</h2>

                            <p style={{ fontSize: '20px', color: '#f1f5f9', marginBottom: '24px' }}>Should the team optimise for:</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                {['Winning the deal?', 'Protecting margin?', 'Minimising risk?', 'Long-term relationship?'].map(q => (
                                    <div key={q} style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155', color: '#f1f5f9' }}>
                                        {q}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                case 11:
                    return (
                        <div style={{ textAlign: 'center', lineHeight: '1.6' }}>
                            <h2 style={{ fontSize: '24px', color: '#60a5fa', marginBottom: '24px' }}>Action!</h2>

                            <p style={{ fontSize: '20px', color: '#f1f5f9', marginBottom: '32px' }}>
                                Your team has created an initial estimate with <strong>Strategy B</strong>. Since it is a risky strategy, they have allocated <strong>40%</strong> of the total cost as contingency reserve.
                            </p>
                            <p style={{ fontSize: '22px', color: '#10b981', fontWeight: 'bold' }}>
                                Use your project management knowledge to make the bid acceptable by all stakeholders.
                            </p>
                            <p style={{ fontSize: '24px', marginTop: '32px', color: '#f1f5f9' }}>All the Best.</p>
                        </div>
                    );
                default:
                    return null;
            }
        };

        return (
            <div style={{
                height: '100vh',
                width: '100vw',
                backgroundColor: '#0f172a',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e2e8f0',
                zIndex: 9999,
                position: 'fixed',
                top: 0,
                left: 0
            }}>
                <div style={{
                    maxWidth: '900px',
                    width: '90%',
                    backgroundColor: '#111827',
                    padding: '60px',
                    borderRadius: '24px',
                    border: '1px solid #1e293b',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    minHeight: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {/* Progress Bar */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        zIndex: 10
                    }}>
                        <div style={{
                            width: `${(briefingPage / totalBriefingPages) * 100}%`,
                            height: '100%',
                            backgroundColor: '#3b82f6',
                            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} />
                    </div>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                        {renderBriefingSlide()}
                    </div>

                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {briefingPage > 1 && (
                                <button
                                    onClick={() => setBriefingPage(prev => prev - 1)}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: 'transparent',
                                        color: '#94a3b8',
                                        border: '1px solid #334155',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ← Back
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            {briefingPage < totalBriefingPages ? (
                                <button
                                    onClick={() => setBriefingPage(prev => prev + 1)}
                                    style={{
                                        padding: '12px 32px',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                                    }}
                                >
                                    Next Slide →
                                </button>

                            ) : (
                                <button
                                    onClick={handleStartGame}
                                    style={{
                                        padding: '12px 40px',
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                        animation: 'pulse 2s infinite'
                                    }}
                                >
                                    Optimize the Bid

                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <style>{`
                    @keyframes pulse {
                        0% { transform: scale(1); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
                        50% { transform: scale(1.05); box-shadow: 0 4px 20px rgba(16, 185, 129, 0.5); }
                        100% { transform: scale(1); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
                    }
                    .briefing-scrollable::-webkit-scrollbar {
                        width: 8px;
                    }
                    .briefing-scrollable::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 4px;
                    }
                    .briefing-scrollable::-webkit-scrollbar-thumb {
                        background: #334155;
                        border-radius: 4px;
                    }
                    .briefing-scrollable::-webkit-scrollbar-thumb:hover {
                        background: #475569;
                    }
                `}</style>

            </div>
        );
    }




    // Disable inputs if in GUIDED mode and NOT editing
    const areInputsDisabled = gamePhase === 'guided' && !isEditing;

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#0f172a",
            color: "#f1f5f9"
        }}>
            {/* Top Bar */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                padding: '12px 30px',
                backgroundColor: '#1e293b',
                borderBottom: '1px solid #334155'
            }}>
                {/* Left Section: Back Button & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "transparent",
                            color: "#94a3b8",
                            border: "1px solid #475569",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "500",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.color = "#e2e8f0";
                            e.currentTarget.style.borderColor = "#64748b";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.color = "#94a3b8";
                            e.currentTarget.style.borderColor = "#475569";
                        }}
                    >
                        ← Back
                    </button>

                    <h1 style={{
                        fontSize: "1.2rem",
                        fontWeight: "700",
                        margin: "0",
                        color: "#f1f5f9"
                    }}>
                        Contract Simulation
                    </h1>
                </div>

                {/* Center Section: Project Background Button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={() => setShowProjectBackground(true)}
                        style={{
                            padding: "8px 20px",
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                            color: "#60a5fa",
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                            borderRadius: "20px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "500",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.2)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        📋 View Project Background
                    </button>
                </div>

                {/* Right Section: Timer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {timeRemaining !== null && (
                        <div style={{
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#fbbf24',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span>⏱️</span>
                            {formatTime(timeRemaining)}
                        </div>
                    )}
                </div>
            </div>

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

            {/* Re-compete Mode Notification */}
            {isRecompeteMode && (
                <div style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    padding: "16px 20px",
                    margin: "20px 30px",
                    borderRadius: "8px",
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

            {/* Main Layout - 3 Columns */}
            <div style={{
                display: 'flex',
                gap: '20px',
                padding: '30px',
                alignItems: 'flex-start'
            }}>
                {/* LEFT SIDEBAR - Pricing Tiers */}
                <div style={{
                    width: '200px',
                    flexShrink: 0
                }}>
                    <ContributionMarginGraph />

                    {/* Alerts Section - Moved to Left Widget */}
                    <div style={{
                        marginTop: '20px',
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #334155',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                    }}>
                        <h3 style={{
                            margin: '0 0 12px 0',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: hasAlerts ? '#ef4444' : '#10b981',
                            borderBottom: '2px solid #334155',
                            paddingBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            {hasAlerts ? '⚠️ Project Alerts' : '✅ Status'}
                        </h3>


                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {!hasAlerts && (
                                <div style={{
                                    padding: '8px 12px',
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                    fontSize: '12px',
                                    color: '#10b981'
                                }}>
                                    All checks passed
                                </div>
                            )}

                            {isOverBudget && (
                                <div
                                    onClick={() => setActiveAlertPopup({
                                        title: "Budget Exceeded!",
                                        detail: `Your total bid price of ${formatFullK(bidPrice)} exceeds the client budget of $1,000,000. This may lead to disqualification if competitors bid within budget.`
                                    })}

                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        borderRadius: '6px',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        fontSize: '12px',
                                        color: '#f87171',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                                >
                                    <strong>Budget Alert</strong><br />
                                    <span style={{ fontSize: '11px', opacity: 0.8 }}>Bid exceeds $1,000k limit</span>

                                </div>
                            )}

                            {isSeniorSalaryLow && (
                                <div
                                    onClick={() => setActiveAlertPopup({
                                        title: "Salary Constraint!",
                                        detail: "Market data shows that Senior Developers are rejecting offers below $8,000/month. You must adjust your senior developer salaries to at least this level to attract candidates."

                                    })}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        borderRadius: '6px',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        fontSize: '12px',
                                        color: '#f87171',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                                >
                                    <strong>Salary Alert</strong><br />
                                    <span style={{ fontSize: '11px', opacity: 0.8 }}>Senior salary below $8,000</span>

                                </div>
                            )}

                            {durationAlerts.length > 0 && (
                                <div
                                    onClick={() => setActiveAlertPopup({
                                        title: "Timeline Exceeded!",
                                        detail: durationAlerts
                                    })}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        borderRadius: '6px',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        fontSize: '12px',
                                        color: '#f87171',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                                >
                                    <strong>Timeline Alert</strong><br />
                                    <span style={{ fontSize: '11px', opacity: 0.8 }}>{durationAlerts.length} item{durationAlerts.length > 1 ? 's' : ''} exceed 5m</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* CENTER - Main Content */}
                <div style={{
                    flex: 1,
                    maxWidth: '900px',
                    margin: '0 auto'
                }}>
                    {/* Project Background Modal */}
                    {showProjectBackground && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000
                        }}
                            onClick={() => setShowProjectBackground(false)}
                        >
                            <div style={{
                                backgroundColor: "#1e293b",
                                borderRadius: "12px",
                                overflow: "hidden",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                                border: "2px solid #334155",
                                maxWidth: "600px",
                                width: "90%"
                            }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div style={{
                                    backgroundColor: "#0f172a",
                                    color: "#f1f5f9",
                                    padding: "16px 24px",
                                    fontWeight: "600",
                                    fontSize: "18px",
                                    borderBottom: "2px solid #334155",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <span>📋 Project Background</span>
                                    <button
                                        onClick={() => setShowProjectBackground(false)}
                                        style={{
                                            backgroundColor: "transparent",
                                            border: "none",
                                            color: "#94a3b8",
                                            fontSize: "24px",
                                            cursor: "pointer",
                                            padding: "0",
                                            lineHeight: "1",
                                            transition: "color 0.2s ease"
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.color = "#f1f5f9"}
                                        onMouseOut={(e) => e.currentTarget.style.color = "#94a3b8"}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div style={{
                                    backgroundColor: "#1e293b",
                                    padding: "24px",
                                    color: "#e2e8f0",
                                    lineHeight: "1.6",
                                    fontSize: "14px"
                                }}>
                                    <p style={{ margin: "0" }}>
                                        The Project is to automate the manual Test cases. The client expects that the project to be completed within 5
                                        months time and within a budget of 1,000,000 USD. The project shall be awarded to the lowest bidder.
                                    </p>

                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab Navigation */}
                    <div style={{
                        display: 'flex',
                        gap: '0',
                        marginBottom: '0',
                        borderBottom: '2px solid #334155'
                    }}>
                        {tabs.map((tab, index) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    if (gamePhase === 'free' && index <= completedSteps) {
                                        setActiveTab(tab.id);
                                    }
                                }}
                                style={{
                                    flex: 1,
                                    padding: '12px 24px',
                                    backgroundColor: activeTab === tab.id ? '#1e293b' : 'transparent',
                                    color: activeTab === tab.id ? '#10b981' : (index <= completedSteps ? '#94a3b8' : '#475569'),
                                    border: 'none',
                                    borderBottom: activeTab === tab.id ? '3px solid #10b981' : '3px solid transparent',
                                    cursor: (gamePhase === 'free' && index <= completedSteps) ? 'pointer' : 'not-allowed',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease',
                                    borderRadius: '0',
                                    opacity: (gamePhase === 'free' && index <= completedSteps) ? 1 : (gamePhase === 'guided' && activeTab === tab.id ? 1 : 0.4),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                                onMouseOver={(e) => {
                                    if (activeTab !== tab.id && index <= completedSteps) {
                                        e.currentTarget.style.backgroundColor = '#1e293b50';
                                        e.currentTarget.style.color = '#e2e8f0';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (activeTab !== tab.id && index <= completedSteps) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#94a3b8';
                                    }
                                }}
                            >
                                <span>{tab.label}</span>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveInfoPopup(tab.id);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        backgroundColor: activeTab === tab.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.1)',
                                        border: `1px solid ${activeTab === tab.id ? '#10b981' : '#475569'}`,
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        color: activeTab === tab.id ? '#10b981' : '#94a3b8',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                                        e.currentTarget.style.color = '#60a5fa';
                                        e.currentTarget.style.borderColor = '#60a5fa';
                                    }}
                                    onMouseOut={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.style.backgroundColor = activeTab === tab.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.1)';
                                        e.currentTarget.style.color = activeTab === tab.id ? '#10b981' : '#94a3b8';
                                        e.currentTarget.style.borderColor = activeTab === tab.id ? '#10b981' : '#475569';
                                    }}
                                >
                                    i
                                </div>
                            </button>

                        ))}
                    </div>

                    {/* Tab Content */}
                    <div style={{
                        backgroundColor: "#1e293b",
                        borderRadius: "0 0 12px 12px",
                        padding: "15px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                        border: "1px solid #334155",
                        borderTop: 'none',
                        minHeight: '490px',
                        pointerEvents: areInputsDisabled ? 'none' : 'auto',
                        opacity: areInputsDisabled ? 0.8 : 1,
                        transition: 'opacity 0.2s ease'
                    }}>
                        {/* Scope Tab - Deliverables only */}
                        {activeTab === 'scope' && (
                            <div>
                                <DeliverablesSection />
                            </div>
                        )}

                        {/* DC Tab - Two Columns */}
                        {activeTab === 'workplan' && (
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <WorkScheduleSection />
                                    <MonthlySalarySection />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <ResourceAllocationSection />
                                </div>
                            </div>
                        )}

                        {/* IDC Tab */}
                        {activeTab === 'idc' && (
                            <div>
                                <OverheadContingencySection />
                            </div>
                        )}

                        {/* Bid Price Tab */}
                        {activeTab === 'bidprice' && (
                            <div>
                                <BidPriceSection />
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        marginTop: '12px',
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '12px'
                    }}>
                        {gamePhase === 'guided' && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: 'transparent',
                                    color: '#60a5fa',
                                    border: '1px solid #3b82f6',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                ✏️ Edit Options
                            </button>
                        )}

                        {(gamePhase === 'guided' || gamePhase === 'free') && (
                            <button
                                onClick={gamePhase === 'guided' ? handleNextStep : handleSavePlan}
                                style={{
                                    padding: '12px 32px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#2563eb';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '#3b82f6';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {gamePhase === 'guided'
                                    ? (activeTab === 'bidprice' ? 'Finish & Review' : 'Next Step →')
                                    : 'Save the Plan'}
                            </button>
                        )}
                    </div>

                    {/* Bid News Section */}

                </div>

                {/* RIGHT SIDEBAR - Submit & Roadmap */}
                <div style={{
                    width: '220px',
                    flexShrink: 0
                }}>
                    {/* Submit Bid Section */}
                    <div style={{
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid #334155',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{
                            margin: '0 0 15px 0',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#10b981',
                            borderBottom: '2px solid #334155',
                            paddingBottom: '10px'
                        }}>
                            Submit Bid
                        </h3>

                        <div style={{
                            backgroundColor: '#0f172a',
                            border: `2px solid ${contributionMargin >= 0 ? '#10b981' : '#ef4444'}`,
                            borderRadius: '8px',
                            padding: '15px',
                            textAlign: 'center',
                            marginBottom: '15px',
                            boxShadow: `0 4px 8px ${contributionMargin >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                                Contribution Margin
                            </div>
                            <div style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: contributionMargin >= 0 ? '#10b981' : '#ef4444'
                            }}>
                                {formatFullK(Math.round(contributionMargin))}
                            </div>
                        </div>


                        <button
                            onClick={handleSubmit}
                            disabled={completedSteps < 4}
                            style={{
                                width: '100%',
                                padding: '14px 20px',
                                backgroundColor: completedSteps < 4 ? '#334155' : '#10b981',
                                color: completedSteps < 4 ? '#94a3b8' : 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: completedSteps < 4 ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: completedSteps < 4 ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)',
                                opacity: completedSteps < 4 ? 0.7 : 1
                            }}
                            onMouseOver={(e) => {
                                if (completedSteps >= 4) {
                                    e.currentTarget.style.backgroundColor = '#059669';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (completedSteps >= 4) {
                                    e.currentTarget.style.backgroundColor = '#10b981';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                                }
                            }}
                        >
                            {completedSteps < 4 ? '🔒 Complete Plan' : '✓ Submit Bid'}
                        </button>
                    </div>

                    {/* Efficiency Bonus / Max Months - Repositioned Sidebar Box */}
                    {(gamePhase === 'guided' || gamePhase === 'free') && (
                        <div style={{
                            marginBottom: '20px',
                            padding: '16px',
                            backgroundColor: '#1e293b',
                            borderRadius: '12px',
                            border: '1px solid #334155',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {/* Left Side: Efficiency Bonus (Visible ONLY after news) */}
                            {showBonus && (
                                <div style={{ flex: 1, borderRight: '1px solid #334155', paddingRight: '16px' }}>
                                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Efficiency Bonus</div>
                                    <div style={{
                                        fontSize: '22px',
                                        fontWeight: 'bold',
                                        color: (getProjectCompletedEarlyBy() * earlyFinishBonus) > 0 ? '#10b981' : ((getProjectCompletedEarlyBy() * earlyFinishBonus) < 0 ? '#ef4444' : '#60a5fa')
                                    }}>
                                        {formatFullK(getProjectCompletedEarlyBy() * earlyFinishBonus)}
                                    </div>
                                </div>
                            )}

                            {/* Right Side: Max Months (Always visible from the start) */}
                            <div style={{ flex: 1, paddingLeft: showBonus ? '16px' : '0' }}>
                                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Max Months</div>
                                <div style={{
                                    fontSize: '22px',
                                    fontWeight: 'bold',
                                    color: getRawProjectDuration() > expectedProjectDuration ? '#ef4444' : '#10b981'
                                }}>
                                    {getRawProjectDuration().toFixed(1)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bid News Section - Moved below Bonus */}
                    <div style={{
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #334155',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                        minHeight: '200px'
                    }}>
                        <h3 style={{
                            margin: '0 0 12px 0',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#3b82f6',
                            borderBottom: '2px solid #334155',
                            paddingBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            📰 Bid News
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {bidNews.length === 0 ? (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    color: '#64748b',
                                    fontSize: '13px',
                                    fontStyle: 'italic'
                                }}>
                                    No news updates yet...
                                </div>
                            ) : (
                                bidNews.map(news => (
                                    <div key={news.id}
                                        onClick={() => setActiveNewsPopup(news)}
                                        style={{
                                            padding: '8px 12px',
                                            backgroundColor: '#0f172a',
                                            borderRadius: '8px',
                                            border: '1px solid #334155',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            animation: 'fadeIn 0.5s ease-out',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = '#1e293b';
                                            e.currentTarget.style.borderColor = '#475569';
                                            e.currentTarget.style.transform = 'translateX(2px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = '#0f172a';
                                            e.currentTarget.style.borderColor = '#334155';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            backgroundColor: news.type === 'info' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            border: `1px solid ${news.type === 'info' ? '#3b82f6' : '#ef4444'}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '10px',
                                            fontWeight: '700',
                                            color: news.type === 'info' ? '#3b82f6' : '#ef4444',
                                            flexShrink: 0
                                        }}>
                                            {news.type === 'info' ? 'i' : '!'}
                                        </div>
                                        <div>
                                            <div style={{
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                color: '#e2e8f0',
                                                lineHeight: '1.2'
                                            }}>
                                                {news.type === 'info' ? 'Market Update' : 'Competitor Alert'}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>



                </div>
            </div>

            {/* News Popup Modal */}
            {activeNewsPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    animation: 'fadeIn 0.2s ease-out'
                }}
                    onClick={() => {
                        if (activeNewsPopup.id === 99 && gamePhase === 'guided') {
                            setGamePhase('review');
                        }
                        setActiveNewsPopup(null);
                    }}
                >
                    <div style={{
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        border: '1px solid #334155',
                        width: '400px',
                        maxWidth: '90%',
                        overflow: 'hidden',
                        animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{
                            padding: '16px',
                            borderBottom: '1px solid #334155',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: activeNewsPopup.type === 'info' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '12px 12px 0 0'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '18px' }}>
                                    {activeNewsPopup.type === 'info' ? '📰' : '🕵️'}
                                </span>
                                <span style={{
                                    fontWeight: '600',
                                    color: activeNewsPopup.type === 'info' ? '#60a5fa' : '#f87171',
                                    fontSize: '14px'
                                }}>
                                    {activeNewsPopup.type === 'info' ? 'Market Update' : 'Competitor Intel'}
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    if (activeNewsPopup.id === 99 && gamePhase === 'guided') {
                                        setGamePhase('review');
                                    }
                                    setActiveNewsPopup(null);
                                }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#94a3b8',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '4px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#94a3b8';
                                }}
                            >
                                ✕
                            </button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            {activeNewsPopup.id === 99 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {bidNews.filter(n => n.id === 1 || n.id === 2 || n.id === 3).map((item) => (
                                        <div key={item.id} style={{
                                            padding: '16px',
                                            backgroundColor: item.type === 'info' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                                            borderRadius: '8px',
                                            border: `1px solid ${item.type === 'info' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                        }}>
                                            <div style={{
                                                fontSize: '11px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                fontWeight: '700',
                                                color: item.type === 'info' ? (item.id === 3 ? '#10b981' : '#60a5fa') : '#f87171',
                                                marginBottom: '6px'
                                            }}>
                                                {item.id === 3 ? 'Contract Clause Revealed' : (item.type === 'info' ? 'Market Intelligence' : 'Competitor Broadcast')}
                                            </div>
                                            <p style={{
                                                margin: 0,
                                                color: '#e2e8f0',
                                                fontSize: '14px',
                                                lineHeight: '1.5'
                                            }}>
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{
                                    margin: 0,
                                    color: '#e2e8f0',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {activeNewsPopup.text}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Alert Detail Popup */}
            {activeAlertPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        backgroundColor: '#1e293b',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '450px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid #334155'
                    }}>
                        <div style={{
                            padding: '24px',
                            borderBottom: '1px solid #334155',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#0f172a'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#f87171' }}>
                                ⚠️ {activeAlertPopup.title}
                            </h3>
                            <button
                                onClick={() => setActiveAlertPopup(null)}
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: '#94a3b8',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    padding: '0 8px'
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            {Array.isArray(activeAlertPopup.detail) ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <p style={{ margin: 0, color: '#e2e8f0', fontSize: '14px', lineHeight: '1.5' }}>
                                        The following items have exceeded the project duration limit of 5 months:
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {activeAlertPopup.detail.map((item, idx) => (
                                            <div key={idx} style={{
                                                padding: '10px 15px',
                                                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                color: '#f87171',
                                                fontSize: '13px',
                                                fontWeight: '500'
                                            }}>
                                                • {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p style={{
                                    margin: 0,
                                    color: '#e2e8f0',
                                    fontSize: '14px',
                                    lineHeight: '1.5'
                                }}>
                                    {activeAlertPopup.detail}
                                </p>
                            )}
                            <button
                                onClick={() => setActiveAlertPopup(null)}
                                style={{
                                    width: '100%',
                                    marginTop: '24px',
                                    padding: '12px',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Modal */}
            {activeInfoPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    backdropFilter: 'blur(4px)'
                }}
                    onClick={() => setActiveInfoPopup(null)}
                >
                    <div style={{
                        backgroundColor: "#1e293b",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
                        border: "1px solid #334155",
                        maxWidth: "450px",
                        width: "90%"
                    }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{
                            backgroundColor: "#0f172a",
                            color: "#f1f5f9",
                            padding: "20px 24px",
                            fontWeight: "700",
                            fontSize: "18px",
                            borderBottom: "1px solid #334155",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <span>ℹ️ {SECTION_INFO[activeInfoPopup].title}</span>
                            <button
                                onClick={() => setActiveInfoPopup(null)}
                                style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    color: "#94a3b8",
                                    fontSize: "24px",
                                    cursor: "pointer",
                                    padding: "0",
                                    lineHeight: "1"
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div style={{
                            padding: "24px",
                            color: "#cbd5e1",
                            lineHeight: "1.6",
                            fontSize: "15px",
                            textAlign: 'center'
                        }}>
                            {SECTION_INFO[activeInfoPopup].description}
                        </div>
                        <div style={{
                            padding: "16px 24px",
                            backgroundColor: "#0f172a50",
                            display: 'flex',
                            justifyContent: 'center',
                            borderTop: '1px solid #334155'
                        }}>
                            <button
                                onClick={() => setActiveInfoPopup(null)}
                                style={{
                                    padding: '8px 24px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Review Your Bid Modal */}
            {gamePhase === 'review' && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3000,
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        backgroundColor: '#1e293b',
                        padding: '40px',
                        borderRadius: '16px',
                        border: '1px solid #334155',
                        maxWidth: '600px',
                        width: '90%',
                        textAlign: 'center',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <h2 style={{ fontSize: '32px', marginBottom: '32px', color: '#f8fafc', fontWeight: '700' }}>Review Your Bid</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px', textAlign: 'left' }}>
                            <div style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
                                <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Bid Price</div>
                                <div style={{ fontSize: '32px', fontWeight: '800', color: '#60a5fa' }}>{formatFullK(bidPrice)}</div>
                            </div>
                            <div style={{
                                backgroundColor: '#0f172a',
                                padding: '24px',
                                borderRadius: '12px',
                                border: `2px solid ${contributionMargin >= 0 ? '#10b981' : '#ef4444'}`,
                                boxShadow: `0 4px 20px ${contributionMargin >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contribution Margin</div>
                                <div style={{ fontSize: '32px', fontWeight: '800', color: contributionMargin >= 0 ? '#10b981' : '#ef4444' }}>
                                    {formatFullK(contributionMargin)}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <button
                                onClick={() => {
                                    setGamePhase('free');
                                    setIsEditing(true);
                                }}
                                style={{
                                    padding: '14px 28px',
                                    backgroundColor: 'transparent',
                                    border: '2px solid #475569',
                                    color: '#cbd5e1',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.borderColor = '#64748b';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = '#475569';
                                }}
                            >
                                Edit Anything
                            </button>
                            <button
                                onClick={() => {
                                    handleSubmit();
                                    setGamePhase('submitted');
                                }}
                                style={{
                                    padding: '14px 40px',
                                    backgroundColor: '#10b981',
                                    border: 'none',
                                    color: 'white',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#059669';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '#10b981';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                                }}
                            >
                                Submit Bid
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
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
