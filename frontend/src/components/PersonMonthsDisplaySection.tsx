import { useProjectData } from '../context/ProjectDataContext';

interface Deliverable {
    name: string;
    quantity: number;
    effortPerUnit: number;
}

export default function PersonMonthsDisplaySection() {
    const {
        deliverables,
        estimationAccuracy,
        screenAllocations,
        databaseAllocations,
        workingDaysPerMonth,
        workingHoursPerDay,
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

    const hasTimelineAlert = deliverables.some(d => {
        const cost = calculateCost(d.quantity, d.effortPerUnit);
        const personHours = calculatePersonHours(d.name, cost);
        const personDays = calculatePersonDays(personHours);
        const personMonths = calculatePersonMonths(personDays);
        return personMonths > 5;
    });

    return (
        <div id="section-4" style={{
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
                Person Months
            </div>

            <div style={{
                padding: "40px",
                color: "#e2e8f0"
            }}>
                {/* Timeline Alert */}
                {hasTimelineAlert && (
                    <div style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        padding: "16px 20px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        border: "2px solid #dc2626",
                        marginBottom: "24px"
                    }}>
                        <span style={{ fontSize: "24px" }}>⚠️</span>
                        <div>
                            <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>
                                Timeline Alert!
                            </div>
                            <div style={{ fontSize: "14px" }}>
                                One or more deliverables exceed the 5-month project timeline. Please adjust resource allocation or deliverable quantities.
                            </div>
                        </div>
                    </div>
                )}

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
                                    backgroundColor: "#60a5fa",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    color: "#0f172a",
                                    textAlign: "left",
                                    width: "50%"
                                }}>
                                    Deliverables
                                </th>
                                <th style={{
                                    backgroundColor: "#67e8f9",
                                    padding: "16px 20px",
                                    borderBottom: "2px solid #334155",
                                    borderLeft: "1px solid #334155",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    color: "#0f172a",
                                    textAlign: "center",
                                    width: "50%"
                                }}>
                                    Person Months
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliverables.map((deliverable, index) => {
                                const cost = calculateCost(deliverable.quantity, deliverable.effortPerUnit);
                                const personHours = calculatePersonHours(deliverable.name, cost);
                                const personDays = calculatePersonDays(personHours);
                                const personMonths = calculatePersonMonths(personDays);
                                const isOverTimeline = personMonths > 5;

                                return (
                                    <tr key={index}>
                                        <td style={{
                                            padding: "16px 20px",
                                            borderBottom: index < deliverables.length - 1 ? "1px solid #334155" : "none",
                                            backgroundColor: "#1e293b",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {deliverable.name}
                                        </td>
                                        <td style={{
                                            padding: "16px 20px",
                                            borderBottom: index < deliverables.length - 1 ? "1px solid #334155" : "none",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: isOverTimeline ? "#ef4444" : "#67e8f9",
                                            color: isOverTimeline ? "white" : "#0f172a",
                                            fontWeight: "600",
                                            fontSize: "18px",
                                            border: isOverTimeline ? "3px solid #dc2626" : "1px solid #334155"
                                        }}>
                                            {personMonths.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
