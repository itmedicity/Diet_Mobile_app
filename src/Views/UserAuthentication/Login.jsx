import { Box } from "@mui/joy";
import React from "react";
// import logo from "../../assets/images/logo.png";
import LabelComponent from "../../components/LabelComponent";
import CustomInput from "../../components/CustomInput";
import LoginButton from "../../components/LoginButton";
import CopyRight from "../../components/CopyRight";
import TextComponent from "../../components/TextComponent";

const Login = ({
    handlelogin,
    onChange,
    value,
    errors
}) => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                // bgcolor: 'red'
            }}>

            <Box
                sx={{
                    height: "45vh",
                    width: "100%",
                    bgcolor: "#e5bbff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                }}>
                <Box
                    sx={{
                        width: { xs: "40%", sm: "30%", md: "15%", lg: "10%" },
                        height: { xs: "45%", sm: "40%", md: "35%", lg: "30%" },
                        bgcolor: "#be55ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: '50%',
                        flexDirection: 'column',
                        p: 1
                    }}>
                    <TextComponent color={'#ffffff'} value={"TMC"} size={36} weight={900} />
                    <TextComponent color={'#000000'} value={"Where nutrition meets medical care"} size={8} weight={800} />
                    <TextComponent color={'#fafafa'} value={"ensuring every meal supports  "} size={8} weight={800} />
                    <TextComponent color={'#000000'} value={"healing faster recovery."} size={8} weight={800} />
                </Box>
            </Box>

            {/* Bottom Section */}
            <Box
                sx={{
                    flex: 1,
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                }}>
                {/* White Card */}
                <Box
                    sx={{
                        bgcolor: "#ffffff",
                        width: '100%',
                        borderTopLeftRadius: 50,
                        borderTopRightRadius: 50,
                        boxShadow: "0px -10px 30px rgba(251, 240, 240, 0.25)",
                        mt: -5, // overlap effect
                        borderTop: "3px solid #e7e5e5",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                    <Box sx={{
                        width: '100%',
                        p: 3,
                    }}>
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            textAlign: 'start'
                        }}>.
                            <TextComponent color={'#000000'} value={"Login Here !"} size={32} weight={800} />
                            <TextComponent color={'#9a9a9a'} value={"Please login to your account to continue..."} size={8} />
                        </Box>
                        <form>
                            <LabelComponent name="Username" mandatory={true} />
                            <CustomInput
                                placeholder="Enter your username"
                                onChange={onChange}
                                error={!!errors?.empidError}
                                helperText={errors?.empidError}
                                value={value?.empid}
                                name={"empid"}
                            />
                            <LabelComponent name="Password" mandatory={true} />
                            <CustomInput
                                placeholder="Enter your password"
                                type="password"
                                onChange={onChange}
                                error={!!errors?.passwordError}
                                helperText={errors?.passwordError}
                                value={value?.password}
                                name={"password"}
                            />
                            <LoginButton onClick={handlelogin} />
                        </form>
                    </Box>


                </Box>
            </Box>
            <CopyRight />
        </Box>
    );
};

export default Login;
