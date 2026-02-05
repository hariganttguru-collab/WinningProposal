import { useState, useEffect } from 'react';
import { useContract } from '../context/ContractContext';

interface SidebarItem {
    id: string;
    number: number;
    title: string;
    completed?: boolean;
}

export default function FloatingSidebar() {
    const [activeSection, setActiveSection] = useState('');
    const [showBidPrice, setShowBidPrice] = useState(false);

    // Get contract context for final bid calculation
    const {
        getTotalResourceCost,
        getOnsiteCoordinatorCost,
        getTotalInfrastructureCost,
        getTotalSubContractCost,
        getTotalContingencyCost,
        getTotalProjectManagementCost,
        getResourceCostAfterSubcontracting,
        overheadProfitInput,
        getTotalFinancingCharges
    } = useContract();

    const sidebarItems: SidebarItem[] = [
        { id: 'wbs', number: 1, title: 'WBS' },
        { id: 'effort', number: 2, title: 'Effort Estimation' },
        { id: 'resource-planning', number: 3, title: 'Resource Planning' },
        { id: 'resource-cost', number: 4, title: 'Resource Cost' },
        { id: 'project-management', number: 5, title: 'Project Management' },
        { id: 'heuristic', number: 6, title: 'Heuristic/Risk Buffer' },
        { id: 'onsite', number: 7, title: 'Onsite Coordinator' },
        { id: 'subcontract', number: 8, title: 'Sub Contract Cost' },
        { id: 'risk-contingency', number: 9, title: 'Risk/Contingency' },
        { id: 'infrastructure', number: 10, title: 'Infrastructure Cost' },
        { id: 'overhead', number: 11, title: 'Overhead Charges' },
        { id: 'financing', number: 12, title: 'Financing Charges' },
        { id: 'profit', number: 13, title: 'Profit' },
        { id: 'final-bid', number: 14, title: 'Final Bid Summary' }
    ];

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
    };

    // Track active section based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            const sections = sidebarItems.map(item => document.getElementById(item.id)).filter(Boolean);
            const scrollPosition = window.scrollY + 100; // Offset for better detection

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(sidebarItems[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Calculate final bid price in real-time
    const calculateFinalBidPrice = () => {
        try {
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
            const profitPercentageDecimal = overheadProfitInput.profitPercentage / 100;
            const finalBidPrice = totalCostBeforeProfit / (1 - profitPercentageDecimal);

            return finalBidPrice;
        } catch (error) {
            return 0;
        }
    };

    const finalBidPrice = calculateFinalBidPrice();

    return (
        <div style={{
            position: 'fixed',
            left: '0',
            top: '0',
            height: '100vh',
            zIndex: 1000,
            backgroundColor: 'rgba(45, 45, 45, 0.98)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            padding: isCollapsed ? '10px' : '20px',
            boxShadow: '2px 0 10px rgba(0, 0, 0, 0.3)',
            overflowY: 'auto',
            width: isCollapsed ? '80px' : '320px',
            transition: 'all 0.3s ease'
        }}>
            {/* Collapse/Expand Button */}
            <button
                onClick={() => {
                    const newCollapsed = !isCollapsed;
                    setIsCollapsed(newCollapsed);
                    // Dispatch event to notify parent component
                    window.dispatchEvent(new CustomEvent('sidebarToggle', {
                        detail: { collapsed: newCollapsed }
                    }));
                }}
                style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
                {isCollapsed ? '→' : '←'}
            </button>

            {/* Title */}
            {!isCollapsed && (
                <div style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    marginTop: '50px',
                    textAlign: 'center',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                    paddingBottom: '15px'
                }}>
                    Contract Navigation
                </div>
            )}

            {/* Navigation Items */}
            <div style={{ marginTop: isCollapsed ? '35px' : '0' }}>
                {sidebarItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: isCollapsed ? '8px' : '12px 15px',
                            margin: '2px 0',
                            background: activeSection === item.id
                                ? 'rgba(40, 167, 69, 0.3)'
                                : 'rgba(255, 255, 255, 0.05)',
                            border: activeSection === item.id
                                ? '2px solid #28a745'
                                : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: activeSection === item.id ? '#28a745' : 'white',
                            cursor: 'pointer',
                            fontSize: isCollapsed ? '12px' : '14px',
                            fontWeight: activeSection === item.id ? 'bold' : 'normal',
                            textAlign: 'left',
                            transition: 'all 0.2s ease',
                            justifyContent: isCollapsed ? 'center' : 'flex-start'
                        }}
                        onMouseOver={(e) => {
                            if (activeSection !== item.id) {
                                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (activeSection !== item.id) {
                                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }
                        }}
                    >
                        {/* Number Badge */}
                        <div style={{
                            backgroundColor: activeSection === item.id ? '#28a745' : 'rgba(255, 255, 255, 0.2)',
                            color: activeSection === item.id ? 'white' : '#ccc',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginRight: isCollapsed ? '0' : '12px',
                            flexShrink: 0
                        }}>
                            {item.number}
                        </div>

                        {/* Title */}
                        {!isCollapsed && (
                            <span style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {item.title}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Progress Indicator */}
            {!isCollapsed && (
                <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        color: '#ccc',
                        fontSize: '12px',
                        marginBottom: '5px'
                    }}>
                        Progress
                    </div>
                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        height: '6px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            backgroundColor: '#28a745',
                            height: '100%',
                            width: `${((sidebarItems.findIndex(item => item.id === activeSection) + 1) / sidebarItems.length) * 100}%`,
                            borderRadius: '10px',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                    <div style={{
                        color: '#28a745',
                        fontSize: '11px',
                        marginTop: '5px',
                        fontWeight: 'bold'
                    }}>
                        {sidebarItems.findIndex(item => item.id === activeSection) + 1} / {sidebarItems.length}
                    </div>
                </div>
            )}

            {/* Final Bid Price Toggle Button */}
            <button
                onClick={() => setShowBidPrice(!showBidPrice)}
                style={{
                    width: '100%',
                    padding: isCollapsed ? '8px' : '12px',
                    marginTop: '10px',
                    background: showBidPrice
                        ? 'linear-gradient(135deg, #28a745, #20c997)'
                        : 'rgba(40, 167, 69, 0.2)',
                    border: '2px solid #28a745',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: isCollapsed ? '12px' : '14px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}
                onMouseOver={(e) => {
                    if (!showBidPrice) {
                        e.target.style.background = 'rgba(40, 167, 69, 0.3)';
                    }
                }}
                onMouseOut={(e) => {
                    if (!showBidPrice) {
                        e.target.style.background = 'rgba(40, 167, 69, 0.2)';
                    }
                }}
            >
                {isCollapsed ? '💰' : (
                    <>
                        <span>💰</span>
                        <span>{showBidPrice ? 'Hide' : 'Show'} Final Bid</span>
                    </>
                )}
            </button>

            {/* Final Bid Price Display */}
            {showBidPrice && !isCollapsed && (
                <div style={{
                    marginTop: '10px',
                    padding: '15px',
                    background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.2), rgba(32, 201, 151, 0.2))',
                    border: '2px solid #28a745',
                    borderRadius: '12px',
                    textAlign: 'center',
                    animation: 'pulse 2s infinite'
                }}>
                    <div style={{
                        color: '#28a745',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Final Bid Price
                    </div>
                    <div style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        ${finalBidPrice.toFixed(0)}
                    </div>
                    <div style={{
                        color: '#ccc',
                        fontSize: '10px',
                        marginTop: '5px',
                        fontStyle: 'italic'
                    }}>
                        Updates in real-time
                    </div>
                </div>
            )}

            {/* Collapsed Bid Price Display */}
            {showBidPrice && isCollapsed && (
                <div style={{
                    marginTop: '10px',
                    padding: '8px',
                    background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.2), rgba(32, 201, 151, 0.2))',
                    border: '2px solid #28a745',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>
                        ${(finalBidPrice / 1000).toFixed(0)}K
                    </div>
                </div>
            )}
        </div>
    );
}