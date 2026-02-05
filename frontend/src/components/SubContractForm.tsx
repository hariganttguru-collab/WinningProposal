import { useContract } from '../context/ContractContext';

export default function SubContractForm() {
    const {
        subContractInput,
        updateSubcontractorSelection,
        getSubContractCost,
        getResourceCostAfterSubcontracting,
        getInternalResourcesAfterSubcontracting,
        getTotalSubContractCost,
        calculatedValues
    } = useContract();

    // Data tables from your screenshot
    const discountPremiumTable = {
        "Design": { "SubCon-1": "8%", "SubCon-2": "-16%", "SubCon-3": "12%" },
        "Coding": { "SubCon-1": "-11%", "SubCon-2": "9%", "SubCon-3": "-13%" },
        "Testing": { "SubCon-1": "-6%", "SubCon-2": "-14%", "SubCon-3": "4%" },
        "Deployment": { "SubCon-1": "3%", "SubCon-2": "2%", "SubCon-3": "-7%" }
    };

    const riskRating = {
        "SubCon-1": "Major",
        "SubCon-2": "Significant",
        "SubCon-3": "Minor"
    };

    const subcontractorCosts = {
        "Design": { "SubCon-1": 24037, "SubCon-2": 18695, "SubCon-3": 24927 },
        "Coding": { "SubCon-1": 19808, "SubCon-2": 24260, "SubCon-3": 19363 },
        "Testing": { "SubCon-1": 20921, "SubCon-2": 19141, "SubCon-3": 23147 },
        "Deployment": { "SubCon-1": 22924, "SubCon-2": 22702, "SubCon-3": 20699 }
    };

    const modules = ["Requirements", "Design", "Coding", "Testing", "Deployment"];
    const subcontractors = ["SubCon-1", "SubCon-2", "SubCon-3"];

    return (
        <div style={{ marginTop: "30px" }}>
            {/* Header */}
            <div
                style={{
                    backgroundColor: "#0f172a",
                    color: "#f1f5f9",
                    padding: "20px 30px",
                    fontWeight: "600",
                    fontSize: "20px",
                    borderRadius: "12px 12px 0 0",
                    borderBottom: "1px solid #334155"
                }}
            >
                Sub Contract Cost
            </div>

            <div style={{
                backgroundColor: "#1e293b",
                padding: "40px",
                borderRadius: "0 0 12px 12px",
                color: "#e2e8f0",
                border: "1px solid #334155",
                borderTop: "none"
            }}>

                {/* Discount-Premium Table */}
                <div style={{ marginBottom: "32px" }}>
                    <h4 style={{
                        margin: "0 0 16px 0",
                        textAlign: "center",
                        color: "#f1f5f9",
                        fontSize: "16px",
                        fontWeight: "600"
                    }}>
                        Discount-Premium Table
                    </h4>
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
                                        backgroundColor: "#1e293b",
                                        padding: "12px 16px",
                                        borderBottom: "2px solid #334155",
                                        color: "#f1f5f9",
                                        fontWeight: "600",
                                        fontSize: "14px"
                                    }}>
                                        Module
                                    </th>
                                    <th style={{
                                        backgroundColor: "#1e293b",
                                        padding: "12px 16px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        color: "#94a3b8",
                                        fontWeight: "500",
                                        fontSize: "13px"
                                    }}>
                                        SubCon-1
                                    </th>
                                    <th style={{
                                        backgroundColor: "#1e293b",
                                        padding: "12px 16px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        color: "#94a3b8",
                                        fontWeight: "500",
                                        fontSize: "13px"
                                    }}>
                                        SubCon-2
                                    </th>
                                    <th style={{
                                        backgroundColor: "#1e293b",
                                        padding: "12px 16px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        color: "#94a3b8",
                                        fontWeight: "500",
                                        fontSize: "13px"
                                    }}>
                                        SubCon-3
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(discountPremiumTable).map(([module, values]) => (
                                    <tr key={module}>
                                        <td style={{
                                            padding: "12px 16px",
                                            borderBottom: "1px solid #334155",
                                            backgroundColor: "#1e293b",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {module}
                                        </td>
                                        <td style={{
                                            padding: "12px 16px",
                                            borderBottom: "1px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: "#0f172a",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {values["SubCon-1"]}
                                        </td>
                                        <td style={{
                                            padding: "12px 16px",
                                            borderBottom: "1px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: "#0f172a",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {values["SubCon-2"]}
                                        </td>
                                        <td style={{
                                            padding: "12px 16px",
                                            borderBottom: "1px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: "#0f172a",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {values["SubCon-3"]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Risk Rating Table */}
                <div style={{ marginBottom: "32px" }}>
                    <h4 style={{
                        margin: "0 0 16px 0",
                        textAlign: "center",
                        color: "#f1f5f9",
                        fontSize: "16px",
                        fontWeight: "600"
                    }}>
                        Risk Rating
                    </h4>
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
                                        backgroundColor: "#1e293b",
                                        padding: "12px 16px",
                                        borderBottom: "2px solid #334155",
                                        color: "#94a3b8",
                                        fontWeight: "500",
                                        fontSize: "13px"
                                    }}>
                                        SubCon-1
                                    </th>
                                    <th style={{
                                        backgroundColor: "#1e293b",
                                        padding: "12px 16px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        color: "#94a3b8",
                                        fontWeight: "500",
                                        fontSize: "13px"
                                    }}>
                                        SubCon-2
                                    </th>
                                    <th style={{
                                        backgroundColor: "#1e293b",
                                        padding: "12px 16px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        color: "#94a3b8",
                                        fontWeight: "500",
                                        fontSize: "13px"
                                    }}>
                                        SubCon-3
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{
                                        padding: "12px 16px",
                                        textAlign: "center",
                                        backgroundColor: "#0f172a",
                                        color: "#e2e8f0",
                                        fontWeight: "500"
                                    }}>
                                        {riskRating["SubCon-1"]}
                                    </td>
                                    <td style={{
                                        padding: "12px 16px",
                                        borderLeft: "1px solid #334155",
                                        textAlign: "center",
                                        backgroundColor: "#0f172a",
                                        color: "#e2e8f0",
                                        fontWeight: "500"
                                    }}>
                                        {riskRating["SubCon-2"]}
                                    </td>
                                    <td style={{
                                        padding: "12px 16px",
                                        borderLeft: "1px solid #334155",
                                        textAlign: "center",
                                        backgroundColor: "#0f172a",
                                        color: "#e2e8f0",
                                        fontWeight: "500"
                                    }}>
                                        {riskRating["SubCon-3"]}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Subcontractor Costs Table */}
                <div style={{ marginBottom: "32px" }}>
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
                                        backgroundColor: "#1e293b",
                                        padding: "12px 16px",
                                        borderBottom: "2px solid #334155",
                                        color: "#f1f5f9",
                                        fontWeight: "600",
                                        fontSize: "14px"
                                    }}>
                                        Module
                                    </th>
                                    <th style={{
                                        backgroundColor: "#1e293b",
                                        padding: "12px 16px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        color: "#94a3b8",
                                        fontWeight: "500",
                                        fontSize: "13px"
                                    }}>
                                        SubCon-1
                                    </th>
                                    <th style={{
                                        backgroundColor: "#1e293b",
                                        padding: "12px 16px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        color: "#94a3b8",
                                        fontWeight: "500",
                                        fontSize: "13px"
                                    }}>
                                        SubCon-2
                                    </th>
                                    <th style={{
                                        backgroundColor: "#1e293b",
                                        padding: "12px 16px",
                                        borderBottom: "2px solid #334155",
                                        borderLeft: "1px solid #334155",
                                        color: "#94a3b8",
                                        fontWeight: "500",
                                        fontSize: "13px"
                                    }}>
                                        SubCon-3
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(subcontractorCosts).map(([module, costs]) => (
                                    <tr key={module}>
                                        <td style={{
                                            padding: "12px 16px",
                                            borderBottom: "1px solid #334155",
                                            backgroundColor: "#1e293b",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {module}
                                        </td>
                                        <td style={{
                                            padding: "12px 16px",
                                            borderBottom: "1px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: "#0f172a",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {costs["SubCon-1"]}
                                        </td>
                                        <td style={{
                                            padding: "12px 16px",
                                            borderBottom: "1px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: "#0f172a",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {costs["SubCon-2"]}
                                        </td>
                                        <td style={{
                                            padding: "12px 16px",
                                            borderBottom: "1px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            textAlign: "center",
                                            backgroundColor: "#0f172a",
                                            color: "#e2e8f0",
                                            fontWeight: "500"
                                        }}>
                                            {costs["SubCon-3"]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{
                        textAlign: "right",
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "8px",
                        fontWeight: "500"
                    }}>
                        Table 4
                    </div>
                </div>

                {/* Layout: Input Table on Left, Results on Right */}
                <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>

                    {/* Left Side - Input Table */}
                    <div style={{ flex: 1 }}>
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
                                            backgroundColor: "#1e293b",
                                            padding: "16px 20px",
                                            borderBottom: "2px solid #334155",
                                            fontWeight: "600",
                                            color: "#f1f5f9",
                                            fontSize: "14px"
                                        }}>
                                            Select Sub Contractor
                                        </th>
                                        <th style={{
                                            backgroundColor: "#1e293b",
                                            padding: "16px 20px",
                                            borderBottom: "2px solid #334155",
                                            borderLeft: "1px solid #334155",
                                            fontSize: "14px",
                                            color: "#f1f5f9",
                                            fontWeight: "600"
                                        }}>
                                            Module
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modules.map((module) => {
                                        const selection = subContractInput.selectedSubcontractors[module] || "None";

                                        return (
                                            <tr key={module}>
                                                <td style={{
                                                    backgroundColor: "#1e293b",
                                                    padding: "16px 20px",
                                                    borderBottom: "1px solid #334155",
                                                    textAlign: "center"
                                                }}>
                                                    <select
                                                        value={selection}
                                                        onChange={(e) => updateSubcontractorSelection(module, e.target.value)}
                                                        style={{
                                                            padding: "8px 16px",
                                                            border: "2px solid #475569",
                                                            borderRadius: "6px",
                                                            backgroundColor: "#0f172a",
                                                            color: "#f1f5f9",
                                                            fontSize: "14px",
                                                            fontWeight: "500",
                                                            outline: "none",
                                                            minWidth: "140px",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        <option value="None">None</option>
                                                        <option value="SubCon-1">SubCon-1</option>
                                                        <option value="SubCon-2">SubCon-2</option>
                                                        <option value="SubCon-3">SubCon-3</option>
                                                    </select>
                                                </td>
                                                <td style={{
                                                    padding: "16px 20px",
                                                    borderBottom: "1px solid #334155",
                                                    borderLeft: "1px solid #334155",
                                                    backgroundColor: "#0f172a",
                                                    color: "#e2e8f0",
                                                    fontWeight: "500",
                                                    fontSize: "14px",
                                                    textAlign: "center"
                                                }}>
                                                    {module}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Side - Output Cards */}
                    <div style={{ flex: "0 0 280px", display: "flex", flexDirection: "column", gap: "16px" }}>

                        {/* Sub Contract Cost */}
                        <div style={{
                            backgroundColor: "#3b82f6",
                            borderRadius: "12px",
                            padding: "24px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                            border: "1px solid #2563eb",
                            textAlign: "center"
                        }}>
                            <div style={{
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "rgba(255, 255, 255, 0.9)",
                                marginBottom: "12px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                            }}>
                                Sub Contract Cost
                            </div>
                            <div style={{
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "white"
                            }}>
                                {getTotalSubContractCost()}
                            </div>
                        </div>

                        {/* Resource Cost after Subcontracting */}
                        <div style={{
                            backgroundColor: "#3b82f6",
                            borderRadius: "12px",
                            padding: "24px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                            border: "1px solid #2563eb",
                            textAlign: "center"
                        }}>
                            <div style={{
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "rgba(255, 255, 255, 0.9)",
                                marginBottom: "12px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                            }}>
                                Resource Cost after Subcontracting
                            </div>
                            <div style={{
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "white"
                            }}>
                                {modules.reduce((total, module) => total + getResourceCostAfterSubcontracting(module), 0).toFixed(0)}
                            </div>
                        </div>

                        {/* Number of Internal Resources */}
                        <div style={{
                            backgroundColor: "#3b82f6",
                            borderRadius: "12px",
                            padding: "24px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                            border: "1px solid #2563eb",
                            textAlign: "center"
                        }}>
                            <div style={{
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "rgba(255, 255, 255, 0.9)",
                                marginBottom: "12px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                            }}>
                                Internal Resources after Subcontracting
                            </div>
                            <div style={{
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "white"
                            }}>
                                {modules.reduce((total, module) => total + getInternalResourcesAfterSubcontracting(module), 0).toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table 5 Label */}
                <div style={{
                    textAlign: "right",
                    marginTop: "16px",
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "500"
                }}>
                    Table 5
                </div>
            </div>
        </div>
    );
}