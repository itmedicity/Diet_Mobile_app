import React, { memo } from "react";
import { Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import TextComponent from "../../components/TextComponent";


const DeliveryPatientCardList = ({ filterdData = [] }) => {
    

    const navigate = useNavigate();

    const handlebedDetail = (item) => {
        navigate("/deliverydetail", {
            state: {
                patientData: item
            },
        });
    }; 

 

    return (
        <Box sx={{ width: '90%' }}>
            {
                filterdData?.map((item, index) => (
                    <Box
                        key={index}
                        onClick={() => handlebedDetail(item)}
                        sx={{
                            width: '100%',
                            boxSizing: 'border-box',
                            bgcolor: '#fcfcfc',
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
                        }}>

                        <Box sx={{ width: '40%', display: 'flex', alignItems: 'start', gap: 1 }}>
                            <Box sx={{ width: '100%' }}>
                                <TextComponent color={'#000000'} value={item?.room_no} size={13} weight={800} />
                                <TextComponent color={'#666363'} value={item?.nurse_station_name} size={8} weight={600} />

                            </Box>

                        </Box>
                        <Box sx={{
                            width: '40%',
                            display: 'flex',
                            // alignItems: 'center',
                            py: 1,
                            flexDirection: 'column',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            <TextComponent color={'#000000'} value={item?.patient_name} size={10} weight={600} />
                            <TextComponent color={'#727070'} value={item?.mrd_no} size={10} weight={400} />
                        </Box>

                        <Box sx={{
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
                        </Box>
                    </Box>
                ))
            }
        </Box>
    );
};

export default memo(DeliveryPatientCardList);