import { Box} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from "react";
import { useUser } from '@clerk/clerk-react';
import getReports from '../getReports.jsx';
export default function FacilityReports() {

    //Loading the bookings
     const { user } = useUser(); 

     //creating the report table 
    const [rows2, setRows2] = useState([]);

    useEffect(() => {
        getReports().then((data) => {
            const processedRows = data.map(element => ({
                id: element._id,
                facility: element.facility,
                issue: element.issue,
                residentInfo: element.residentInfo,
                status: element.status,
                __v: element.__v,
                message: element.message || "No message provided",
            }));
            console.log(processedRows);

            setRows2(processedRows); //Updates state, triggering re-render
        });
    }, []);

    return (
        <section className='usersTable'>
                <Box>
                    <DataGrid
                        rows={rows2}
                        columns={[
                            { field: 'facility', headerName: 'facility', flex: 1 },
                            { field: 'issue', headerName: 'issue', flex: 4 },
                            { field: 'message', headerName: 'message', flex: 2 },
                            { field: 'status', headerName: 'status', flex: 1,},
                        ]}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        sx={{
                            "& .MuiDataGrid-root": { fontFamily: "Arial, sans-serif" },
                            "& .MuiDataGrid-cell": { fontSize:"large" },
                        }}
                    
                        
                    />
                </Box>
        </section>
    )
}