import { createContext, useContext, useState, ReactNode } from 'react';

interface Deliverable {
    name: string;
    quantity: number;
    effortPerUnit: number;
}

interface ScreenAllocation {
    deliverable: string;
    uiSenior: number;
    uiJunior: number;
}

interface DatabaseAllocation {
    deliverable: string;
    backendSenior: number;
    backendJunior: number;
}

interface Salaries {
    uiJunior: number;
    uiSenior: number;
    backendJunior: number;
    backendSenior: number;
}

interface ProjectDataContextType {
    // Deliverables
    deliverables: Deliverable[];
    setDeliverables: (deliverables: Deliverable[]) => void;
    updateDeliverable: (index: number, field: 'quantity' | 'effortPerUnit', value: number) => void;

    // Estimation Accuracy
    estimationAccuracy: number;
    setEstimationAccuracy: (value: number) => void;

    // Resource Allocation
    screenAllocations: ScreenAllocation[];
    setScreenAllocations: (allocations: ScreenAllocation[]) => void;
    updateScreenResource: (index: number, field: 'uiSenior' | 'uiJunior', value: number) => void;

    databaseAllocations: DatabaseAllocation[];
    setDatabaseAllocations: (allocations: DatabaseAllocation[]) => void;
    updateDatabaseResource: (index: number, field: 'backendSenior' | 'backendJunior', value: number) => void;

    // Work Schedule
    workingDaysPerMonth: number;
    setWorkingDaysPerMonth: (value: number) => void;
    workingHoursPerDay: number;
    setWorkingHoursPerDay: (value: number) => void;

    // Salaries
    salaries: Salaries;
    updateSalary: (role: keyof Salaries, value: number) => void;

    // Overhead & Contingency
    contingencyPercent: number;
    setContingencyPercent: (value: number) => void;
    overheadPercent: number;
    setOverheadPercent: (value: number) => void;
    qualityPercent: number;
    setQualityPercent: (value: number) => void;

    // Bid Price
    bidPrice: number;
    setBidPrice: (value: number) => void;

    // Calculation Functions
    getTotalResourceCost: () => number;
    getTotalCost: () => number;
    getContributionMarginExcludingBonus: () => number;
    getProjectDuration: () => number;
    getProjectCompletedEarlyBy: () => number;
    getContributionMarginIncludingBonus: () => number;
    isBidDisqualified: () => boolean;

    // Constants
    seniorToJuniorProductivity: number;
    earlyFinishBonus: number;
    expectedProjectDuration: number;
}

const ProjectDataContext = createContext<ProjectDataContextType | undefined>(undefined);

