import { Box, Drawer } from "@mui/joy";
import React, { memo, useState, useCallback, useMemo } from "react";
import EmployeeInfo from "./EmployeeInfo";
import LiveClock from "./LiveClock";
import { useNavigate } from "react-router-dom";
import { axioslogin } from "../Axios/axios";
import { getLoggedEmpDetail } from "../CommonData/CommonFun";
import { EmpauthId, succesNofity } from "../Views/Constant/Constant";
import { useQuery } from "@tanstack/react-query";
import { COLORS, FONT, focusRing } from "../Style/designTokens";

// height of the sticky header; the fixed search bar sits right under it (SearchComponent)
export const HEADER_HEIGHT = 56;

const LoginEmployeeHeader = () => {

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const id = EmpauthId()
    const { data: getlogempdetail } = useQuery({
        queryKey: ['loggedempdetail', id],
        queryFn: () => getLoggedEmpDetail(id),
        enabled: !!id,
        staleTime: Infinity,
    });


    const toggleDrawer = useCallback(() => {
        setOpen(prev => !prev);
    }, []);

    const { desg_name, em_name } = useMemo(() => {
        const detail = getlogempdetail?.[0] || {};
        return {
            desg_name: detail.desg_name,
            em_name: detail.em_name,
        };
    }, [getlogempdetail]);


    const handleLogout = useCallback(async () => {
        const stored = localStorage.getItem("app_auth");

        try {
            const userId = stored ? atob(JSON.parse(stored)?.authNo) : null;
            if (userId) {
                await axioslogin.get(`/user/logout/${userId}`);
            }
        } catch (error) {
            // the server could not be reached: the phone is still logged out below
        }

        localStorage.removeItem("app_auth");
        succesNofity("You have been logged out");
        setTimeout(() => navigate('/'), 600);
    }, [navigate])


    return (
        <>
            <Box
                component="header"
                sx={{
                    width: "100%",
                    height: HEADER_HEIGHT,
                    boxSizing: "border-box",
                    px: 2,
                    bgcolor: COLORS.white,
                    borderBottom: `1px solid ${COLORS.line}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                }}
            >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <EmployeeInfo
                        name={em_name}
                        designation={desg_name}
                        onAvatarClick={toggleDrawer}
                    />
                </Box>

                <LiveClock />
            </Box>

            <Drawer anchor="right" open={open} onClose={toggleDrawer} size="sm">
                <Box
                    sx={{
                        height: "100%",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        bgcolor: COLORS.wash,
                        fontFamily: FONT,
                        px: 3,
                        pt: 5,
                        pb: "calc(24px + env(safe-area-inset-bottom))",
                    }}
                >
                    <Box>
                        <Box
                            aria-hidden="true"
                            sx={{
                                width: 64, height: 64, borderRadius: "50%", bgcolor: COLORS.plum, color: COLORS.white,
                                display: "grid", placeItems: "center", fontSize: 26, fontWeight: 700,
                            }}
                        >
                            {em_name ? em_name.charAt(0).toUpperCase() : "?"}
                        </Box>
                        <Box sx={{ mt: 2, fontSize: 20, fontWeight: 700, color: COLORS.ink, lineHeight: 1.25 }}>
                            {em_name}
                        </Box>
                        <Box sx={{ mt: 0.5, fontSize: 15, color: COLORS.muted }}>
                            {desg_name}
                        </Box>
                    </Box>

                    <Box
                        component="button"
                        type="button"
                        onClick={handleLogout}
                        sx={{
                            width: "100%", height: 48, border: 0, borderRadius: "12px", cursor: "pointer",
                            bgcolor: COLORS.plum, color: COLORS.white, fontFamily: FONT, fontSize: 16, fontWeight: 700,
                            "&:hover, &:active": { bgcolor: COLORS.plumDark },
                            ...focusRing,
                        }}
                    >
                        Log out
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};

export default memo(LoginEmployeeHeader);
