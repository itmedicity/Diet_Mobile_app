import React, { memo } from "react";
import { Box } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import { COLORS, FONT, focusRing } from "../Style/designTokens";

export const NAV_HEIGHT = 64;

// The four places staff move between during a round
const TABS = [
    { path: "/dashboard", label: "Home", icon: HomeRoundedIcon },
    { path: "/Home", label: "Orders", icon: RestaurantMenuRoundedIcon },
    { path: "/delivery", label: "Deliveries", icon: LocalShippingRoundedIcon },
    { path: "/cash-collection", label: "Cash", icon: PaymentsRoundedIcon },
];

// The bar is only shown on these top-level pages (detail pages have their own back arrow)
export const NAV_PATHS = TABS.map((tab) => tab.path);

const BottomNav = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    if (!NAV_PATHS.includes(pathname)) return null;

    return (
        <Box
            component="nav"
            aria-label="Main"
            sx={{
                position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1550,
                bgcolor: COLORS.white, borderTop: `1px solid ${COLORS.line}`,
                pb: "env(safe-area-inset-bottom)", fontFamily: FONT,
            }}
        >
            <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, height: NAV_HEIGHT, maxWidth: 560, mx: "auto", display: "flex" }}>
                {TABS.map(({ path, label, icon: Icon }) => {
                    const active = pathname === path;
                    return (
                        <Box component="li" key={path} sx={{ flex: 1 }}>
                            <Box
                                component="button"
                                type="button"
                                aria-current={active ? "page" : undefined}
                                onClick={() => { if (!active) navigate(path); }}
                                sx={{
                                    width: "100%", height: "100%", border: 0, bgcolor: "transparent", cursor: "pointer",
                                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0.25,
                                    fontFamily: FONT, fontSize: 13, fontWeight: active ? 700 : 500,
                                    color: active ? COLORS.plum : COLORS.muted, ...focusRing,
                                }}
                            >
                                <Box
                                    aria-hidden="true"
                                    sx={{
                                        width: 56, height: 30, borderRadius: "15px", display: "grid", placeItems: "center",
                                        bgcolor: active ? COLORS.wash : "transparent",
                                    }}
                                >
                                    <Icon sx={{ fontSize: 24 }} />
                                </Box>
                                {label}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default memo(BottomNav);
