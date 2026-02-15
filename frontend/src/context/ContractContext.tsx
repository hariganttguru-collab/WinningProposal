import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

// Define the deliverable types
type DeliverableType =
    | 'Complex Screen'
    | 'Simple Screen'
    | 'Complex database'
    | 'Simple database'
    | 'Complex API'
    | 'Simple API'
    | 'Complex Report'
    | 'Simple Report';

// Export the type
export type { DeliverableType };

// Productivity levels
export type ProductivityLevel = 'Low' | 'Medium' | 'High';

// Effort estimation input
export interface EffortInput {
    estimationAccuracyPct: number;
    productivity: Record<DeliverableType, ProductivityLevel>;
}

// Resource planning input
export interface ResourcePlanningInput {
    lifecycleDistributionPct: number[]; // 5 phases percentages
    workingDaysPerMonth: number;
    productiveHoursPerDay: number;
}

// Resource cost input
export interface ResourceCostInput {
    permanentVsTempRatio: number; // percentage for permanent staff (80% default)
    permanentMonthlySalary: number;
    temporaryMonthlySalary: number;
}

// Project management input
export interface ProjectManagementInput {
    projectDurationMonths: number; // Fixed at 5 months for this contract
    teamMembersPerTeam: number; // e.g. 10 (1:10 ratio)
    teamLeadSalary: number;
    teamLeadsPerManager: number; // e.g. 12 (1:12 ratio)
    pmSalary: number;
}

// Heuristic input
export interface HeuristicInput {
    heuristicPct: number; // Risk percentage
}

// Onsite input
export interface OnsiteInput {
    onsiteOffshoreRatio: number; // e.g. 12 (1:12 ratio)
    onsiteCoordinatorSalary: number; // Monthly salary
}

// Subcontract input
export interface SubContractInput {
    selectedSubcontractors: Record<string, string>; // module -> subcontractor choice (None, SubCon-1, SubCon-2, SubCon-3)
}

// Risk/Contingency input
export interface RiskInput {
    riskRatings: Record<string, string>; // module -> risk rating (Insignificant, Minor, Significant, Major, Catastrophic, None)
}

// Infrastructure input
export interface InfrastructureInput {
    costPerResource: number; // Cost per internal resource
}

// Overhead and Profit input
export interface OverheadProfitInput {
    overheadChargesPercentage: number; // Overhead charges percentage
    profitPercentage: number; // Expected profit percentage
}

// Financing input
export interface FinancingInput {
    costOfCapital: number; // Cost of capital percentage
    cashInPercentages: number[]; // Cash in percentage for each month (5 months)
}

// WBS Input structure
export interface WBSInput {
    quantities: Record<DeliverableType, number>;
}

// Contract context type
interface ContractContextType {
    wbsInput: WBSInput;
    effortInput: EffortInput;
    resourcePlanningInput: ResourcePlanningInput;
    resourceCostInput: ResourceCostInput;
    projectManagementInput: ProjectManagementInput;
    heuristicInput: HeuristicInput;
    onsiteInput: OnsiteInput;
    subContractInput: SubContractInput;
    riskInput: RiskInput;
    infrastructureInput: InfrastructureInput;
    overheadProfitInput: OverheadProfitInput;
    financingInput: FinancingInput;
    updateWBSQuantity: (deliverable: DeliverableType, quantity: number) => void;
    incrementQuantity: (deliverable: DeliverableType, amount: number) => void;
    updateEffortAccuracy: (accuracy: number) => void;
    updateProductivity: (deliverable: DeliverableType, productivity: ProductivityLevel) => void;
    updateLifecycleDistribution: (index: number, percentage: number) => void;
    updateWorkingDays: (days: number) => void;
    updateProductiveHours: (hours: number) => void;
    updatePermanentRatio: (ratio: number) => void;
    updatePermanentSalary: (salary: number) => void;
    updateTemporarySalary: (salary: number) => void;
    updateTeamMembersPerTeam: (members: number) => void;
    updateTeamLeadSalary: (salary: number) => void;
    updateTeamLeadsPerManager: (leads: number) => void;
    updatePMSalary: (salary: number) => void;
    updateHeuristicPct: (pct: number) => void;
    updateOnsiteRatio: (ratio: number) => void;
    updateOnsiteCoordinatorSalary: (salary: number) => void;
    updateSubcontractorSelection: (module: string, subcontractor: string) => void;
    updateRiskRating: (module: string, rating: string) => void;
    updateInfrastructureCostPerResource: (cost: number) => void;
    updateOverheadChargesPercentage: (percentage: number) => void;
    updateProfitPercentage: (percentage: number) => void;
    updateCostOfCapital: (percentage: number) => void;
    setCashInPreset: (percentages: number[]) => void;
    updateCashInPercentageForMonth: (monthIndex: number, percentage: number) => void;
    getTotalQuantity: () => number;
    calculateEffortHours: (deliverable: DeliverableType) => number;
    getTotalEffortHours: () => number;
    getEffortPerUnit: (deliverable: DeliverableType) => number;
    getModuleEffortHours: (moduleIndex: number) => number;
    getModuleResourceRequirement: (moduleIndex: number) => number;
    getMonthlyResourceRequirement: (moduleIndex: number, monthIndex: number) => number;
    getMilestoneResourceRequirement: (monthIndex: number) => number;
    getPermanentStaffForMonth: (monthIndex: number) => number;
    getTemporaryStaffForMonth: (monthIndex: number) => number;
    getResourceCostForMonth: (monthIndex: number) => number;
    getTotalResourceCost: () => number;
    getNumberOfTeamLeads: () => number;
    getNumberOfManagers: () => number;
    getTeamLeadCost: () => number;
    getProjectManagerCost: () => number;
    getTotalProjectManagementCost: () => number;
    getHeuristicCost: () => number;
    getNumberOfOnsiteCoordinators: () => number;
    getOnsiteCoordinatorCost: () => number;
    getSubContractCost: (module: string) => number;
    getResourceCostAfterSubcontracting: (module: string) => number;
    getInternalResourcesAfterSubcontracting: (module: string) => number;
    getTotalSubContractCost: () => number;
    getInhouseRiskImpact: (module: string) => number;
    getSubcontractRiskImpact: (module: string) => number;
    getContingencyCost: (module: string) => number;
    getTotalContingencyCost: () => number;
    getTotalInternalResourcesAfterSubcontracting: () => number;
    getTotalInfrastructureCost: () => number;
    getMonthlyFinancingData: (monthIndex: number) => { cashOut: number };
    getTotalFinancingCharges: () => number;
    getTotalProjectCostWithOverhead: () => number;
    getCashInForMonth: (monthIndex: number) => number;
    getWorkingCapitalForMonth: (monthIndex: number) => number;
    getWorkingCapitalCumulative: (monthIndex: number) => number;
    // Step tracking for wizard interface
    currentStep: number;
    completedSteps: number[];
    setCurrentStep: (step: number) => void;
    markStepComplete: (step: number) => void;
    isStepAccessible: (step: number) => boolean;
    isStepComplete: (step: number) => boolean;
    validateCurrentStep: () => boolean;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    // Save and restore functions for persistence
    saveCurrentState: () => void;
    restoreLatestState: () => void;
    // Stored calculated values for later use
    calculatedValues: {
        totalQuantity: number;
        totalEffortHours: number;
        moduleEffortHours: number[];
        moduleResourceRequirements: number[];
        monthlyResourceRequirements: number[][];
        milestoneResourceRequirements: number[];
        peakResourceRequirement: number;
        permanentStaffPerMonth: number[];
        temporaryStaffPerMonth: number[];
        resourceCostPerMonth: number[];
        totalResourceCost: number;
        numberOfTeamLeads: number;
        numberOfManagers: number;
        teamLeadCost: number;
        projectManagerCost: number;
        totalProjectManagementCost: number;
        heuristicCost: number;
        numberOfOnsiteCoordinators: number;
        onsiteCoordinatorCost: number;
        totalSubContractCost: number;
        totalContingencyCost: number;
    };
}

