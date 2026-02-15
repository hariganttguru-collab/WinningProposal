import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useLobby } from './LobbyContext';

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
    getRawProjectDuration: () => number;
    getProjectCompletedEarlyBy: () => number;
    getContributionMarginIncludingBonus: () => number;
    isBidDisqualified: () => boolean;
    showBonus: boolean;
    setShowBonus: (show: boolean) => void;
    isEditing: boolean;
    setIsEditing: (editing: boolean) => void;

    // Constants
    seniorToJuniorProductivity: number;
    earlyFinishBonus: number;
    expectedProjectDuration: number;
    expectedBidValue: number;
}

const ProjectDataContext = createContext<ProjectDataContextType | undefined>(undefined);

export function ProjectDataProvider({ children }: { children: ReactNode }) {
    const { currentLobby } = useLobby();

    // Deliverables
    const [deliverables, setDeliverables] = useState<Deliverable[]>([
        { name: 'Complex Screen', quantity: 180, effortPerUnit: 40 },
        { name: 'Simple Screen', quantity: 410, effortPerUnit: 16 },
        { name: 'Complex Database', quantity: 95, effortPerUnit: 32 },
        { name: 'Simple Database', quantity: 210, effortPerUnit: 12 }
    ]);


    const [estimationAccuracy, setEstimationAccuracy] = useState(80);

    // Resource Allocation
    const [screenAllocations, setScreenAllocations] = useState<ScreenAllocation[]>([
        { deliverable: 'Complex Screen', uiSenior: 0, uiJunior: 10 },
        { deliverable: 'Simple Screen', uiSenior: 0, uiJunior: 10 }
    ]);

    const [databaseAllocations, setDatabaseAllocations] = useState<DatabaseAllocation[]>([
        { deliverable: 'Complex Database', backendSenior: 0, backendJunior: 10 },
        { deliverable: 'Simple Database', backendSenior: 0, backendJunior: 10 }
    ]);


    // Work Schedule
    const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState(20);
    const [workingHoursPerDay, setWorkingHoursPerDay] = useState(8);


    // Salaries
    const [salaries, setSalaries] = useState<Salaries>({
        uiJunior: 4000,
        uiSenior: 7500,
        backendJunior: 4800,
        backendSenior: 9000
    });


    // Overhead & Contingency
    const [contingencyPercent, setContingencyPercent] = useState(40);

    const [overheadPercent, setOverheadPercent] = useState(15);
    const [qualityPercent, setQualityPercent] = useState(20);



    // Bid Price
    const [bidPrice, setBidPrice] = useState(1000000);

    const [showBonus, setShowBonus] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Constants
    const seniorToJuniorProductivity = 2;
    const earlyFinishBonus = 25000;
    const expectedProjectDuration = 5;
    const expectedBidValue = 1000000;


    // Sync from Supabase when data changes in DB (Initial/Admin setup)
    useEffect(() => {
        if (!currentLobby?.simulationData || Object.keys(currentLobby.simulationData).length === 0) return;

        console.log('Syncing simulation data from lobby (initial setup):', currentLobby.simulationData);

        const data = currentLobby.simulationData;
        if (data.deliverables) setDeliverables(data.deliverables);
        if (data.estimationAccuracy !== undefined) setEstimationAccuracy(data.estimationAccuracy);
        if (data.screenAllocations) setScreenAllocations(data.screenAllocations);
        if (data.databaseAllocations) setDatabaseAllocations(data.databaseAllocations);
        if (data.workingDaysPerMonth !== undefined) setWorkingDaysPerMonth(data.workingDaysPerMonth);
        if (data.workingHoursPerDay !== undefined) setWorkingHoursPerDay(data.workingHoursPerDay);
        if (data.salaries) setSalaries(data.salaries);
        if (data.contingencyPercent !== undefined) setContingencyPercent(data.contingencyPercent);
        if (data.overheadPercent !== undefined) setOverheadPercent(data.overheadPercent);
        if (data.qualityPercent !== undefined) setQualityPercent(data.qualityPercent);
        if (data.bidPrice !== undefined) setBidPrice(data.bidPrice);
    }, [currentLobby?.simulationData]);

    // Wrap update functions (removed syncToSupabase to isolate player experience)
    const updateDeliverable = (index: number, field: 'quantity' | 'effortPerUnit', value: number) => {
        const updated = [...deliverables];
        updated[index] = { ...updated[index], [field]: value };
        setDeliverables(updated);
    };

    const updateScreenResource = (index: number, field: 'uiSenior' | 'uiJunior', value: number) => {
        const updated = [...screenAllocations];
        updated[index] = { ...updated[index], [field]: value };
        setScreenAllocations(updated);
    };

    const updateDatabaseResource = (index: number, field: 'backendSenior' | 'backendJunior', value: number) => {
        const updated = [...databaseAllocations];
        updated[index] = { ...updated[index], [field]: value };
        setDatabaseAllocations(updated);
    };

    const updateSalary = (role: keyof Salaries, value: number) => {
        const updated = { ...salaries, [role]: value };
        setSalaries(updated);
    };

    // Calculation Functions (unchanged logic)
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

    const getTotalCost = () => {
        const resourceCost = getTotalResourceCost();
        const contingencyCost = resourceCost * (contingencyPercent / 100);
        const overheadCost = resourceCost * (overheadPercent / 100);
        const qualityCost = resourceCost * (qualityPercent / 100);
        return resourceCost + contingencyCost + overheadCost + qualityCost;
    };

    const getContributionMarginExcludingBonus = () => {
        return bidPrice - getTotalCost();
    };

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

    const getRawProjectDuration = () => {
        let maxMonths = 0;
        deliverables.forEach(d => {
            const cost = calculateCost(d.quantity, d.effortPerUnit);
            const personHours = calculatePersonHours(d.name, cost);
            const personDays = calculatePersonDays(personHours);
            const personMonths = calculatePersonMonths(personDays);
            if (personMonths > maxMonths) {
                maxMonths = personMonths;
            }
        });
        return maxMonths;
    };

    const getProjectCompletedEarlyBy = () => {
        return expectedProjectDuration - getProjectDuration();
    };

    const getContributionMarginIncludingBonus = () => {
        const marginExcludingBonus = getContributionMarginExcludingBonus();
        if (!showBonus) return marginExcludingBonus;

        const completedEarlyBy = getProjectCompletedEarlyBy();
        return marginExcludingBonus + (completedEarlyBy * earlyFinishBonus);
    };

    const isBidDisqualified = () => {
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

        const budgetViolation = bidPrice > 1000000;

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
            getRawProjectDuration,
            getProjectCompletedEarlyBy,
            getContributionMarginIncludingBonus,
            isBidDisqualified,
            showBonus,
            setShowBonus,
            isEditing,
            setIsEditing,
            seniorToJuniorProductivity,
            earlyFinishBonus,
            expectedProjectDuration,
            expectedBidValue
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
