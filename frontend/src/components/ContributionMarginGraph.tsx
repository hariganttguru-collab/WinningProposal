import { useProjectData } from '../context/ProjectDataContext';

export default function ContributionMarginGraph() {
    const {
        bidPrice,
        getTotalResourceCost,
        getContributionMarginIncludingBonus,
        contingencyPercent,
        overheadPercent,
        qualityPercent
    } = useProjectData();

    // Calculate costs
    const directCost = getTotalResourceCost(); // DC
    const resourceCost = getTotalResourceCost();
    const indirectCost = resourceCost * ((contingencyPercent + overheadPercent + qualityPercent) / 100); // IDC
    const contributionMargin = getContributionMarginIncludingBonus(); // Use the same value shown in Submit Bid

    // Calculate percentages (all relative to bid price)
    const dcPercent = bidPrice > 0 ? (directCost / bidPrice) * 100 : 0;
    const idcPercent = bidPrice > 0 ? (indirectCost / bidPrice) * 100 : 0;
    const cmPercent = bidPrice > 0 ? (contributionMargin / bidPrice) * 100 : 0;

    return (
        <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            padding: '12px',
            border: '1px solid #334155',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            height: '100%'
        }}>
            <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#10b981',
                borderBottom: '2px solid #334155',
                paddingBottom: '8px',
                textAlign: 'center'
            }}>
                Contribution Margin
            </h3>

            {/* Check if contribution margin is negative */}
            {contributionMargin < 0 ? (
                <div style={{
                    width: '100%',
                    height: '330px',
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    border: '1px solid #ef4444',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                }}>
                    <div style={{
                        fontSize: '28px',
                        marginBottom: '10px'
                    }}>⚠️</div>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#ef4444',
                        marginBottom: '6px',
                        lineHeight: '1.3'
                    }}>
                        Contribution Margin<br />is Negative
                    </div>
                    <div style={{
                        fontSize: '10px',
                        color: '#94a3b8',
                        lineHeight: '1.4'
                    }}>
                        Adjust inputs for<br />positive margin
                    </div>
                </div>
            ) : (
                /* Vertical Stacked Bar Graph */
                <div style={{
                    width: '100%',
                    height: '328px',
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    border: '1px solid #334155',
                    position: 'relative'
                }}>
                    {/* Direct Cost Segment (Bottom) */}
                    <div style={{
                        height: `${dcPercent}%`,
                        backgroundColor: '#ef4444',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '13px',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        padding: '8px'
                    }}>
                        {dcPercent > 8 && (
                            <>
                                <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                                    {dcPercent.toFixed(1)}%
                                </div>
                                <div style={{ fontSize: '10px', opacity: 0.9 }}>
                                    Direct Cost
                                </div>
                            </>
                        )}
                    </div>

                    {/* Indirect Cost Segment (Middle) */}
                    <div style={{
                        height: `${idcPercent}%`,
                        backgroundColor: '#f59e0b',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '13px',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        padding: '8px'
                    }}>
                        {idcPercent > 8 && (
                            <>
                                <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                                    {idcPercent.toFixed(1)}%
                                </div>
                                <div style={{ fontSize: '10px', opacity: 0.9 }}>
                                    Indirect Cost
                                </div>
                            </>
                        )}
                    </div>


                    {/* Contribution Margin Segment (Top) */}
                    <div style={{
                        height: `${cmPercent}%`,
                        minHeight: '35px',
                        backgroundColor: '#10b981',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '13px',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        padding: '8px'
                    }}>
                        <>
                            <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                                {cmPercent.toFixed(1)}%
                            </div>
                            <div style={{ fontSize: '10px', opacity: 0.9 }}>
                                Contribution Margin
                            </div>
                        </>
                    </div>
                </div>
            )}
        </div>
    );
}
