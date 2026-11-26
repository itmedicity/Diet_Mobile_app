
import React from "react";
import { Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";

const InvalidDietScreen = ({ handleReturnHome }) => {
    return (
        <Box
            sx={{
                minHeight: "75vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
            }}
        >
            <style>
                {`
                    @keyframes floatFood {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-12px) rotate(8deg); }
                    }

                    @keyframes platePulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.035); }
                    }

                    @keyframes leafMove {
                        0%, 100% { transform: rotate(-8deg); }
                        50% { transform: rotate(12deg); }
                    }

                    @keyframes fadeUp {
                        from { opacity: 0; transform: translateY(15px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .food-float {
                        animation: floatFood 3s ease-in-out infinite;
                    }

                    .food-plate {
                        animation: platePulse 4s ease-in-out infinite;
                        transform-origin: center;
                    }

                    .food-leaf {
                        animation: leafMove 3s ease-in-out infinite;
                        transform-origin: center;
                    }

                    .diet-content {
                        animation: fadeUp 0.7s ease-out both;
                    }

                    .home-action {
                        transition: all 0.25s ease;
                    }

                    .home-action:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 20px rgba(37, 150, 105, 0.25);
                    }
                `}
            </style>

            <Box
                sx={{
                    width: "100%",
                    maxWidth: 440,
                    bgcolor: "#ffffff",
                    border: "1px solid #e5eee8",
                    borderRadius: "25px",
                    p: { xs: 3, sm: 4 },
                    textAlign: "center",
                    boxShadow: "0 12px 40px rgba(30,80,55,0.07)",
                }}
            >
                {/* Animated Food Illustration */}
                <Box
                    sx={{
                        width: 230,
                        height: 210,
                        mx: "auto",
                        position: "relative",
                    }}
                >
                    <svg
                        viewBox="0 0 240 210"
                        width="100%"
                        height="100%"
                    >
                        {/* Background circles */}
                        <circle cx="120" cy="105" r="88" fill="#f0f9f3" />
                        <circle cx="120" cy="105" r="70" fill="#e4f3e9" />

                        {/* Floating carrot */}
                        <g className="food-float">
                            <path
                                d="M36 49 L55 86 Q62 96 68 83 L76 48 Z"
                                fill="#f49b43"
                                stroke="#dc812e"
                                strokeWidth="2"
                            />
                            <path
                                d="M55 47 Q39 27 31 35 M56 47 Q56 23 65 26 M57 47 Q76 29 78 38"
                                stroke="#48a66b"
                                strokeWidth="5"
                                fill="none"
                                strokeLinecap="round"
                            />
                        </g>

                        {/* Floating broccoli */}
                        <g className="food-float" style={{ animationDelay: "0.8s" }}>
                            <circle cx="190" cy="54" r="15" fill="#4caa70" />
                            <circle cx="179" cy="60" r="12" fill="#60b77d" />
                            <circle cx="199" cy="65" r="12" fill="#398f5d" />
                            <path d="M187 69 L190 83 L196 70" fill="#70b85f" />
                        </g>

                        {/* Main plate */}
                        <g className="food-plate">
                            <circle
                                cx="120"
                                cy="115"
                                r="62"
                                fill="#ffffff"
                                stroke="#d5e8dc"
                                strokeWidth="5"
                            />
                            <circle
                                cx="120"
                                cy="115"
                                r="51"
                                fill="#f9fcf9"
                                stroke="#edf3ee"
                                strokeWidth="2"
                            />

                            {/* Rice */}
                            <path
                                d="M87 111 Q88 91 105 94 Q116 82 131 96 Q150 90 153 111 Q148 125 120 124 Q94 126 87 111"
                                fill="#fff0cf"
                            />
                            <path
                                d="M96 105 Q108 96 119 106 M121 104 Q137 96 145 108"
                                stroke="#e4d3ad"
                                strokeWidth="2"
                                fill="none"
                            />

                            {/* Vegetables */}
                            <circle cx="95" cy="137" r="10" fill="#55a96b" />
                            <circle cx="110" cy="143" r="9" fill="#7bbb58" />
                            <circle cx="132" cy="139" r="10" fill="#f28c49" />
                            <circle cx="145" cy="129" r="8" fill="#e7bd54" />

                            {/* Salad leaves */}
                            <path
                                d="M103 119 Q91 98 102 100 Q117 105 110 120"
                                fill="#63b979"
                            />
                            <path
                                d="M126 119 Q137 98 145 107 Q144 120 126 119"
                                fill="#3e9e60"
                            />
                        </g>

                        {/* Floating leaf */}
                        <g className="food-leaf">
                            <path
                                d="M185 143 Q207 115 218 140 Q215 160 185 143"
                                fill="#65b879"
                            />
                            <path
                                d="M187 143 L211 138"
                                stroke="#328c50"
                                strokeWidth="2"
                                fill="none"
                            />
                        </g>

                        {/* Small decorative dots */}
                        <circle cx="45" cy="143" r="4" fill="#f2bd63" />
                        <circle cx="206" cy="100" r="4" fill="#f2bd63" />
                        <circle cx="83" cy="177" r="3" fill="#75bd8c" />
                    </svg>
                </Box>

                <Box className="diet-content">
                    <Box
                        sx={{
                            display: "inline-flex",
                            px: 1.5,
                            py: 0.6,
                            borderRadius: "20px",
                            bgcolor: "#fff2e9",
                            color: "#d17b36",
                            fontSize: 10,
                            fontWeight: 800,
                            letterSpacing: 1,
                            mb: 1.5,
                        }}
                    >
                        SESSION UNAVAILABLE
                    </Box>

                    <Box
                        sx={{
                            fontSize: 24,
                            fontWeight: 900,
                            color: "#263c30",
                            mb: 1,
                        }}
                    >
                        Oops! Something is missing
                    </Box>

                    <Box
                        sx={{
                            fontSize: 13,
                            lineHeight: 1.8,
                            color: "#849189",
                            maxWidth: 310,
                            mx: "auto",
                        }}
                    >
                        We couldn't verify your access to this diet
                        page. Your session may have expired or the
                        link may no longer be valid.
                    </Box>

                    <Box
                        component="button"
                        className="home-action"
                        onClick={handleReturnHome}
                        sx={{
                            mt: 3,
                            px: 3.5,
                            py: 1.5,
                            border: "none",
                            borderRadius: "12px",
                            bgcolor: "#269b68",
                            color: "#ffffff",
                            fontSize: 13,
                            fontWeight: 800,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <span>←</span>
                        Return to Home
                    </Box>

                    <Box
                        sx={{
                            mt: 2.5,
                            fontSize: 10,
                            color: "#a2aca5",
                        }}
                    >
                        Hospital Diet Management System
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default InvalidDietScreen;