// Default WBS quantities - set to test values for easy testing
const defaultWBSInput: WBSInput = {
    quantities: {
        'Complex Screen': 50,
        'Simple Screen': 100,
        'Complex database': 80,
        'Simple database': 30,
        'Complex API': 120,
        'Simple API': 50,
        'Complex Report': 70,
        'Simple Report': 25,
    }
};

// Default effort input
const defaultEffortInput: EffortInput = {
    estimationAccuracyPct: 70,
    productivity: {
        'Complex Screen': 'Medium',
        'Simple Screen': 'Medium',
        'Complex database': 'Medium',
        'Simple database': 'Medium',
        'Complex API': 'Medium',
        'Simple API': 'Medium',
        'Complex Report': 'Medium',
        'Simple Report': 'Medium',
    }
};

// Default resource planning input
const defaultResourcePlanningInput: ResourcePlanningInput = {
    lifecycleDistributionPct: [10, 15, 40, 25, 10], // Requirements, Design, Coding, Testing, Deployment
    workingDaysPerMonth: 22,
    productiveHoursPerDay: 7,
};

// Default resource cost input
const defaultResourceCostInput: ResourceCostInput = {
    permanentVsTempRatio: 80, // 80% permanent, 20% temporary
    permanentMonthlySalary: 1400,
    temporaryMonthlySalary: 1100,
};

// Default project management input
const defaultProjectManagementInput: ProjectManagementInput = {
    projectDurationMonths: 5, // Fixed for this contract
    teamMembersPerTeam: 10, // 1:10 ratio
    teamLeadSalary: 8000,

    teamLeadsPerManager: 12, // 1:12 ratio
    pmSalary: 3500,
};

// Default heuristic input
const defaultHeuristicInput: HeuristicInput = {
    heuristicPct: 10, // 10% default risk buffer
};

// Default onsite input
const defaultOnsiteInput: OnsiteInput = {
    onsiteOffshoreRatio: 12, // 1:12 ratio
    onsiteCoordinatorSalary: 4000, // Monthly salary
};

// Default subcontract input
const defaultSubContractInput: SubContractInput = {
    selectedSubcontractors: {
        "Requirements": "None",
        "Design": "None",
        "Coding": "SubCon-1",
        "Testing": "SubCon-2",
        "Deployment": "None"
    }
};

// Default risk input
const defaultRiskInput: RiskInput = {
    riskRatings: {
        "Requirements": "Minor",
        "Design": "Significant",
        "Coding": "Major",
        "Testing": "Major",
        "Deployment": "Significant"
    }
};

// Default infrastructure input
const defaultInfrastructureInput: InfrastructureInput = {
    costPerResource: 500 // Default cost per resource
};

