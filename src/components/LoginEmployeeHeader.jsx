import { Box, Drawer, Typography, Button } from "@mui/joy";
import React, { memo, useState, useCallback, useMemo } from "react";
import EmployeeInfo from "./EmployeeInfo";
import LiveClock from "./LiveClock";
import { useNavigate } from "react-router-dom";
import { axioslogin } from "../Axios/axios";
import { toast } from 'react-toastify';
import { getLoggedEmpDetail } from "../CommonData/CommonFun";
import { EmpauthId } from "../Views/Constant/Constant";
import { useQuery } from "@tanstack/react-query";

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
        const userSlno = localStorage.getItem("app_auth");

        if (userSlno) {
            const userId = atob(JSON.parse(userSlno)?.authNo);
            if (userId) {
                const res = await axioslogin.get(`/user/logout/${userId}`);
                if (res) {
                    localStorage.removeItem("app_auth");
                    toast.success(
                        <div className='flex h-20 flex-col'>You have been successfully logged out</div>,
                        {
                            position: "top-center", // Centers toast horizontally at the top
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        }
                    );
                    setTimeout(() => {
                        navigate('/')
                    }, 1000); // Wait 3 seconds before redirecting
                }
            }
        }
    }, [navigate])


    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    height: 50,
                    bgcolor: "white",
                    boxShadow: "sm",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: 'space-around',
                    gap: 3,
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                }}
            >
                <Box sx={{ width: '40%' }}>
                    <EmployeeInfo
                        name={em_name}
                        designation={desg_name}
                        onAvatarClick={toggleDrawer} //  CLICK HERE
                    />
                </Box>

                <Box sx={{ width: '40%' }}>
                    <LiveClock />
                </Box>
            </Box>

            {/*  DRAWER */}
            <Drawer
                anchor="right"
                open={open}
                onClose={toggleDrawer}
                size="sm"
            >
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        background: "linear-gradient(180deg, #e5bbff 0%, #f9f4ff 100%)"
                    }}
                >

                    {/* PROFILE SECTION */}
                    <Box
                        sx={{
                            px: 3,
                            pt: 4,
                            pb: 3,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            position: "relative"
                        }}
                    >
                        {/* Glow Effect */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: 20,
                                width: 120,
                                height: 120,
                                borderRadius: "50%",
                                background: "rgba(190,85,255,0.25)",
                                filter: "blur(40px)",
                                zIndex: 0
                            }}
                        />

                        {/* Avatar */}
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                background: "#be55ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 26,
                                fontWeight: 700,
                                zIndex: 1,
                                boxShadow: "0 10px 30px rgba(190,85,255,0.5)"
                            }}
                        >
                            {em_name ? em_name.charAt(0) : "E"}
                        </Box>

                        {/* Name */}
                        <Typography
                            sx={{
                                mt: 2,
                                fontWeight: 700,
                                fontSize: 18
                            }}
                        >
                            {em_name || "Employee Name"}
                        </Typography>

                        {/* Role */}
                        <Typography
                            sx={{
                                fontSize: 13,
                                color: "#6b7280"
                            }}
                        >
                            {desg_name || "Designation"}
                        </Typography>
                    </Box>


                    {/* LOGOUT */}
                    <Box sx={{ px: 2, pb: 2 }}>
                        <Button
                            fullWidth
                            onClick={handleLogout}
                            sx={{
                                py: 1.3,
                                fontWeight: 700,
                                borderRadius: 14,
                                background: "linear-gradient(135deg, #be55ff, #9333ea)",
                                color: "#fff",
                                boxShadow: "0 8px 20px rgba(190,85,255,0.4)",
                                transition: "all 0.25s ease",
                                '&:hover': {
                                    background: "linear-gradient(135deg, #a93df0, #7e22ce)",
                                    transform: "translateY(-2px)"
                                }
                            }}
                        >
                            Logout
                        </Button>
                    </Box>

                </Box>
            </Drawer>



        </>
    );
};

export default memo(LoginEmployeeHeader);