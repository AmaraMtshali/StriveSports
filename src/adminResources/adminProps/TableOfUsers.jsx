import { Box} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from "react";
import getUsers from '../getUsers.jsx';
import updateRole from '../updateRole.jsx';
import removeConfigMenu from '../removeConfigMenu.jsx';

let globalVar;

export default function TableOfUsers(){
    //creating the user table 
    const [rows, setRows] = useState([]);

    useEffect(() => {
        getUsers().then((data) => {
            const processedRows = data.map(element => ({
                id: element.id,
                name: element.firstName,
                lastName: element.lastName,
                email: element.emailAddresses[0].emailAddress,
                role: element.publicMetadata.role || "none",
            }));

            setRows(processedRows); //Updates state, triggering re-render
        });
    }, []);

    //Role update functionality
        const roleChange = (row) => {
            localStorage.setItem('userId', row.id);
            const configMenu = document.getElementById('configMenu');
            configMenu.style.left = '40%';
        }

    return(
        <>
        <section className='configMenu' id='configMenu'>
            <button onClick={()=>updateRole('Facility staff')} className='updateRole'>Facility staff</button>
            <button onClick={()=>updateRole('resident')} className='updateRole'>resident</button>
            <button onClick={()=>updateRole('admin')} className='updateRole'>admin</button>
            <button onClick={()=>updateRole('none')} className='updateRole'>none</button>
            <button onClick={()=>updateRole('removed')} className='updateRole'>removed</button>
            <button onClick={removeConfigMenu} className='updateRole'>complete</button>
        </section>
        
        <section className='usersTable'>
  <Box sx={{ width: "100%" }}>
    <DataGrid
      rows={rows}
      columns={[
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'lastName', headerName: 'Last Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 2 },
        {
          field: 'role',
          headerName: 'Role',
          flex: 1,
          renderCell: (params) => (
            <button
              onClick={() => roleChange(params.row)}
              style={{
                fontSize: "clamp(0.65rem, 1vw, 0.85rem)", // Responsive font size
                padding: "4px 8px",
                lineHeight: 1.2,
              }}
            >
              {params.value}
            </button>
          ),
        },
      ]}
      pageSize={5}
      rowsPerPageOptions={[5]}
      sx={{
        fontFamily: "Arial, sans-serif",
        "& .MuiDataGrid-cell": {
          fontSize: {
            xs: "0.65rem",
            sm: "0.75rem",
            md: "0.85rem",
            lg: "1rem",
          },
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        "& .MuiDataGrid-columnHeaders": {
          fontSize: {
            xs: "0.7rem",
            sm: "0.8rem",
            md: "0.9rem",
            lg: "1rem",
          },
        },
        "& .MuiDataGrid-root": {
          width: "100%",
        },
      }}
    />
  </Box>
</section>

        </>
    )

}