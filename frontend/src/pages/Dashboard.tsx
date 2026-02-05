import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLobby } from "../context/LobbyContext";

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { createLobby } = useLobby();

    const openContract = (mode: "CPU" | "MULTI") => {
        if (mode === "CPU") {
            navigate(`/contract?mode=${mode}`);
        } else if (mode === "MULTI") {
            if (!isAuthenticated) {
                navigate("/login");
                return;
            }

            // Admin creates lobby, User joins lobby
            if (isAdmin && user) {
                const code = createLobby(user.id, user.username);
                navigate('/lobby');
            } else {
                navigate('/join-lobby');
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#0f172a",
            padding: "0"
        }}>
            {/* Header */}
            <div style={{
                backgroundColor: "#1e293b",
                borderBottom: "1px solid #334155",
                padding: "32px 0"
            }}>
                <div style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 32px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div>
                        <h1 style={{
                            fontSize: "32px",
                            fontWeight: "700",
                            color: "#f1f5f9",
                            margin: "0",
                            letterSpacing: "-0.025em"
                        }}>
                            Fixed Price Contract Simulation
                        </h1>
                        <p style={{
                            fontSize: "16px",
                            color: "#94a3b8",
                            margin: "8px 0 0 0",
                            fontWeight: "400"
                        }}>
                            Professional contract bidding and project management simulation
                        </p>
                    </div>

                    {/* User Info */}
                    {isAuthenticated && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px"
                        }}>
                            <div style={{
                                textAlign: "right"
                            }}>
                                <div style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "#f1f5f9",
                                    marginBottom: "4px"
                                }}>
                                    {user?.username}
                                </div>
                                <div style={{
                                    fontSize: "12px",
                                    color: isAdmin ? "#10b981" : "#3b82f6",
                                    fontWeight: "500"
                                }}>
                                    {isAdmin ? "👑 Admin" : "👤 User"}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#ef4444",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}
                            >
                                Logout
                            </button>
                        </div>
                    )}

                    {!isAuthenticated && (
                        <button
                            onClick={() => navigate("/login")}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#3b82f6",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
                        >
                            Sign In for Multiplayer
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "48px 32px"
            }}>
                {/* Project Card */}
                <div style={{
                    backgroundColor: "#1e293b",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                    border: "1px solid #334155"
                }}>
                    {/* Project Header */}
                    <div style={{
                        backgroundColor: "#0f172a",
                        padding: "24px 32px",
                        color: "white",
                        borderBottom: "1px solid #334155"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "16px"
                        }}>
                            <div>
                                <h3 style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    margin: "0 0 8px 0",
                                    color: "#f1f5f9"
                                }}>
                                    Automation Testing Project
                                </h3>
                                <div style={{
                                    display: "inline-block",
                                    backgroundColor: "#10b981",
                                    color: "white",
                                    padding: "4px 12px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em"
                                }}>
                                    Active Project
                                </div>
                            </div>
                            <div style={{
                                textAlign: "right"
                            }}>
                                <div style={{
                                    fontSize: "12px",
                                    color: "#64748b",
                                    marginBottom: "4px"
                                }}>
                                    Project ID
                                </div>
                                <div style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    fontFamily: "monospace",
                                    color: "#94a3b8"
                                }}>
                                    ATP-2024-001
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Details */}
                    <div style={{
                        padding: "32px"
                    }}>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "24px",
                            marginBottom: "32px"
                        }}>
                            <div style={{
                                padding: "20px",
                                backgroundColor: "#0f172a",
                                borderRadius: "12px",
                                border: "1px solid #334155"
                            }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "8px"
                                }}>
                                    <span style={{ fontSize: "16px" }}>💰</span>
                                    <span style={{
                                        fontSize: "12px",
                                        color: "#64748b",
                                        fontWeight: "500",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em"
                                    }}>
                                        Budget Cap
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: "24px",
                                    fontWeight: "700",
                                    color: "#f1f5f9"
                                }}>
                                    $500,000
                                </div>
                            </div>

                            <div style={{
                                padding: "20px",
                                backgroundColor: "#0f172a",
                                borderRadius: "12px",
                                border: "1px solid #334155"
                            }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "8px"
                                }}>
                                    <span style={{ fontSize: "16px" }}>⏱️</span>
                                    <span style={{
                                        fontSize: "12px",
                                        color: "#64748b",
                                        fontWeight: "500",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em"
                                    }}>
                                        Duration
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: "24px",
                                    fontWeight: "700",
                                    color: "#f1f5f9"
                                }}>
                                    5 Months
                                </div>
                            </div>

                            <div style={{
                                padding: "20px",
                                backgroundColor: "#0f172a",
                                borderRadius: "12px",
                                border: "1px solid #334155"
                            }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "8px"
                                }}>
                                    <span style={{ fontSize: "16px" }}>🎯</span>
                                    <span style={{
                                        fontSize: "12px",
                                        color: "#64748b",
                                        fontWeight: "500",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em"
                                    }}>
                                        Award Criteria
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#f1f5f9"
                                }}>
                                    Lowest Bidder
                                </div>
                            </div>
                        </div>

                        {/* Project Description */}
                        <div style={{
                            backgroundColor: "#0f172a",
                            padding: "24px",
                            borderRadius: "12px",
                            marginBottom: "32px",
                            border: "1px solid #334155"
                        }}>
                            <h4 style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#f1f5f9",
                                margin: "0 0 12px 0"
                            }}>
                                Project Overview
                            </h4>
                            <p style={{
                                fontSize: "14px",
                                color: "#94a3b8",
                                lineHeight: "1.6",
                                margin: "0"
                            }}>
                                Automate manual test cases for a critical client system. The project scope was estimated
                                by an onsite team during a 5-day assessment. The client requires urgent delivery within
                                budget constraints, making this a competitive bidding scenario requiring strategic
                                project management and risk assessment.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                            display: "flex",
                            gap: "16px",
                            flexWrap: "wrap"
                        }}>
                            <button
                                onClick={() => openContract("CPU")}
                                style={{
                                    flex: "1",
                                    minWidth: "200px",
                                    padding: "16px 24px",
                                    backgroundColor: "#3b82f6",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = "#2563eb";
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.4)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = "#3b82f6";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)";
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                    <span>🤖</span>
                                    <span>Solo Simulation</span>
                                </div>
                                <div style={{
                                    fontSize: "12px",
                                    opacity: "0.9",
                                    marginTop: "4px"
                                }}>
                                    Practice against AI competitors
                                </div>
                            </button>

                            <button
                                onClick={() => openContract("MULTI")}
                                style={{
                                    flex: "1",
                                    minWidth: "200px",
                                    padding: "16px 24px",
                                    backgroundColor: "#10b981",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = "#059669";
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.4)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = "#10b981";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)";
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                    <span>👥</span>
                                    <span>Team Simulation</span>
                                </div>
                                <div style={{
                                    fontSize: "12px",
                                    opacity: "0.9",
                                    marginTop: "4px"
                                }}>
                                    Collaborate with team members
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}