import { useContract } from '../context/ContractContext';

export default function OverheadProfitForm() {
    const {
        overheadProfitInput,
        updateOverheadChargesPercentage
    } = useContract();

    return (
        <div style={{ marginTop: "30px" }}>
            {/* Overhead Charges Section */}
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
                Overhead Charges
            </div>

            <div style={{
                backgroundColor: "#1e293b",
                padding: "60px 40px",
                borderRadius: "0 0 12px 12px",
                color: "#e2e8f0",
                textAlign: "center",
                border: "1px solid #334155",
                borderTop: "none"
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px"
                }}>
                    <input
                        type="number"
                        value={overheadProfitInput.overheadChargesPercentage}
                        onChange={(e) => updateOverheadChargesPercentage(Number(e.target.value))}
                        style={{
                            fontSize: "48px",
                            fontWeight: "700",
                            border: "3px solid #10b981",
                            borderRadius: "12px",
                            padding: "16px 24px",
                            textAlign: "center",
                            width: "180px",
                            backgroundColor: "#0f172a",
                            color: "#f1f5f9",
                            outline: "none",
                            transition: "all 0.2s ease",
                            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = "#3b82f6";
                            e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "#10b981";
                            e.target.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
                        }}
                    />
                    <span style={{
                        fontSize: "48px",
                        fontWeight: "700",
                        color: "#f1f5f9"
                    }}>
                        %
                    </span>
                </div>
                <div style={{
                    marginTop: "20px",
                    fontSize: "16px",
                    color: "#94a3b8",
                    fontWeight: "500"
                }}>
                    Overhead charges percentage
                </div>
            </div>

            {/* Table Label */}
            <div style={{
                textAlign: "right",
                marginTop: "16px",
                fontSize: "13px",
                color: "#64748b",
                fontWeight: "500"
            }}>
                Table 8
            </div>
        </div>
    );
}