import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import { grey, green, red, blue, } from '@mui/material/colors';
import { useData } from "../providers/CanoeSlalomHeatDataProvider";

function TimeLabel({ startOrFinish, isLocked = false }) {
    const sx = {
        fontSize: '1.3rem',
        width: '40px',
        height: '40px',
        lineHeight: '40px',
        border: 1,
        borderRadius: '3px',
        borderColor: isLocked ? grey[200] : blue[500],
        color: isLocked ? grey[400] : blue[700],
        userSelect: 'none',
    };
    const caption = startOrFinish === 'START' ? 'ST' : 'GL'
    return (
        <Typography variant="caption" sx={sx} align="center">
            {caption}
        </Typography>
    );
}

function TimeInput({ seconds, isError = false, isFailure = false, isLoading = false, isLocked = false, onChanged = f => f }) {
    const color = isLoading ? 'secondary' : isFailure ? 'warning' : isError ? 'error' : 'primary';

    return (
        <Stack direction="row" spacing={1} >
            <p>
                {seconds}
            </p>
        </Stack>
    );
}

function JudgeButton({ startOrFinish, judge, isError = false, isFailure = false, isLoading = false, isLocked = false, onSelected = f => f }) {
    const onSelectedStarted = () => onSelected('STARTED');
    const onSelectedDns = () => onSelected('DNS');
    const onSelectedFinished = () => onSelected('FINISHED');
    const onSelectedDnf = () => onSelected('DNF');
    
    const color = isLoading ? 'secondary' : isFailure ? 'warning' : isError ? 'error' : 'primary'
    const sx = {
        width: "44px",
        height: "40px",
        fontSize: "1.2rem",
    };
    const sxLeft = {
        ...sx,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    };
    const sxMiddle = {
        ...sx,
        borderRadius: 0,
    };
    const sxRight = {
        ...sx,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    };

    const StartedButton = () => (
        <Button variant={judge === 'STARTED' ? 'contained' : 'outlined'} disabled={isLocked} color={color} sx={sxLeft} onClick={onSelectedStarted}>Ent</Button>
    );
    const FinishedButton = () => (
        <Button variant={judge === 'FINISHED' ? 'contained' : 'outlined'} disabled={isLocked} color={color} sx={sxLeft} onClick={onSelectedFinished}>Ent</Button>
    );
    const DnsButton = () => (
        <Button variant={judge === 'DNS' ? 'contained' : 'outlined'} disabled={isLocked} color={color} sx={sxRight} onClick={onSelectedDns}>DnS</Button>
    );
    const DnfButton = () => (
        <Button variant={judge === 'DNF' ? 'contained' : 'outlined'} disabled={isLocked} color={color} sx={sxRight} onClick={onSelectedDnf}>DnF</Button>
    );

    return (
        <Stack spacing={'-1px'} direction="row">
            {startOrFinish === 'START' ? (<StartedButton />) : (<FinishedButton />)}
            {startOrFinish === 'START' ? (<DnsButton />) : (<DnfButton />)}
        </Stack>
    );
}

export default function MuiTimeInput({ row, startOrFinish, seconds, judge, isError = false, isFailure = false, isLoading = false, isLocked = false }) {
    const { setStartedTime, setFinishedTime } = useData();
    const onChangeTimeJudge = (seconds, judge) => {
        if ((!isLoading) && (!isLocked)) {
            if (startOrFinish === 'START') {
                setStartedTime(row, seconds, judge);
            } else {
                setFinishedTime(row, seconds, judge);
            }
        }
    };
    const onChangedTime = (seconds) => {
        onChangeTimeJudge(seconds, judge);
    }
    const onSelectedJudge = (judge) => {
        onChangeTimeJudge(seconds, judge);
    }

    return (
        <Stack direction="row" spacing={1} >
            <TimeLabel startOrFinish={startOrFinish} isLocked={isLocked} />
            <TimeInput seconds={seconds} isError={isError} isFailure={isFailure} isLoading={isLoading} isLocked={isLocked} onChanged={onChangedTime} />
            <JudgeButton startOrFinish={startOrFinish} judge={judge} isError={isError} isFailure={isFailure} isLoading={isLoading} isLocked={isLocked} onSelected={onSelectedJudge} />
        </Stack>
    );
}