//@The Back End Has Change Means the Verify Token Has been Removed Please Change once Design Completed
import React, { memo } from "react";
import { Box } from "@mui/joy";
import TextComponent from "../../components/TextComponent";
import { useNavigate } from "react-router-dom";

const NursingStationList = ({ station = [] }) => {

    const navigate = useNavigate();

    const handleNursingStationClick = (code, name) => {
        navigate("/nsstaion", {
            state: {
                nsCode: code,
                nsName: name,
            },
        });
    };
    
    return (
        <Box sx={{ width: '90%' }}>
            {
                station?.map((item, index) => (
                    <Box
                        key={index}
                        onClick={() => handleNursingStationClick(
                            item?.fb_ns_code,
                            item?.fb_ns_name
                        )}
                        sx={{
                            width: '100%',
                            boxSizing: 'border-box',
                            bgcolor: '#fff',
                            borderRadius: 5,
                            boxShadow: 'md',
                            mb: 1,
                            height: 45,
                            bgcolor: "rgb(252, 248, 254)",
                            cursor: "pointer",
                            border: "1px solid rgb(177, 38, 236)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexWrap: 'wrap',
                            p: 1,
                        }}>
                        <TextComponent color={'#000000'} value={item?.fb_ns_name} size={10} weight={800} />
                    </Box>
                ))
            }
        </Box>

    );
};

export default memo(NursingStationList);