// Default overhead and profit input
const defaultOverheadProfitInput: OverheadProfitInput = {
    overheadChargesPercentage: 3, // Default 3%
    profitPercentage: 25 // Default 25%
};

// Default financing input
const defaultFinancingInput: FinancingInput = {
    costOfCapital: 10, // Default 10%
    cashInPercentages: [5, 10, 15, 30, 40] // Default "Standard" preset
};

// Productivity scale table (effort per unit)
const PRODUCTIVITY_SCALE: Record<DeliverableType, Record<ProductivityLevel, number>> = {
    'Complex Screen': { Low: 24, Medium: 20, High: 18 },
    'Simple Screen': { Low: 8, Medium: 6, High: 4 },
    'Complex database': { Low: 16, Medium: 12, High: 10 },
    'Simple database': { Low: 4, Medium: 2, High: 1 },
    'Complex API': { Low: 45, Medium: 40, High: 35 },
    'Simple API': { Low: 15, Medium: 12, High: 10 },
    'Complex Report': { Low: 60, Medium: 48, High: 42 },
    'Simple Report': { Low: 20, Medium: 18, High: 15 },
};

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Step tracking state
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    // Initialize with default values first
    const [wbsInput, setWbsInput] = useState<WBSInput>(defaultWBSInput);
    const [effortInput, setEffortInput] = useState<EffortInput>(defaultEffortInput);
    const [resourcePlanningInput, setResourcePlanningInput] = useState<ResourcePlanningInput>(defaultResourcePlanningInput);
    const [resourceCostInput, setResourceCostInput] = useState<ResourceCostInput>(defaultResourceCostInput);
    const [projectManagementInput, setProjectManagementInput] = useState<ProjectManagementInput>(defaultProjectManagementInput);
    const [heuristicInput, setHeuristicInput] = useState<HeuristicInput>(defaultHeuristicInput);
    const [onsiteInput, setOnsiteInput] = useState<OnsiteInput>(defaultOnsiteInput);
    const [subContractInput, setSubContractInput] = useState<SubContractInput>(defaultSubContractInput);
    const [riskInput, setRiskInput] = useState<RiskInput>(defaultRiskInput);
    const [infrastructureInput, setInfrastructureInput] = useState<InfrastructureInput>(defaultInfrastructureInput);
    const [overheadProfitInput, setOverheadProfitInput] = useState<OverheadProfitInput>(defaultOverheadProfitInput);
    const [financingInput, setFinancingInput] = useState<FinancingInput>(defaultFinancingInput);

    // Restore latest state on component mount
    React.useEffect(() => {
        const savedState = localStorage.getItem('latestContractState');
        const stateVersion = localStorage.getItem('contractStateVersion');
        const currentVersion = '1.2'; // Increment this when defaults change

        if (savedState && stateVersion === currentVersion) {
            try {
                const state = JSON.parse(savedState);
                setWbsInput(state.wbsInput || defaultWBSInput);
                setEffortInput(state.effortInput || defaultEffortInput);
                setResourcePlanningInput(state.resourcePlanningInput || defaultResourcePlanningInput);
                setResourceCostInput(state.resourceCostInput || defaultResourceCostInput);
                setProjectManagementInput(state.projectManagementInput || defaultProjectManagementInput);
                setHeuristicInput(state.heuristicInput || defaultHeuristicInput);
                setOnsiteInput(state.onsiteInput || defaultOnsiteInput);
                setSubContractInput(state.subContractInput || defaultSubContractInput);
                setRiskInput(state.riskInput || defaultRiskInput);
                setInfrastructureInput(state.infrastructureInput || defaultInfrastructureInput);
                setOverheadProfitInput(state.overheadProfitInput || defaultOverheadProfitInput);
                setFinancingInput(state.financingInput || defaultFinancingInput);
            } catch (error) {
                console.error('Error restoring contract state:', error);
            }
        } else {
            // Version mismatch or no saved state - clear old state and use defaults
            localStorage.removeItem('latestContractState');
            localStorage.setItem('contractStateVersion', currentVersion);
            // Force defaults to be set
            setSubContractInput(defaultSubContractInput);
        }
    }, []);

    const updateWBSQuantity = (deliverable: DeliverableType, quantity: number) => {
        setWbsInput(prev => ({
            ...prev,
            quantities: {
                ...prev.quantities,
                [deliverable]: Math.max(0, quantity) // Ensure non-negative
            }
        }));
    };

    const incrementQuantity = (deliverable: DeliverableType, amount: number) => {
        setWbsInput(prev => ({
            ...prev,
            quantities: {
                ...prev.quantities,
                [deliverable]: Math.max(0, prev.quantities[deliverable] + amount)
            }
        }));
    };

    const updateEffortAccuracy = (accuracy: number) => {
        setEffortInput(prev => ({
            ...prev,
            estimationAccuracyPct: accuracy
        }));
    };

    const updateProductivity = (deliverable: DeliverableType, productivity: ProductivityLevel) => {
        setEffortInput(prev => ({
            ...prev,
            productivity: {
                ...prev.productivity,
                [deliverable]: productivity
            }
        }));
    };

    const updateLifecycleDistribution = (index: number, percentage: number) => {
        setResourcePlanningInput(prev => ({
            ...prev,
            lifecycleDistributionPct: prev.lifecycleDistributionPct.map((val, i) =>
                i === index ? percentage : val
            )
        }));
    };

    const updateWorkingDays = (days: number) => {
        setResourcePlanningInput(prev => ({
            ...prev,
            workingDaysPerMonth: days
        }));
    };

    const updateProductiveHours = (hours: number) => {
        setResourcePlanningInput(prev => ({
            ...prev,
            productiveHoursPerDay: hours
        }));
    };

    const updatePermanentRatio = (ratio: number) => {
        setResourceCostInput(prev => ({
            ...prev,
            permanentVsTempRatio: ratio
        }));
    };

    const updatePermanentSalary = (salary: number) => {
        setResourceCostInput(prev => ({
            ...prev,
            permanentMonthlySalary: salary
        }));
    };

    const updateTemporarySalary = (salary: number) => {
        setResourceCostInput(prev => ({
            ...prev,
            temporaryMonthlySalary: salary
        }));
    };

    const updateTeamMembersPerTeam = (members: number) => {
        setProjectManagementInput(prev => ({
            ...prev,
            teamMembersPerTeam: members
        }));
    };

    const updateTeamLeadSalary = (salary: number) => {
        setProjectManagementInput(prev => ({
            ...prev,
            teamLeadSalary: salary
        }));
    };

    const updateTeamLeadsPerManager = (leads: number) => {
        setProjectManagementInput(prev => ({
            ...prev,
            teamLeadsPerManager: leads
        }));
    };

    const updatePMSalary = (salary: number) => {
        setProjectManagementInput(prev => ({
            ...prev,
            pmSalary: salary
        }));
    };

    const updateHeuristicPct = (pct: number) => {
        setHeuristicInput(prev => ({
            ...prev,
            heuristicPct: pct
        }));
    };

    const updateOnsiteRatio = (ratio: number) => {
        setOnsiteInput(prev => ({
            ...prev,
            onsiteOffshoreRatio: ratio
        }));
    };

    const updateOnsiteCoordinatorSalary = (salary: number) => {
        setOnsiteInput(prev => ({
            ...prev,
            onsiteCoordinatorSalary: salary
        }));
    };

    const updateSubcontractorSelection = (module: string, subcontractor: string) => {
        setSubContractInput(prev => ({
            ...prev,
            selectedSubcontractors: {
                ...prev.selectedSubcontractors,
                [module]: subcontractor
            }
        }));
    };

    const updateRiskRating = (module: string, rating: string) => {
        setRiskInput(prev => ({
            ...prev,
            riskRatings: {
                ...prev.riskRatings,
                [module]: rating
            }
        }));
    };

    const updateInfrastructureCostPerResource = (cost: number) => {
        setInfrastructureInput(prev => ({
            ...prev,
            costPerResource: cost
        }));
    };

    const updateOverheadChargesPercentage = (percentage: number) => {
        setOverheadProfitInput(prev => ({
            ...prev,
            overheadChargesPercentage: percentage
        }));
    };

    const updateProfitPercentage = (percentage: number) => {
        setOverheadProfitInput(prev => ({
            ...prev,
            profitPercentage: percentage
        }));
    };

    const updateCostOfCapital = (percentage: number) => {
        setFinancingInput(prev => ({
            ...prev,
            costOfCapital: percentage
        }));
    };

    const setCashInPreset = (percentages: number[]) => {
        setFinancingInput(prev => ({
            ...prev,
            cashInPercentages: [...percentages]
        }));
    };

    const updateCashInPercentageForMonth = (monthIndex: number, percentage: number) => {
        setFinancingInput(prev => ({
            ...prev,
            cashInPercentages: prev.cashInPercentages.map((val, index) =>
                index === monthIndex ? percentage : val
            )
        }));
    };

    const getTotalQuantity = () => {
        return Object.values(wbsInput.quantities).reduce((sum, qty) => sum + qty, 0);
    };

    const calculateEffortHours = (deliverable: DeliverableType) => {
        const quantity = wbsInput.quantities[deliverable];
        const productivity = effortInput.productivity[deliverable];
        const effortPerUnit = PRODUCTIVITY_SCALE[deliverable][productivity];
        const accuracy = effortInput.estimationAccuracyPct / 100;

        return Math.round((quantity * effortPerUnit) / accuracy);
    };

    const getTotalEffortHours = () => {
        const deliverables: DeliverableType[] = [
            'Complex Screen', 'Simple Screen', 'Complex database', 'Simple database',
            'Complex API', 'Simple API', 'Complex Report', 'Simple Report'
        ];
        return deliverables.reduce((total, deliverable) => total + calculateEffortHours(deliverable), 0);
    };

    const getEffortPerUnit = (deliverable: DeliverableType) => {
        const productivity = effortInput.productivity[deliverable];
        return PRODUCTIVITY_SCALE[deliverable][productivity];
    };

    // Module effort calculations
    const getModuleEffortHours = (moduleIndex: number) => {
        const moduleDeliverables = [
            ['Complex Screen', 'Simple Screen'],           // Module 1 - GUI
            ['Complex database', 'Simple database'],      // Module 2 - Database  
            ['Complex API', 'Simple API'],                // Module 3 - API
            ['Complex Report', 'Simple Report']           // Module 4 - Reports
        ];

        return moduleDeliverables[moduleIndex].reduce((total, deliverable) =>
            total + calculateEffortHours(deliverable as DeliverableType), 0
        );
    };

    const getModuleResourceRequirement = (moduleIndex: number) => {
        const moduleEffort = getModuleEffortHours(moduleIndex);
        const totalWorkingHours = resourcePlanningInput.workingDaysPerMonth * resourcePlanningInput.productiveHoursPerDay;
        return moduleEffort / totalWorkingHours;
    };

    const getMonthlyResourceRequirement = (moduleIndex: number, monthIndex: number) => {
        const moduleResource = getModuleResourceRequirement(moduleIndex);
        const monthlyPercentage = resourcePlanningInput.lifecycleDistributionPct[monthIndex] / 100;
        return moduleResource * monthlyPercentage;
    };

    const getMilestoneResourceRequirement = (monthIndex: number) => {
        let total = 0;
        for (let moduleIndex = 0; moduleIndex < 4; moduleIndex++) {
            total += getMonthlyResourceRequirement(moduleIndex, monthIndex);
        }
        return total;
    };

    // Resource cost calculations
    const getPermanentStaffForMonth = (monthIndex: number) => {
        const totalResources = getMilestoneResourceRequirement(monthIndex);
        return totalResources * (resourceCostInput.permanentVsTempRatio / 100);
    };

    const getTemporaryStaffForMonth = (monthIndex: number) => {
        const totalResources = getMilestoneResourceRequirement(monthIndex);
        return totalResources * ((100 - resourceCostInput.permanentVsTempRatio) / 100);
    };

    const getResourceCostForMonth = (monthIndex: number) => {
        const permanentStaff = getPermanentStaffForMonth(monthIndex);
        const temporaryStaff = getTemporaryStaffForMonth(monthIndex);
        const permanentCost = permanentStaff * resourceCostInput.permanentMonthlySalary;
        const temporaryCost = temporaryStaff * resourceCostInput.temporaryMonthlySalary;
        return permanentCost + temporaryCost;
    };

    const getTotalResourceCost = () => {
        let total = 0;
        for (let monthIndex = 0; monthIndex < 5; monthIndex++) {
            total += getResourceCostForMonth(monthIndex);
        }
        return total;
    };

    // Project management calculations
    const getNumberOfTeamLeads = () => {
        const peakResources = Math.max(...Array.from({ length: 5 }, (_, i) => getMilestoneResourceRequirement(i)));
        return peakResources / projectManagementInput.teamMembersPerTeam;
    };

    const getNumberOfManagers = () => {
        const teamLeads = getNumberOfTeamLeads();
        return teamLeads / projectManagementInput.teamLeadsPerManager;
    };

    const getTeamLeadCost = () => {
        const teamLeads = getNumberOfTeamLeads();
        return teamLeads * projectManagementInput.projectDurationMonths * projectManagementInput.teamLeadSalary;
    };

    const getProjectManagerCost = () => {
        const managers = getNumberOfManagers();
        return managers * projectManagementInput.projectDurationMonths * projectManagementInput.pmSalary;
    };

    const getTotalProjectManagementCost = () => {
        return getTeamLeadCost() + getProjectManagerCost();
    };

    // Heuristic calculations
    const getHeuristicCost = () => {
        const baseCost = getTotalResourceCost(); // Only use total resource cost, not including project management
        return baseCost * (heuristicInput.heuristicPct / 100);
    };

    // Onsite calculations
    const getNumberOfOnsiteCoordinators = () => {
        const peakResources = Math.max(...Array.from({ length: 5 }, (_, i) => getMilestoneResourceRequirement(i)));
        return peakResources / onsiteInput.onsiteOffshoreRatio;
    };

    const getOnsiteCoordinatorCost = () => {
        const coordinators = getNumberOfOnsiteCoordinators();
        const projectDuration = 5; // Fixed 5 months
        return coordinators * projectDuration * onsiteInput.onsiteCoordinatorSalary;
    };

    // Subcontract data tables
    const SUBCONTRACT_COSTS = {
        "Design": { "SubCon-1": 24037, "SubCon-2": 18695, "SubCon-3": 24927 },
        "Coding": { "SubCon-1": 19808, "SubCon-2": 24260, "SubCon-3": 19363 },
        "Testing": { "SubCon-1": 20921, "SubCon-2": 19141, "SubCon-3": 23147 },
        "Deployment": { "SubCon-1": 22924, "SubCon-2": 22702, "SubCon-3": 20699 }
    };

    // Subcontract calculations
    const getSubContractCost = (module: string) => {
        const selection = subContractInput.selectedSubcontractors[module];
        if (selection === "None") return 0;
        return SUBCONTRACT_COSTS[module as keyof typeof SUBCONTRACT_COSTS]?.[selection as keyof typeof SUBCONTRACT_COSTS["Design"]] || 0;
    };

    const getResourceCostAfterSubcontracting = (module: string) => {
        const selection = subContractInput.selectedSubcontractors[module];
        if (!selection || selection === "None") {
            // Map module to milestone month and return actual resource cost
            const moduleIndex = ["Requirements", "Design", "Coding", "Testing", "Deployment"].indexOf(module);
            if (moduleIndex >= 0) {
                return getResourceCostForMonth(moduleIndex);
            }
        }
        return 0;
    };

    const getInternalResourcesAfterSubcontracting = (module: string) => {
        const selection = subContractInput.selectedSubcontractors[module];
        if (!selection || selection === "None") {
            // Calculate the milestone resource requirement for this module directly
            const moduleIndex = ["Requirements", "Design", "Coding", "Testing", "Deployment"].indexOf(module);
            if (moduleIndex >= 0) {
                return getMilestoneResourceRequirement(moduleIndex);
            }
        }
        return 0;
    };

    const getTotalSubContractCost = () => {
        const modules = ["Requirements", "Design", "Coding", "Testing", "Deployment"];
        return modules.reduce((total, module) => total + getSubContractCost(module), 0);
    };

    // Risk impact percentages
    const RISK_IMPACT_PERCENTAGES = {
        "Insignificant": 0.0025, // 0.25%
        "Minor": 0.005, // 0.5%
        "Significant": 0.01, // 1%
        "Major": 0.02, // 2%
        "Catastrophic": 0.05, // 5%
        "None": 0 // 0%
    };

    // Risk/Contingency calculations
    const getInhouseRiskImpact = (module: string) => {
        const riskRating = riskInput.riskRatings[module] || "None";
        return RISK_IMPACT_PERCENTAGES[riskRating as keyof typeof RISK_IMPACT_PERCENTAGES] || 0;
    };

    const getSubcontractRiskImpact = (module: string) => {
        const selection = subContractInput.selectedSubcontractors[module];
        if (selection === "None") return 0;

        // Map subcontractor selection to risk rating
        const subcontractorRiskMap = {
            "SubCon-1": "Major", // 2%
            "SubCon-2": "Significant", // 1%
            "SubCon-3": "Minor" // 0.5%
        };

        const riskRating = subcontractorRiskMap[selection as keyof typeof subcontractorRiskMap] || "None";
        return RISK_IMPACT_PERCENTAGES[riskRating as keyof typeof RISK_IMPACT_PERCENTAGES] || 0;
    };

    const getContingencyCost = (module: string) => {
        const inhouseRiskImpact = getInhouseRiskImpact(module);
        const subcontractRiskImpact = getSubcontractRiskImpact(module);
        const resourceCostAfter = getResourceCostAfterSubcontracting(module);
        const subcontractCost = getSubContractCost(module);

        return (inhouseRiskImpact * resourceCostAfter) + (subcontractRiskImpact * subcontractCost);
    };

    const getTotalContingencyCost = () => {
        const modules = ["Requirements", "Design", "Coding", "Testing", "Deployment"];
        return modules.reduce((total, module) => total + getContingencyCost(module), 0);
    };

    // Infrastructure calculations
    const getTotalInternalResourcesAfterSubcontracting = () => {
        const modules = ["Requirements", "Design", "Coding", "Testing", "Deployment"];
        return modules.reduce((total, module) => total + getInternalResourcesAfterSubcontracting(module), 0);
    };

    const getTotalInfrastructureCost = () => {
        const totalInternalResources = getTotalInternalResourcesAfterSubcontracting();
        return totalInternalResources * infrastructureInput.costPerResource;
    };

    // Financing calculations
    const getMonthlyFinancingData = (monthIndex: number) => {
        // Cash Out = (subcontract cost + resource cost after subcontracting) + (project management cost / 5)
        const modules = ["Requirements", "Design", "Coding", "Testing", "Deployment"];
        const module = modules[monthIndex];

        const subcontractCost = getSubContractCost(module);
        const resourceCostAfter = getResourceCostAfterSubcontracting(module);
        const projectManagementCostPerMonth = getTotalProjectManagementCost() / 5;

        const cashOut = subcontractCost + resourceCostAfter + projectManagementCostPerMonth;

        return { cashOut };
    };

    const getTotalFinancingCharges = () => {
        // Sum all positive Working Capital CUM values
        let totalPositiveCum = 0;
        for (let i = 0; i < 5; i++) {
            const cumValue = getWorkingCapitalCumulative(i);
            if (cumValue > 0) {
                totalPositiveCum += cumValue;
            }
        }

        // Multiply by cost of capital percentage
        return totalPositiveCum * (financingInput.costOfCapital / 100);
    };

    const getTotalProjectCostWithOverhead = () => {
        // 1. Total resource cost after subcontracting (sum of all modules where None is selected)
        const modules = ["Requirements", "Design", "Coding", "Testing", "Deployment"];
        const totalResourceCostAfterSub = modules.reduce((total, module) => total + getResourceCostAfterSubcontracting(module), 0);

        // 2. Total onsite coordinator cost
        const totalOnsiteCost = getOnsiteCoordinatorCost();

        // 3. Infrastructure cost
        const totalInfrastructureCost = getTotalInfrastructureCost();

        // 4. Total subcontract cost
        const totalSubcontractCost = getTotalSubContractCost();

        // 5. Total contingency cost
        const totalContingencyCost = getTotalContingencyCost();

        // 6. Total project management cost
        const totalPMCost = getTotalProjectManagementCost();

        // Sum of all base costs
        const baseCosts = totalResourceCostAfterSub + totalOnsiteCost + totalInfrastructureCost +
            totalSubcontractCost + totalContingencyCost + totalPMCost;

        // 7. Overhead cost = base costs * overhead percentage
        const overheadCost = baseCosts * (overheadProfitInput.overheadChargesPercentage / 100);

        // Final total = base costs + overhead
        return baseCosts + overheadCost;
    };

    const getCashInForMonth = (monthIndex: number) => {
        const totalProjectCost = getTotalProjectCostWithOverhead();
        const monthPercentage = financingInput.cashInPercentages[monthIndex] / 100;
        return totalProjectCost * monthPercentage;
    };

    const getWorkingCapitalForMonth = (monthIndex: number) => {
        const monthData = getMonthlyFinancingData(monthIndex);
        const cashIn = getCashInForMonth(monthIndex);
        return monthData.cashOut - cashIn;
    };

    const getWorkingCapitalCumulative = (monthIndex: number) => {
        let cumulative = 0;
        for (let i = 0; i <= monthIndex; i++) {
            cumulative += getWorkingCapitalForMonth(i);
        }
        return cumulative;
    };

    // Calculate and store all values for later use
    const calculatedValues = useMemo(() => {
        const totalQuantity = getTotalQuantity();
        const totalEffortHours = getTotalEffortHours();

        const moduleEffortHours = Array.from({ length: 4 }, (_, i) => getModuleEffortHours(i));
        const moduleResourceRequirements = Array.from({ length: 4 }, (_, i) => getModuleResourceRequirement(i));

        const monthlyResourceRequirements = Array.from({ length: 4 }, (_, moduleIndex) =>
            Array.from({ length: 5 }, (_, monthIndex) => getMonthlyResourceRequirement(moduleIndex, monthIndex))
        );

        const milestoneResourceRequirements = Array.from({ length: 5 }, (_, i) => getMilestoneResourceRequirement(i));
        const peakResourceRequirement = Math.max(...milestoneResourceRequirements);

        const permanentStaffPerMonth = Array.from({ length: 5 }, (_, i) => getPermanentStaffForMonth(i));
        const temporaryStaffPerMonth = Array.from({ length: 5 }, (_, i) => getTemporaryStaffForMonth(i));
        const resourceCostPerMonth = Array.from({ length: 5 }, (_, i) => getResourceCostForMonth(i));
        const totalResourceCost = getTotalResourceCost();

        const numberOfTeamLeads = getNumberOfTeamLeads();
        const numberOfManagers = getNumberOfManagers();
        const teamLeadCost = getTeamLeadCost();
        const projectManagerCost = getProjectManagerCost();
        const totalProjectManagementCost = getTotalProjectManagementCost();
        const heuristicCost = getHeuristicCost();
        const numberOfOnsiteCoordinators = getNumberOfOnsiteCoordinators();
        const onsiteCoordinatorCost = getOnsiteCoordinatorCost();
        const totalSubContractCost = getTotalSubContractCost();
        const totalContingencyCost = getTotalContingencyCost();

        return {
            totalQuantity,
            totalEffortHours,
            moduleEffortHours,
            moduleResourceRequirements,
            monthlyResourceRequirements,
            milestoneResourceRequirements,
            peakResourceRequirement,
            permanentStaffPerMonth,
            temporaryStaffPerMonth,
            resourceCostPerMonth,
            totalResourceCost,
            numberOfTeamLeads,
            numberOfManagers,
            teamLeadCost,
            projectManagerCost,
            totalProjectManagementCost,
            heuristicCost,
            numberOfOnsiteCoordinators,
            onsiteCoordinatorCost,
            totalSubContractCost,
            totalContingencyCost
        };
    }, [wbsInput, effortInput, resourcePlanningInput, resourceCostInput, projectManagementInput, heuristicInput, onsiteInput, subContractInput, riskInput]);

    // Save current state to localStorage
    const saveCurrentState = () => {
        const currentState = {
            wbsInput,
            effortInput,
            resourcePlanningInput,
            resourceCostInput,
            projectManagementInput,
            heuristicInput,
            onsiteInput,
            subContractInput,
            riskInput,
            infrastructureInput,
            overheadProfitInput,
            financingInput,
            timestamp: Date.now()
        };
        localStorage.setItem('latestContractState', JSON.stringify(currentState));
        localStorage.setItem('contractStateVersion', '1.2');
    };

    // Restore latest state from localStorage
    const restoreLatestState = () => {
        const savedState = localStorage.getItem('latestContractState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                setWbsInput(state.wbsInput || defaultWBSInput);
                setEffortInput(state.effortInput || defaultEffortInput);
                setResourcePlanningInput(state.resourcePlanningInput || defaultResourcePlanningInput);
                setResourceCostInput(state.resourceCostInput || defaultResourceCostInput);
                setProjectManagementInput(state.projectManagementInput || defaultProjectManagementInput);
                setHeuristicInput(state.heuristicInput || defaultHeuristicInput);
                setOnsiteInput(state.onsiteInput || defaultOnsiteInput);
                setSubContractInput(state.subContractInput || defaultSubContractInput);
                setRiskInput(state.riskInput || defaultRiskInput);
                setInfrastructureInput(state.infrastructureInput || defaultInfrastructureInput);
                setOverheadProfitInput(state.overheadProfitInput || defaultOverheadProfitInput);
                setFinancingInput(state.financingInput || defaultFinancingInput);
            } catch (error) {
                console.error('Error restoring contract state:', error);
            }
        }
    };

    // Step validation and navigation functions
    const validateCurrentStep = (): boolean => {
        switch (currentStep) {
            case 1: // WBS
                return Object.values(wbsInput.quantities).every(q => q > 0);
            case 2: // Effort
                return effortInput.estimationAccuracyPct > 0 && effortInput.estimationAccuracyPct <= 100;
            case 3: // Resource Planning
                const total = resourcePlanningInput.lifecycleDistributionPct.reduce((sum, val) => sum + val, 0);
                return Math.abs(total - 100) < 0.1 && resourcePlanningInput.workingDaysPerMonth > 0 && resourcePlanningInput.productiveHoursPerDay > 0;
            case 4: // Resource Cost
                return resourceCostInput.permanentVsTempRatio >= 0 && resourceCostInput.permanentVsTempRatio <= 100 &&
                    resourceCostInput.permanentMonthlySalary > 0 && resourceCostInput.temporaryMonthlySalary > 0;
            case 5: // Project Management
                return projectManagementInput.teamMembersPerTeam > 0 && projectManagementInput.teamLeadSalary > 0 &&
                    projectManagementInput.teamLeadsPerManager > 0 && projectManagementInput.pmSalary > 0;
            case 6: // Heuristic
                return heuristicInput.heuristicPct >= 0 && heuristicInput.heuristicPct <= 100;
            case 7: // Onsite
                return onsiteInput.onsiteOffshoreRatio > 0 && onsiteInput.onsiteCoordinatorSalary > 0;
            case 8: // Sub Contract
                return true; // Always valid (can select None)
            case 9: // Risk
                return true; // Always valid (has defaults)
            case 10: // Infrastructure
                return infrastructureInput.costPerResource >= 0;
            case 11: // Overhead
                return overheadProfitInput.overheadChargesPercentage >= 0 && overheadProfitInput.overheadChargesPercentage <= 100;
            case 12: // Financing
                const cashInTotal = financingInput.cashInPercentages.reduce((sum, val) => sum + val, 0);
                return Math.abs(cashInTotal - 100) < 0.1 && financingInput.costOfCapital >= 0;
            case 13: // Profit
                return overheadProfitInput.profitPercentage >= 0 && overheadProfitInput.profitPercentage <= 100;
            case 14: // Final Summary
                return true; // Always accessible once reached
            default:
                return false;
        }
    };

    const markStepComplete = (step: number) => {
        if (!completedSteps.includes(step)) {
            setCompletedSteps(prev => [...prev, step].sort((a, b) => a - b));
        }
    };

    const isStepAccessible = (step: number): boolean => {
        // Step 1 is always accessible
        if (step === 1) return true;
        // A step is accessible if the previous step is completed
        return completedSteps.includes(step - 1);
    };

    const isStepComplete = (step: number): boolean => {
        return completedSteps.includes(step);
    };

    const goToNextStep = () => {
        if (validateCurrentStep()) {
            markStepComplete(currentStep);
            if (currentStep < 14) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <ContractContext.Provider value={{
            wbsInput,
            effortInput,
            resourcePlanningInput,
            resourceCostInput,
            projectManagementInput,
            heuristicInput,
            onsiteInput,
            subContractInput,
            updateWBSQuantity,
            incrementQuantity,
            updateEffortAccuracy,
            updateProductivity,
            updateLifecycleDistribution,
            updateWorkingDays,
            updateProductiveHours,
            updatePermanentRatio,
            updatePermanentSalary,
            updateTemporarySalary,
            updateTeamMembersPerTeam,
            updateTeamLeadSalary,
            updateTeamLeadsPerManager,
            updatePMSalary,
            updateHeuristicPct,
            updateOnsiteRatio,
            updateOnsiteCoordinatorSalary,
            updateSubcontractorSelection,
            riskInput,
            updateRiskRating,
            infrastructureInput,
            updateInfrastructureCostPerResource,
            overheadProfitInput,
            updateOverheadChargesPercentage,
            updateProfitPercentage,
            financingInput,
            updateCostOfCapital,
            setCashInPreset,
            updateCashInPercentageForMonth,
            getTotalQuantity,
            calculateEffortHours,
            getTotalEffortHours,
            getEffortPerUnit,
            getModuleEffortHours,
            getModuleResourceRequirement,
            getMonthlyResourceRequirement,
            getMilestoneResourceRequirement,
            getPermanentStaffForMonth,
            getTemporaryStaffForMonth,
            getResourceCostForMonth,
            getTotalResourceCost,
            getNumberOfTeamLeads,
            getNumberOfManagers,
            getTeamLeadCost,
            getProjectManagerCost,
            getTotalProjectManagementCost,
            getHeuristicCost,
            getNumberOfOnsiteCoordinators,
            getOnsiteCoordinatorCost,
            getSubContractCost,
            getResourceCostAfterSubcontracting,
            getInternalResourcesAfterSubcontracting,
            getTotalSubContractCost,
            getInhouseRiskImpact,
            getSubcontractRiskImpact,
            getContingencyCost,
            getTotalContingencyCost,
            getTotalInternalResourcesAfterSubcontracting,
            getTotalInfrastructureCost,
            getMonthlyFinancingData,
            getTotalFinancingCharges,
            getTotalProjectCostWithOverhead,
            getCashInForMonth,
            getWorkingCapitalForMonth,
            getWorkingCapitalCumulative,
            saveCurrentState,
            restoreLatestState,
            calculatedValues,
            // Step tracking
            currentStep,
            completedSteps,
            setCurrentStep,
            markStepComplete,
            isStepAccessible,
            isStepComplete,
            validateCurrentStep,
            goToNextStep,
            goToPreviousStep
        }}>
            {children}
        </ContractContext.Provider>
    );
};

export const useContract = () => {
    const context = useContext(ContractContext);
    if (context === undefined) {
        throw new Error('useContract must be used within a ContractProvider');
    }
    return context;
};