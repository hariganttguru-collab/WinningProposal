import { useProjectData } from '../context/ProjectDataContext';

export default function PersonMonthsSection() {
    const {
        deliverables,
        estimationAccuracy,
        screenAllocations,
        databaseAllocations,
        workingDaysPerMonth,
        workingHoursPerDay,
        salaries,
        seniorToJuniorProductivity
    } = useProjectData();

    const calculateAdjustedQuantity = (quantity: number) => {
        return quantity * (100 / estimationAccuracy);
    };

    const calculateCost = (quantity: number, effortPerUnit: number) => {
        const adjustedQuantity = calculateAdjustedQuantity(quantity);
        return adjustedQuantity * effortPerUnit;
    };

    const calculatePersonHours = (deliverableName: string, cost: number) => {
        const isUIDeliverable = deliverableName.includes('Screen');

        if (isUIDeliverable) {
            const allocation = screenAllocations.find(a => a.deliverable === deliverableName);
            if (!allocation) return 0;
            const junior = allocation.uiJunior || 0;
            const senior = allocation.uiSenior || 0;
            const denominator = junior + (senior * seniorToJuniorProductivity);
            return denominator > 0 ? cost / denominator : 0;
        } else {
            const allocation = databaseAllocations.find(a => a.deliverable === deliverableName);
            if (!allocation) return 0;
            const junior = allocation.backendJunior || 0;
            const senior = allocation.backendSenior || 0;
            const denominator = junior + (senior * seniorToJuniorProductivity);
            return denominator > 0 ? cost / denominator : 0;
        }
    };

    const calculatePersonDays = (personHours: number) => {
        return workingHoursPerDay > 0 ? personHours / workingHoursPerDay : 0;
    };

    const calculatePersonMonths = (personDays: number) => {
        return workingDaysPerMonth > 0 ? personDays / workingDaysPerMonth : 0;
    };

    const calculateMonthsOfEngagement = (personMonths: number) => {
        return Math.ceil(personMonths);
    };

    const calculateCostOfJuniors = (deliverableName: string, monthsOfEngagement: number) => {
        const isUIDeliverable = deliverableName.includes('Screen');

        if (isUIDeliverable) {
            const allocation = screenAllocations.find(a => a.deliverable === deliverableName);
            if (!allocation) return 0;
            const juniorCount = allocation.uiJunior || 0;
            return salaries.uiJunior * monthsOfEngagement * juniorCount;
        } else {
            const allocation = databaseAllocations.find(a => a.deliverable === deliverableName);
            if (!allocation) return 0;
            const juniorCount = allocation.backendJunior || 0;
            return salaries.backendJunior * monthsOfEngagement * juniorCount;
        }
    };

    const calculateCostOfSeniors = (deliverableName: string, monthsOfEngagement: number) => {
        const isUIDeliverable = deliverableName.includes('Screen');

        if (isUIDeliverable) {
            const allocation = screenAllocations.find(a => a.deliverable === deliverableName);
            if (!allocation) return 0;
            const seniorCount = allocation.uiSenior || 0;
            return salaries.uiSenior * monthsOfEngagement * seniorCount;
        } else {
            const allocation = databaseAllocations.find(a => a.deliverable === deliverableName);
            if (!allocation) return 0;
            const seniorCount = allocation.backendSenior || 0;
            return salaries.backendSenior * monthsOfEngagement * seniorCount;
        }
    };

    const calculateTotalCost = (costOfJuniors: number, costOfSeniors: number) => {
        return costOfJuniors + costOfSeniors;
    };

    return (
        <div id="section-6" style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            border: "1px solid #334155",
            display: "flex",
            flexDirection: "column",
            width: "100%"
        }}>
            <div style={{
                backgroundColor: "#0f172a",
                color: "#f1f5f9",
                padding: "20px 30px",
                fontWeight: "600",
                fontSize: "20px",
                borderBottom: "1px solid #334155"
            }}>
                Resource Cost Summary
            </div>

            <div style={{
                padding: "40px",
                color: "#e2e8f0"
            }}>
                {/* Summary Display */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px"
                }}>
                    {deliverables.map((deliverable, index) => {
                        const cost = calculateCost(deliverable.quantity, deliverable.effortPerUnit);
                        const personHours = calculatePersonHours(deliverable.name, cost);
                        const personDays = calculatePersonDays(personHours);
                        const personMonths = calculatePersonMonths(personDays);
                        const monthsOfEngagement = calculateMonthsOfEngagement(personMonths);
                        const costOfJuniors = calculateCostOfJuniors(deliverable.name, monthsOfEngagement);
                        const costOfSeniors = calculateCostOfSeniors(deliverable.name, monthsOfEngagement);
                        const totalCost = calculateTotalCost(costOfJuniors, costOfSeniors);

                        return (
                            <div key={index} style={{
                                backgroundColor: "#0f172a",
                                borderRadius: "8px",
                                padding: "20px",
                                border: "1px solid #334155",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <span style={{
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    color: "#e2e8f0"
                                }}>
                                    {deliverable.name}
                                </span>
                                <span style={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    color: "#3b82f6"
                                }}>
                                    ${totalCost.toLocaleString()}
                                </span>
                            </div>
                        );
                    })}

                    {/* Grand Total */}
                    <div style={{
                        backgroundColor: "#3b82f6",
                        borderRadius: "8px",
                        padding: "24px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "8px"
                    }}>
                        <span style={{
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "white"
                        }}>
                            Total Resource Cost
                        </span>
                        <span style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "white"
                        }}>
                            ${deliverables.reduce((sum, d) => {
                                const cost = calculateCost(d.quantity, d.effortPerUnit);
                                const personHours = calculatePersonHours(d.name, cost);
                                const personDays = calculatePersonDays(personHours);
                                const personMonths = calculatePersonMonths(personDays);
                                const monthsOfEngagement = calculateMonthsOfEngagement(personMonths);
                                const costOfJuniors = calculateCostOfJuniors(d.name, monthsOfEngagement);
                                const costOfSeniors = calculateCostOfSeniors(d.name, monthsOfEngagement);
                                return sum + calculateTotalCost(costOfJuniors, costOfSeniors);
                            }, 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
