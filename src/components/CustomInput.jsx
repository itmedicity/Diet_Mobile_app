import React, { useState } from "react";
import { Box } from "@mui/joy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import '../Style/Style.css'
import TextComponent from "./TextComponent";

const CustomInput = ({
    placeholder,
    type = "text",
    onChange,
    error,
    helperText,
    value,
    name
}) => {

    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    return (
        <Box sx={{ width: "100%", mb: 1 }}>

            {/* Wrapper for input + icon */}
            <Box sx={{ position: "relative", width: "100%" }}>

                <input
                    name={name}
                    className="qty-input"
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    style={{
                        width: "95%",
                        fontFamily: "Bahnschrift",
                        height: 40,
                        fontSize: "12px",
                        borderRadius: 20,
                        padding: "5px 12px",
                        border: error
                            ? "1px solid #d32f2f"
                            : "1px solid #ccc",
                        outline: "none",
                        transition: "0.3s",
                        fontWeight: 300
                    }}
                />

                {/* Eye Icon */}
                {isPassword && (
                    <Box
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{
                            position: "absolute",
                            right: 15,
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            opacity: 0.5
                        }}
                    >
                        {showPassword ? (
                            <VisibilityOffIcon sx={{ fontSize: 20 }} />
                        ) : (
                            <VisibilityIcon sx={{ fontSize: 20 }} />
                        )}
                    </Box>
                )}

            </Box>

            {/* Error Message */}
            {error && helperText && (
                <Box sx={{ width: '100%', textAlign: 'start', mt: 0.5 }}>
                    <TextComponent color={'#d32f2f'} value={helperText} size={10} />
                </Box>
            )}

        </Box>
    );
};

export default CustomInput;
