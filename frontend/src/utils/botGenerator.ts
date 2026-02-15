// Bot generator for simplified contract structure
export interface BotBid {
    name: string;
    bidPrice: number;
    contributionMargin: number;
    isDisqualified: boolean;
    disqualificationReasons: string[];
    deliverables: {
        complexScreen: { quantity: number; effortPerUnit: number };
        simpleScreen: { quantity: number; effortPerUnit: number };
        complexDatabase: { quantity: number; effortPerUnit: number };
        simpleDatabase: { quantity: number; effortPerUnit: number };
    };
    estimationAccuracy: number;
    resourceAllocation: {
        complexScreen: { uiSenior: number; uiJunior: number };
        simpleScreen: { uiSenior: number; uiJunior: number };
        complexDatabase: { backendSenior: number; backendJunior: number };
        simpleDatabase: { backendSenior: number; backendJunior: number };
    };
    workSchedule: {
        workingDaysPerMonth: number;
        workingHoursPerDay: number;
    };
    salaries: {
        uiJunior: number;
        uiSenior: number;
        backendJunior: number;
        backendSenior: number;
    };
    overhead: {
        contingencyPercent: number;
        overheadPercent: number;
        qualityPercent: number;
    };
    totalResourceCost: number;
    totalCost: number;
    projectDuration: number;
}

const botProfiles = [
    {
        name: "Aggressive Pricer",
        strategy: "Low margins, minimal overhead",
        estimationAccuracy: { min: 85, max: 95 },
        salaryRange: { min: -1000, max: 0 },
        workingHoursPerDay: { min: 7, max: 9 },
        overheadRange: { contingency: [8, 12], overhead: [8, 12], quality: [3, 7] },
        bidPriceTarget: 0.92,
        resourceStrategy: "minimal" // fewer resources, longer timeline
    },
    {
        name: "Balanced Bidder",
        strategy: "Moderate approach",
        estimationAccuracy: { min: 75, max: 85 },
        salaryRange: { min: -500, max: 500 },
        workingHoursPerDay: { min: 7, max: 8 },
        overheadRange: { contingency: [10, 15], overhead: [10, 15], quality: [5, 8] },
        bidPriceTarget: 0.96,
        resourceStrategy: "balanced"
    },
    {
        name: "Quality Focused",
        strategy: "Higher quality, higher cost",
        estimationAccuracy: { min: 90, max: 100 },
        salaryRange: { min: 500, max: 1500 },
        workingHoursPerDay: { min: 6, max: 8 },
        overheadRange: { contingency: [12, 18], overhead: [12, 18], quality: [8, 12] },
        bidPriceTarget: 0.98,
        resourceStrategy: "quality" // more senior resources
    },
    {
        name: "Risk Averse",
        strategy: "High contingency, safe approach",
        estimationAccuracy: { min: 80, max: 90 },
        salaryRange: { min: 200, max: 1000 },
        workingHoursPerDay: { min: 7, max: 8 },
        overheadRange: { contingency: [15, 20], overhead: [15, 20], quality: [8, 12] },
        bidPriceTarget: 0.99,
        resourceStrategy: "safe"
    },
    {
        name: "Efficient Operator",
        strategy: "Optimized resources",
        estimationAccuracy: { min: 85, max: 95 },
        salaryRange: { min: -800, max: 200 },
        workingHoursPerDay: { min: 8, max: 10 },
        overheadRange: { contingency: [8, 12], overhead: [8, 12], quality: [4, 7] },
        bidPriceTarget: 0.94,
        resourceStrategy: "efficient" // balanced with more hours
    }
];

function randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateBotBid(profile: typeof botProfiles[0]): BotBid {
    const seniorToJuniorProductivity = 2;
    const earlyFinishBonus = 25000;
    const expectedProjectDuration = 5;

    // Base deliverables (from ProjectDataContext)
    const deliverables = {
        complexScreen: { quantity: 180, effortPerUnit: 40 },
        simpleScreen: { quantity: 410, effortPerUnit: 16 },
        complexDatabase: { quantity: 95, effortPerUnit: 32 },
        simpleDatabase: { quantity: 210, effortPerUnit: 12 }
    };

    // Random estimation accuracy within profile range
    const estimationAccuracy = randomInRange(profile.estimationAccuracy.min, profile.estimationAccuracy.max);
    console.log('Bot estimation accuracy:', estimationAccuracy); // Debug log

    // Resource allocation based on strategy
    // Adjusted counts to be more realistic for the new scope (~5 month project)
    let resourceAllocation;

    if (profile.resourceStrategy === "minimal") {
        resourceAllocation = {
            complexScreen: { uiSenior: randomInRange(1, 2), uiJunior: randomInRange(10, 15) },
            simpleScreen: { uiSenior: randomInRange(0, 1), uiJunior: randomInRange(8, 12) },
            complexDatabase: { backendSenior: randomInRange(1, 2), backendJunior: randomInRange(8, 12) },
            simpleDatabase: { backendSenior: randomInRange(0, 1), backendJunior: randomInRange(6, 10) }
        };
    } else if (profile.resourceStrategy === "quality") {
        resourceAllocation = {
            complexScreen: { uiSenior: randomInRange(2, 4), uiJunior: randomInRange(8, 12) },
            simpleScreen: { uiSenior: randomInRange(1, 3), uiJunior: randomInRange(6, 10) },
            complexDatabase: { backendSenior: randomInRange(2, 4), backendJunior: randomInRange(6, 10) },
            simpleDatabase: { backendSenior: randomInRange(1, 3), backendJunior: randomInRange(5, 8) }
        };
    } else {
        resourceAllocation = {
            complexScreen: { uiSenior: randomInRange(1, 3), uiJunior: randomInRange(9, 14) },
            simpleScreen: { uiSenior: randomInRange(1, 2), uiJunior: randomInRange(7, 11) },
            complexDatabase: { backendSenior: randomInRange(1, 3), backendJunior: randomInRange(7, 11) },
            simpleDatabase: { backendSenior: randomInRange(1, 2), backendJunior: randomInRange(6, 9) }
        };
    }

    // Working schedule with variation
    const workSchedule = {
        workingDaysPerMonth: 20, // Sync with ProjectDataContext
        workingHoursPerDay: randomInRange(profile.workingHoursPerDay.min, profile.workingHoursPerDay.max)
    };

    // Salaries within UI ranges (sync with new scenario defaults)
    const baseSalaries = {
        uiJunior: 4000,
        uiSenior: 7500,
        backendJunior: 4800,
        backendSenior: 9000
    };


    const salaryVariation = randomInRange(profile.salaryRange.min, profile.salaryRange.max);
    const salaries = {
        uiJunior: Math.max(2000, baseSalaries.uiJunior + salaryVariation),
        uiSenior: Math.max(5500, baseSalaries.uiSenior + salaryVariation),
        backendJunior: Math.max(2800, baseSalaries.backendJunior + salaryVariation),
        backendSenior: Math.max(7000, baseSalaries.backendSenior + salaryVariation)
    };

    // Overhead percentages within profile ranges
    const overhead = {
        contingencyPercent: randomInRange(profile.overheadRange.contingency[0], profile.overheadRange.contingency[1]),
        overheadPercent: randomInRange(profile.overheadRange.overhead[0], profile.overheadRange.overhead[1]),
        qualityPercent: randomInRange(profile.overheadRange.quality[0], profile.overheadRange.quality[1])
    };

    // Calculate total resource cost
    let totalResourceCost = 0;
    const disqualificationReasons: string[] = [];

    Object.entries(deliverables).forEach(([deliverableName, { quantity, effortPerUnit }]) => {
        const adjustedQuantity = quantity * (100 / estimationAccuracy);
        const cost = adjustedQuantity * effortPerUnit;

        const isUI = deliverableName.includes('Screen');
        const allocation = resourceAllocation[deliverableName as keyof typeof resourceAllocation];

        let junior, senior, juniorSalary, seniorSalary;
        if (isUI) {
            junior = allocation.uiJunior || 0;
            senior = allocation.uiSenior || 0;
            juniorSalary = salaries.uiJunior;
            seniorSalary = salaries.uiSenior;
        } else {
            junior = allocation.backendJunior || 0;
            senior = allocation.backendSenior || 0;
            juniorSalary = salaries.backendJunior;
            seniorSalary = salaries.backendSenior;
        }

        const denominator = junior + (senior * seniorToJuniorProductivity);
        if (denominator > 0) {
            const personHours = cost / denominator;
            const personDays = personHours / workSchedule.workingHoursPerDay;
            const personMonths = personDays / workSchedule.workingDaysPerMonth;
            const monthsOfEngagement = Math.ceil(personMonths);

            if (personMonths > 5) {
                disqualificationReasons.push(`${deliverableName} timeline (${personMonths.toFixed(2)} months) exceeds 5 months`);
            }

            const costOfJuniors = juniorSalary * monthsOfEngagement * junior;
            const costOfSeniors = seniorSalary * monthsOfEngagement * senior;
            totalResourceCost += costOfJuniors + costOfSeniors;
        }
    });

    // Calculate total cost
    const contingencyCost = totalResourceCost * (overhead.contingencyPercent / 100);
    const overheadCost = totalResourceCost * (overhead.overheadPercent / 100);
    const qualityCost = totalResourceCost * (overhead.qualityPercent / 100);
    const totalCost = totalResourceCost + contingencyCost + overheadCost + qualityCost;

    // Calculate bid price - ensure it stays under budget for most bots
    const targetBidPrice = totalCost * (1 + (profile.bidPriceTarget - 0.9) / 2); // Margin based on target
    let bidPrice = Math.round(targetBidPrice + (Math.random() - 0.5) * 15000);

    // Ensure bid price is under budget (with small chance of going over)
    if (Math.random() > 0.15) { // 85% chance to stay under budget
        bidPrice = Math.min(bidPrice, 999999);
    }


    // Check for budget violation
    if (bidPrice > 1000000) {
        disqualificationReasons.push(`Bid price ($${bidPrice.toLocaleString()}) exceeds budget of $1,000,000`);
    }


    // Calculate contribution margin
    const contributionMarginExcluding = bidPrice - totalCost;

    // Calculate project duration
    let projectDuration = 0;
    Object.entries(deliverables).forEach(([deliverableName, { quantity, effortPerUnit }]) => {
        const adjustedQuantity = quantity * (100 / estimationAccuracy);
        const cost = adjustedQuantity * effortPerUnit;

        const isUI = deliverableName.includes('Screen');
        const allocation = resourceAllocation[deliverableName as keyof typeof resourceAllocation];

        let junior, senior;
        if (isUI) {
            junior = allocation.uiJunior || 0;
            senior = allocation.uiSenior || 0;
        } else {
            junior = allocation.backendJunior || 0;
            senior = allocation.backendSenior || 0;
        }

        const denominator = junior + (senior * seniorToJuniorProductivity);
        if (denominator > 0) {
            const personHours = cost / denominator;
            const personDays = personHours / workSchedule.workingHoursPerDay;
            const personMonths = personDays / workSchedule.workingDaysPerMonth;
            const monthsOfEngagement = Math.ceil(personMonths);
            projectDuration = Math.max(projectDuration, monthsOfEngagement);
        }
    });

    const completedEarlyBy = expectedProjectDuration - projectDuration;
    const contributionMargin = contributionMarginExcluding + (completedEarlyBy * earlyFinishBonus);

    return {
        name: profile.name,
        bidPrice,
        contributionMargin,
        isDisqualified: disqualificationReasons.length > 0,
        disqualificationReasons,
        deliverables,
        estimationAccuracy,
        resourceAllocation,
        workSchedule,
        salaries,
        overhead,
        totalResourceCost,
        totalCost,
        projectDuration
    };
}

export function generateBots(count: number = 5): BotBid[] {
    const bots: BotBid[] = [];

    // Generate bots from profiles
    for (let i = 0; i < Math.min(count, botProfiles.length); i++) {
        bots.push(calculateBotBid(botProfiles[i]));
    }

    // If we need more bots, create variations
    while (bots.length < count) {
        const baseProfile = botProfiles[Math.floor(Math.random() * botProfiles.length)];
        const variation = {
            ...baseProfile,
            name: `${baseProfile.name} ${bots.length + 1}`,
            estimationAccuracy: {
                min: Math.max(1, baseProfile.estimationAccuracy.min - 5),
                max: Math.min(100, baseProfile.estimationAccuracy.max + 5)
            },
            salaryRange: {
                min: baseProfile.salaryRange.min - 100,
                max: baseProfile.salaryRange.max + 100
            },
            workingHoursPerDay: baseProfile.workingHoursPerDay,
            overheadRange: baseProfile.overheadRange,
            bidPriceTarget: baseProfile.bidPriceTarget * (0.98 + Math.random() * 0.04),
            resourceStrategy: baseProfile.resourceStrategy
        };
        bots.push(calculateBotBid(variation));
    }

    return bots;
}
