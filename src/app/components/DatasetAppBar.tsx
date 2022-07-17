import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import KayakingIcon from '@mui/icons-material/Kayaking';
import { useData } from "../providers/CanoeSlalomHeatDataProvider";

export default function DatasetAppBar() {
    const { dataset } = useData();
    return (
        <Box className='AppBar'>
            <AppBar position="static">
                <Toolbar>
                    <KayakingIcon fontSize='large' />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, }}>
                        {dataset.sheetName}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}