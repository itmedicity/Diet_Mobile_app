import { Box } from "@mui/joy";
import React, { memo, useId, useMemo, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MealRoundStrip from "../../components/MealRoundStrip";
import { ROUNDS, currentRoundIndex } from "../../CommonData/mealRound";
import { COLORS, FONT, focusRing } from "../../Style/designTokens";

/*
    Login for ward staff (nurses, delivery staff) on a phone.
    The top band names the meal round that is running now, so the first thing on screen is the
    working day of this app. The meal hours live in CommonData/mealRound.js.
*/
const INK = COLORS.ink;
const PLUM = COLORS.plum;
const PLUM_DARK = COLORS.plumDark;
const WASH = COLORS.wash;
const ORCHID = COLORS.orchid;
const FIELD_BORDER = COLORS.fieldBorder;
const ERROR = COLORS.error;
const MUTED = COLORS.muted;
const SYSTEM_FONT = FONT;

const Field = memo(({ id, label, name, type = "text", value, onChange, error, autoComplete, trailing }) => {
    const describedBy = error ? `${id}-error` : undefined;

    return (
        <Box sx={{ mb: 2 }}>
            <Box
                component="label"
                htmlFor={id}
                sx={{ display: "block", fontSize: 15, fontWeight: 600, color: INK, mb: 0.75 }}
            >
                {label}
            </Box>

            <Box sx={{ position: "relative" }}>
                <Box
                    component="input"
                    id={id}
                    name={name}
                    type={type}
                    value={value ?? ""}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-invalid={!!error}
                    aria-describedby={describedBy}
                    sx={{
                        boxSizing: "border-box",
                        width: "100%",
                        height: 48,
                        px: 1.75,
                        pr: trailing ? 6 : 1.75,
                        fontFamily: SYSTEM_FONT,
                        fontSize: 16, // 16px stops iOS from zooming into the field
                        color: INK,
                        bgcolor: "#fff",
                        border: `1.5px solid ${error ? ERROR : FIELD_BORDER}`,
                        borderRadius: "12px",
                        outline: "none",
                        "&:focus": {
                            borderColor: PLUM,
                            boxShadow: `0 0 0 3px ${ORCHID}`,
                        },
                    }}
                />
                {trailing}
            </Box>

            {error && (
                <Box id={describedBy} role="alert" sx={{ mt: 0.75, fontSize: 14, color: ERROR }}>
                    {error}
                </Box>
            )}
        </Box>
    );
});

const Login = ({ handlelogin, onChange, value, errors }) => {
    const userId = useId();
    const passId = useId();
    const [showPassword, setShowPassword] = useState(false);

    const roundIndex = useMemo(() => currentRoundIndex(), []);
    const round = ROUNDS[roundIndex];

    const submit = (event) => {
        event.preventDefault(); // Enter in a field logs in too
        handlelogin();
    };

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: WASH,
                fontFamily: SYSTEM_FONT,
                color: INK,
            }}
        >
            <Box sx={{ width: "100%", maxWidth: 440, flex: 1, display: "flex", flexDirection: "column" }}>

                {/* Meal round band */}
                <Box component="header" sx={{ px: 3, pt: 4, pb: 5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 5 }}>
                        <Box
                            aria-hidden="true"
                            sx={{
                                width: 40, height: 40, borderRadius: "10px", bgcolor: PLUM, color: "#fff",
                                display: "grid", placeItems: "center", fontWeight: 800, fontSize: 15, letterSpacing: 0.5,
                            }}
                        >
                            TMC
                        </Box>
                        <Box sx={{ fontSize: 15, fontWeight: 600 }}>Diet service</Box>
                    </Box>

                    <Box component="h1" sx={{ m: 0, fontSize: 34, lineHeight: 1.1, fontWeight: 700, letterSpacing: "-0.02em" }}>
                        {round.name} round
                    </Box>
                    <Box sx={{ mt: 1.25, fontSize: 16, lineHeight: 1.45, color: MUTED, maxWidth: 320 }}>
                        Log in to take orders, deliver trays and collect payments.
                    </Box>

                    <Box sx={{ mt: 3.5 }}>
                        <MealRoundStrip activeIndex={roundIndex} />
                    </Box>
                </Box>

                {/* Form */}
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        bgcolor: "#fff",
                        borderTopLeftRadius: 28,
                        borderTopRightRadius: 28,
                        px: 3,
                        pt: 4,
                        pb: 3,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box component="form" onSubmit={submit} noValidate>
                        <Field
                            id={userId}
                            label="Username"
                            name="empid"
                            value={value?.empid}
                            onChange={onChange}
                            error={errors?.empidError}
                            autoComplete="username"
                        />

                        <Field
                            id={passId}
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={value?.password}
                            onChange={onChange}
                            error={errors?.passwordError}
                            autoComplete="current-password"
                            trailing={
                                <Box
                                    component="button"
                                    type="button"
                                    onClick={() => setShowPassword((shown) => !shown)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showPassword}
                                    sx={{
                                        position: "absolute", top: 2, right: 2, width: 44, height: 44,
                                        display: "grid", placeItems: "center", border: 0, bgcolor: "transparent",
                                        color: MUTED, cursor: "pointer", borderRadius: "10px",
                                        ...focusRing,
                                    }}
                                >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </Box>
                            }
                        />

                        <Box
                            component="button"
                            type="submit"
                            sx={{
                                mt: 1, width: "100%", height: 48, border: 0, borderRadius: "12px",
                                bgcolor: PLUM, color: "#fff", fontFamily: SYSTEM_FONT, fontSize: 16, fontWeight: 700,
                                cursor: "pointer",
                                transition: "background-color 0.15s ease",
                                "&:hover": { bgcolor: PLUM_DARK },
                                "&:active": { bgcolor: PLUM_DARK },
                                ...focusRing,
                            }}
                        >
                            Log in
                        </Box>
                    </Box>

                    <Box component="footer" sx={{ mt: "auto", pt: 4, fontSize: 13, lineHeight: 1.5, color: MUTED }}>
                        <Box>Where nutrition meets medical care</Box>
                        <Box>Copyright © 2026 Travancore Medicity. All rights reserved.</Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
