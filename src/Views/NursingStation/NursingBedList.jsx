//@The Back End Has Change Means the Verify Token Has been Removed Please Change once Design Completed
import React, { memo } from "react";
import { Box, Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import TextComponent from "../../components/TextComponent";
import BedIcon from '@mui/icons-material/Bed';
import PersonIcon from '@mui/icons-material/Person';

const NursingBedList = ({ beds = [], stationname, Refech }) => {

    const navigate = useNavigate();

    const handlebedDetail = (code, name, templateId,item) => {
        navigate("/bedId", {
            state: {
                BedCode: code,
                BedName: name,
                stationname: stationname,
                template_id: templateId,
                fullDetail:item
            },
        });
    };

    // Empty State UI
    if (!beds || beds?.length === 0) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "60vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    color: "#6b6b6b",
                }}
            >
                <BedIcon sx={{ fontSize: 50, color: "#c165d1" }} />

                <TextComponent
                    value={"No Data Found"}
                    size={16}
                    weight={700}
                    color={"#4a148c"}
                />

                <TextComponent
                    value={"No patients or diet plans available"}
                    size={12}
                    weight={400}
                    color={"#7b7b7b"}
                />

                <Button
                    size="sm"
                    variant="soft"
                    onClick={() => Refech()}
                >
                    Refresh
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '90%' }}>
            {
                beds?.map((item, index) => (
                    <Box
                        key={index}
                        onClick={() => 
                            handlebedDetail(item?.bd_code, item?.fb_bdc_no, item?.template_id,item)}
                        sx={{
                            width: '100%',
                            boxSizing: 'border-box',
                            borderRadius: 5,
                            boxShadow: 'md',
                            mb: 1,
                            height: 50,
                            bgcolor: "rgb(252, 248, 254)",
                            cursor: "pointer",
                            border: "1px solid rgb(177, 38, 236)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: 'space-between',
                            p: 1,
                        }}
                    >

                        <Box sx={{ width: '50%', display: 'flex', alignItems: 'start', gap: 1 }}>
                            <PersonIcon sx={{ color: '#9b9999', fontSize: 17 }} />
                            <Box sx={{ width: '100%' }}>
                                <TextComponent
                                    noWrap
                                    color={'#000000'}
                                    value={item?.ptc_ptname}
                                    size={14}
                                    weight={600}
                                />
                                <TextComponent
                                    color={'#727070'}
                                    value={item?.ip_no}
                                    size={10}
                                    weight={400}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ width: '30%', display: 'flex', alignItems: 'center', py: 1 }}>
                            <BedIcon sx={{ fontSize: 16, color: '#726d74' }} />
                            <TextComponent
                                color={'#000000'}
                                value={item?.fb_bdc_no}
                                size={13}
                                weight={800}
                            />
                        </Box>

                        {/* <Box sx={{
                            width: 100,
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #9d25b8',
                            borderRadius: 10,
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}>
                            <TextComponent
                                noWrap
                                color={'#000000'}
                                value={item?.diet_name}
                                size={9}
                                weight={800}
                            />
                        </Box> */}
                    </Box>
                ))
            }
        </Box>
    );
};

export default memo(NursingBedList);