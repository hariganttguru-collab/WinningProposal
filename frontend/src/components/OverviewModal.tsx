import { useProjectData } from '../context/ProjectDataContext';

interface OverviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function OverviewModal({ isOpen, onClose }: OverviewModalProps) {
    const {
        deliverables,
        estimationAccuracy,
        getTotalResourceCost,
        getTotalCost,
        getProjectDuration,
        getContributionMarginIncludingBonus,
        bidPrice
    } = useProjectData();

    if (!isOpen) return null;

    const totalDeliverables = deliverables.reduce((sum, d) => sum + d.quantity, 0);
    const totalResourceCost = getTotalResourceCost();
    const totalCost = getTotalCost();
    const contributionMargin = getContributionMarginIncludingBonus();
    const projectDuration = getProjectDuration();

    const stages = [
        {
            number: 1,
            title: 'Deliverables & Effort',
            output: `Total Deliverables: ${totalDeliverables} | Accuracy: ${estimationAccuracy}%`
        },
        {
            number: 2,
            title: 'Resource Allocation',
            output: 'UI & Backend Developers Allocated'
        },
        {
            number: 3,
            title: 'Work Schedule & Person Months',
            output: `Project Duration: ${projectDuration} months`
        },
        {
            number: 4,
            title: 'Monthly Salary & Resource Cost',
            output: `Total Resource Cost: $${Math.round(totalResourceCost).toLocaleString()}`
        },
        {
            number: 5,
            title: 'Overhead & Contingency',
            output: `Total Cost: $${Math.round(totalCost).toLocaleString()}`
        },
        {
            number: 6,
            title: 'Bid Price',
            output: `Bid Price: $${Math.round(bidPrice).toLocaleString()}`
        },
        {
            number: 7,
            title: 'Contribution Margin',
            output: `Margin: $${Math.round(contributionMargin).toLocaleString()}`
        }
    ];

    const handleStageClick = (sectionNumber: number) => {
        const sectionElement = document.getElementById(`section-${sectionNumber}`);
        if (sectionElement) {
            sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            onClose();
        }
    };

    return (
        <>
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 9998,
                    backdropFilter: 'blur(4px)'
                }}
            />

            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#1e293b',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                border: '1px solid #334155',
                zIndex: 9999,
                maxWidth: '800px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                    backgroundColor: '#0f172a',
                    padding: '24px 30px',
                    borderBottom: '1px solid #334155',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#f1f5f9'
                    }}>
                        Project Overview
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            fontSize: '28px',
                            cursor: 'pointer',
                            padding: '0',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '6px',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                            e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#94a3b8';
                        }}
                    >
                        ×
                    </button>
                </div>

                <div style={{
                    padding: '30px',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '16px'
                    }}>
                        {stages.map((stage) => (
                            <div
                                key={stage.number}
                                onClick={() => handleStageClick(stage.number)}
                                style={{
                                    backgroundColor: '#1e293b',
                                    border: '2px solid #475569',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#475569';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '12px'
                                }}>
                                    <div style={{
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        flexShrink: 0
                                    }}>
                                        {stage.number}
                                    </div>
                                    <h3 style={{
                                        margin: 0,
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#f1f5f9'
                                    }}>
                                        {stage.title}
                                    </h3>
                                </div>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#94a3b8',
                                    fontWeight: '500'
                                }}>
                                    {stage.output}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{
                    backgroundColor: '#0f172a',
                    padding: '20px 30px',
                    borderTop: '1px solid #334155',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{
                        fontSize: '14px',
                        color: '#94a3b8'
                    }}>
                        Click on any section to navigate
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 24px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
