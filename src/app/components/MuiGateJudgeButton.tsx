import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useData } from "../providers/CanoeSlalomHeatDataProvider";

function GateNumber({ num, isDownStream = true, isLocked = false }) {
    const gateSx = {
        fontSize: "1.2rem",
        width: "50px",
        height: "50px",
        border: 1,
        borderRadius: "50%",
        borderColor: isLocked ? 'gray' : isDownStream ? 'green' : 'red',
    };
    return (
        <Typography variant="caption" sx={gateSx} display="flex" justifyContent="center" alignItems="center">{num}</Typography>
    );
}

function JudgeToggleButton({ judge, isError = false, isFailure = false, isLoading = false, isLocked = false, onSelectedJudge = f => f }) {
    const buttonSx = {
        width: "55px",
        height: "50px",
        fontSize: "1.2rem"
    };
    const handleSelected = (
        event: React.MouseEvent<HTMLElement>,
        newSelected: string | null
    ) => {
        if (newSelected !== null) {
            onSelectedJudge(newSelected);
        }
    };
    const tbColor = isLocked ? 'standard' : isLoading ? 'standard' : (isFailure || isError) ? 'error' : 'primary'
    return (
        <ToggleButtonGroup value={judge} exclusive onChange={handleSelected} color={tbColor}>
            <ToggleButton value="0" sx={buttonSx}>0</ToggleButton>
            <ToggleButton value="2" sx={buttonSx}>2</ToggleButton>
            <ToggleButton value="50" sx={buttonSx}>50</ToggleButton>
            <ToggleButton value="DSQ" sx={buttonSx}>DSQ</ToggleButton>
        </ToggleButtonGroup>
    );
}

export default function MuiGateJudgeButton({ row, num, judge, isDownStream = true, isError = false, isFailure = false, isLoading = false, isLocked = false }) {
    const { setGateJudge } = useData();
    const onSelectedJudge = judge => {
        if ((!isLoading) && (!isLocked)) {
            setGateJudge(row, num, judge);
        }
    };

    return (
        <Stack direction="row" spacing={2} >
            <GateNumber num={num} isDownStream={isDownStream} isLocked={isLocked} />
            <JudgeToggleButton judge={judge} isError={isError} isFailure={isFailure} isLoading={isLoading} isLocked={isLocked} onSelectedJudge={onSelectedJudge} />
        </Stack>
    );
}