export function ProjectDataProvider({ children }: { children: ReactNode }) {
    // Deliverables
    const [deliverables, setDeliverables] = useState<Deliverable[]>([
        { name: 'Complex Screen', quantity: 200, effortPerUnit: 40 },
        { name: 'Simple Screen', quantity: 800, effortPerUnit: 10 },
        { name: 'Complex Database', quantity: 180, effortPerUnit: 40 },
        { name: 'Simple Database', quantity: 100, effortPerUnit: 20 }
    ]);

    const [estimationAccuracy, setEstimationAccuracy] = useState(80);

    // Resource Allocation
    const [screenAllocations, setScreenAllocations] = useState<ScreenAllocation[]>([
        { deliverable: 'Complex Screen', uiSenior: 0, uiJunior: 15 },
        { deliverable: 'Simple Screen', uiSenior: 0, uiJunior: 10 }
    ]);

    const [databaseAllocations, setDatabaseAllocations] = useState<DatabaseAllocation[]>([
        { deliverable: 'Complex Database', backendSenior: 0, backendJunior: 10 },
        { deliverable: 'Simple Database', backendSenior: 0, backendJunior: 10 }
    ]);

    // Work Schedule
    const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState(22);
    const [workingHoursPerDay, setWorkingHoursPerDay] = useState(7);

    // Salaries
    const [salaries, setSalaries] = useState<Salaries>({
        uiJunior: 1800,
        uiSenior: 2300,
        backendJunior: 2000,
        backendSenior: 2500
    });

    // Overhead & Contingency
    const [contingencyPercent, setContingencyPercent] = useState(10);
    const [overheadPercent, setOverheadPercent] = useState(10);
    const [qualityPercent, setQualityPercent] = useState(5);

    // Bid Price
    const [bidPrice, setBidPrice] = useState(499999);

    // Constants
    const seniorToJuniorProductivity = 2;
    const earlyFinishBonus = 25000;
    const expectedProjectDuration = 5;

    // Update functions
    const updateDeliverable = (index: number, field: 'quantity' | 'effortPerUnit', value: number) => {
        const updated = [...deliverables];
        updated[index][field] = value;
        setDeliverables(updated);
    };

    const updateScreenResource = (index: number, field: 'uiSenior' | 'uiJunior', value: number) => {
        const updated = [...screenAllocations];
        updated[index][field] = value;
        setScreenAllocations(updated);
    };

    const updateDatabaseResource = (index: number, field: 'backendSenior' | 'backendJunior', value: number) => {
        const updated = [...databaseAllocations];
        updated[index][field] = value;
        setDatabaseAllocations(updated);
    };

    const updateSalary = (role: keyof Salaries, value: number) => {
        setSalaries(prev => ({ ...prev, [role]: value }));
    };

    // Calculation Functions
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

    // Row 19: Total Resource Cost
    const getTotalResourceCost = () => {
        return deliverables.reduce((sum, d) => {
            const cost = calculateCost(d.quantity, d.effortPerUnit);
            const personHours = calculatePersonHours(d.name, cost);
            const personDays = calculatePersonDays(personHours);
            const personMonths = calculatePersonMonths(personDays);
            const monthsOfEngagement = calculateMonthsOfEngagement(personMonths);
            const costOfJuniors = calculateCostOfJuniors(d.name, monthsOfEngagement);
            const costOfSeniors = calculateCostOfSeniors(d.name, monthsOfEngagement);
            return sum + costOfJuniors + costOfSeniors;
        }, 0);
    };

    // Row 20: Total Cost = Total Resource Cost + Contingency + Overhead + Quality
    const getTotalCost = () => {
        const resourceCost = getTotalResourceCost();
        const contingencyCost = resourceCost * (contingencyPercent / 100);
        const overheadCost = resourceCost * (overheadPercent / 100);
        const qualityCost = resourceCost * (qualityPercent / 100);
        return resourceCost + contingencyCost + overheadCost + qualityCost;
    };

    // Row 21: Contribution Margin excluding Penalty & Bonus = Bid Price - Total Cost
    const getContributionMarginExcludingBonus = () => {
        return bidPrice - getTotalCost();
    };

    // Row 23: Project Duration = Highest Months of Engagement
    const getProjectDuration = () => {
        let maxMonths = 0;
        deliverables.forEach(d => {
            const cost = calculateCost(d.quantity, d.effortPerUnit);
            const personHours = calculatePersonHours(d.name, cost);
            const personDays = calculatePersonDays(personHours);
            const personMonths = calculatePersonMonths(personDays);
            const monthsOfEngagement = calculateMonthsOfEngagement(personMonths);
            if (monthsOfEngagement > maxMonths) {
                maxMonths = monthsOfEngagement;
            }
        });
        return maxMonths;
    };

    // Row 25: Project Completed Early By = Expected Duration - Project Duration
    const getProjectCompletedEarlyBy = () => {
        return expectedProjectDuration - getProjectDuration();
    };

    // Row 26: Contribution Margin including Penalty & Bonus
    const getContributionMarginIncludingBonus = () => {
        const marginExcludingBonus = getContributionMarginExcludingBonus();
        const completedEarlyBy = getProjectCompletedEarlyBy();
        return marginExcludingBonus + (completedEarlyBy * earlyFinishBonus);
    };

    // Check if bid is disqualified
    const isBidDisqualified = () => {
        // Check if any person months exceed 5
        let hasTimelineViolation = false;
        deliverables.forEach(d => {
            const cost = calculateCost(d.quantity, d.effortPerUnit);
            const personHours = calculatePersonHours(d.name, cost);
            const personDays = calculatePersonDays(personHours);
            const personMonths = calculatePersonMonths(personDays);
            if (personMonths > 5) {
                hasTimelineViolation = true;
            }
        });

        // Check if bid price exceeds budget
        const budgetViolation = bidPrice > 500000;

        return hasTimelineViolation || budgetViolation;
    };

    return (
        <ProjectDataContext.Provider value={{
            deliverables,
            setDeliverables,
            updateDeliverable,
            estimationAccuracy,
            setEstimationAccuracy,
            screenAllocations,
            setScreenAllocations,
            updateScreenResource,
            databaseAllocations,
            setDatabaseAllocations,
            updateDatabaseResource,
            workingDaysPerMonth,
            setWorkingDaysPerMonth,
            workingHoursPerDay,
            setWorkingHoursPerDay,
            salaries,
            updateSalary,
            contingencyPercent,
            setContingencyPercent,
            overheadPercent,
            setOverheadPercent,
            qualityPercent,
            setQualityPercent,
            bidPrice,
            setBidPrice,
            getTotalResourceCost,
            getTotalCost,
            getContributionMarginExcludingBonus,
            getProjectDuration,
            getProjectCompletedEarlyBy,
            getContributionMarginIncludingBonus,
            isBidDisqualified,
            seniorToJuniorProductivity,
            earlyFinishBonus,
            expectedProjectDuration
        }}>
            {children}
        </ProjectDataContext.Provider>
    );
}

export function useProjectData() {
    const context = useContext(ProjectDataContext);
    if (context === undefined) {
        throw new Error('useProjectData must be used within a ProjectDataProvider');
    }
    return context;
}
