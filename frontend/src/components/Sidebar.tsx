import { useState } from 'react';
import { useProjectData } from '../context/ProjectDataContext';

interface SidebarItem {
    id: string;
    number: number;
    title: string;
}

interface SidebarProps {
    timeRemaining?: number | null;
}

export default function Sidebar({ timeRemaining }: SidebarProps) {
    const [hoveredInfo, setHoveredInfo] = useState<number | null>(null);
    const { getContributionMarginIncludingBonus } = useProjectData();

    const contributionMargin = getContributionMarginIncludingBonus();

    // Format time remaining
    const formatTimeRemaining = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Info tooltips for each stage
    const stageInfo: Record<number, string> = {
        1: 'Define project deliverables (Complex/Simple Screens and Databases) with quantities and effort per unit. Set estimation accuracy to calculate adjusted quantities and total costs.',
        2: 'Allocate UI Developers (Senior/Junior) for Screen deliverables and Backend Developers (Senior/Junior) for Database deliverables. Specify the number of each resource type needed.',
        3: 'Set working parameters (days per month, hours per day) and view calculated person months for each deliverable. Values exceeding 5 months are highlighted in red.',
        4: 'Enter monthly salaries for all resource types and view the total resource cost summary showing calculated costs for each deliverable type.',
        5: 'Set percentage values for Contingency, Overhead, and Quality (Rework) costs. These are calculated as percentages of the total resource cost.',
        6: 'Enter your bid price. The system will alert you if it exceeds the client budget of $500,000. This is your final proposal amount.'
    };

    const sidebarItems: SidebarItem[] = [
        { id: 'deliverables', number: 1, title: 'Deliverables & Effort' },
        { id: 'resource-allocation', number: 2, title: 'Resource Allocation' },
        { id: 'work-schedule', number: 3, title: 'Work Schedule & Person Months' },
        { id: 'monthly-salary', number: 4, title: 'Monthly Salary & Resource Cost' },
        { id: 'overhead-contingency', number: 5, title: 'Overhead & Contingency' },
        { id: 'bid-price', number: 6, title: 'Bid Price' }
    ];

    const handleSectionClick = (sectionNumber: number) => {
        // Map sidebar numbers to actual section IDs
        const sectionIdMap: Record<number, number> = {
            1: 1,  // Deliverables
            2: 2,  // Resource Allocation
            3: 3,  // Work Schedule
            4: 5,  // Monthly Salary
            5: 7,  // Overhead & Contingency
            6: 8   // Bid Price
        };

        const sectionId = sectionIdMap[sectionNumber];
        const sectionElement = document.getElementById(`section-${sectionId}`);
        if (sectionElement) {
            sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div style={{
            position: 'fixed',
            left: '0',
            top: '0',
            height: '100vh',
            zIndex: 1000,
            backgroundColor: '#0f172a',
            borderRight: 'none',
            padding: '20px 20px 100px 20px',
            boxShadow: '4px 0 20px rgba(59, 130, 246, 0.1)',
            overflowY: 'auto',
            width: '300px',
            boxSizing: 'border-box'
        }}>
            {/* Title */}
            <div style={{
                color: '#f1f5f9',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '20px',
                marginTop: '10px',
                textAlign: 'center',
                borderBottom: '2px solid rgba(59, 130, 246, 0.3)',
                paddingBottom: '15px'
            }}>
                Contract Navigation
            </div>

            {/* Timer Display */}
            {timeRemaining !== null && timeRemaining !== undefined && timeRemaining > 0 && (
                <div style={{
                    backgroundColor: timeRemaining < 60000 ? '#7f1d1d' : timeRemaining < 120000 ? '#92400e' : '#0f172a',
                    border: `2px solid ${timeRemaining < 60000 ? '#dc2626' : timeRemaining < 120000 ? '#f59e0b' : '#8b5cf6'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
                }}>
                    <div style={{
                        color: '#94a3b8',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'center'
                    }}>
                        ⏱️ Time Remaining
                    </div>
                    <div style={{
                        backgroundColor: timeRemaining < 60000 ? '#dc2626' : timeRemaining < 120000 ? '#f59e0b' : '#8b5cf6',
                        color: 'white',
                        fontSize: '32px',
                        fontWeight: '700',
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontFamily: 'monospace'
                    }}>
                        {formatTimeRemaining(timeRemaining)}
                    </div>
                </div>
            )}

            {/* Contribution Margin Display */}
            <div style={{
                backgroundColor: '#0f172a',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
            }}>
                <div style={{
                    color: '#94a3b8',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Contribution Margin
                </div>
                <div style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '700',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    ${Math.round(contributionMargin).toLocaleString()}
                </div>


                <div style={{
                    color: '#64748b',
                    fontSize: '11px',
                    marginTop: '8px',
                    textAlign: 'center',
                    lineHeight: '1.4'
                }}>
                    Including Penalty & Bonus
                </div>
            </div>

            {/* Navigation Items */}
            <div>
                {sidebarItems.map((item) => {
                    return (
                        <div key={item.id} style={{ position: 'relative' }}>
                            <button
                                onClick={() => handleSectionClick(item.number)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                    padding: '12px 15px',
                                    margin: '2px 0',
                                    background: 'rgba(30, 41, 59, 0.5)',
                                    border: '1px solid rgba(51, 65, 85, 0.5)',
                                    borderRadius: '8px',
                                    color: '#e2e8f0',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'normal',
                                    textAlign: 'left',
                                    transition: 'all 0.2s ease',
                                    justifyContent: 'flex-start'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                                    e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.5)';
                                }}
                            >
                                {/* Number Badge */}
                                <div style={{
                                    backgroundColor: 'rgba(51, 65, 85, 0.8)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    marginRight: '12px',
                                    flexShrink: 0
                                }}>
                                    {item.number}
                                </div>

                                {/* Title */}
                                <span style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                }}>
                                    {item.title}
                                </span>

                                {/* Info Icon */}
                                <div
                                    style={{
                                        marginLeft: '8px',
                                        flexShrink: 0
                                    }}
                                    onMouseEnter={() => setHoveredInfo(item.number)}
                                    onMouseLeave={() => setHoveredInfo(null)}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        cursor: 'help',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        i
                                    </div>
                                </div>
                            </button>

                            {/* Tooltip */}
                            {hoveredInfo === item.number && (
                                <div style={{
                                    position: 'fixed',
                                    left: '320px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: '#0f172a',
                                    border: '2px solid #3b82f6',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    width: '350px',
                                    maxWidth: '350px',
                                    zIndex: 99999,
                                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.8)',
                                    fontSize: '13px',
                                    color: '#e2e8f0',
                                    lineHeight: '1.6',
                                    pointerEvents: 'none'
                                }}>
                                    <div style={{
                                        fontWeight: 'bold',
                                        color: '#60a5fa',
                                        marginBottom: '8px',
                                        fontSize: '14px'
                                    }}>
                                        {item.title}
                                    </div>
                                    <div style={{
                                        color: '#cbd5e1'
                                    }}>
                                        {stageInfo[item.number]}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
