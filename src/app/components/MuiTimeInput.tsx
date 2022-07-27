import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NumberFormat from "react-number-format";
import { grey, green, red, blue, } from '@mui/material/colors';
import { useData } from "../providers/CanoeSlalomHeatDataProvider";
import CanoeSlalomHeatData from '../../dao/CanoeSlalomHeatData';

function TimeLabel({ startOrFinish, isLocked = false }) {
    const sx = {
        fontSize: '1.3rem',
        width: '42px',
        height: '42px',
        lineHeight: '42px',
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

    const hms = CanoeSlalomHeatData.secondsToHms(seconds);
    const hmsValue = (hms.hours * 100 + hms.minutes) * 100 + hms.seconds;

    return (
        <Stack direction="row" spacing={'-1px'} sx={{ m: '0px', }}>
            <NumberFormat
                className="hours"
                value={hms.hours}
            />
            <NumberFormat
                className="minutes"
                value={hms.minutes}
            />
            <NumberFormat
                className="seconds"
                value={hms.seconds}
                decimalScale={3}
                fixedDecimalScale={true}
            />
        </Stack>
    );
}

function JudgeButton({ startOrFinish, judge, isError = false, isFailure = false, isLoading = false, isLocked = false, onSelected = f => f }) {
    const onSelectedStarted = () => onSelected('STARTED');
    const onSelectedDns = () => onSelected('DNS');
    const onSelectedFinished = () => onSelected('FINISHED');
    const onSelectedFinished50 = () => onSelected('FINISHED_50');
    const onSelectedDnf = () => onSelected('DNF');
    const onSelectedDsq = () => onSelected('DSQ');

    const color = isLoading ? 'secondary' : isFailure ? 'warning' : isError ? 'error' : 'primary'
    const sx = {
        width: '64px',
        height: '42px',
        fontSize: '1.2rem',
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
        <Button variant={judge === 'STARTED' ? 'contained' : 'outlined'} disabled={isLocked} color={color} sx={{ ...sxLeft, width: '127px', }} onClick={onSelectedStarted}>ENT</Button>
    );
    const FinishedButton = () => (
        <Button variant={judge === 'FINISHED' ? 'contained' : 'outlined'} disabled={isLocked} color={color} sx={sxLeft} onClick={onSelectedFinished}>ENT</Button>
    );
    const Finished50Button = () => (
        <Button variant={judge === 'FINISHED_50' ? 'contained' : 'outlined'} disabled={isLocked} color={color} sx={sxMiddle} onClick={onSelectedFinished50}>+50</Button>
    );
    const DnsButton = () => (
        <Button variant={judge === 'DNS' ? 'contained' : 'outlined'} disabled={isLocked} color={color} sx={sxMiddle} onClick={onSelectedDns}>DNS</Button>
    );
    const DnfButton = () => (
        <Button variant={judge === 'DNF' ? 'contained' : 'outlined'} disabled={isLocked} color={color} sx={sxMiddle} onClick={onSelectedDnf}>DNF</Button>
    );
    const DsqButton = () => (
        <Button variant={judge === 'DSQ' ? 'contained' : 'outlined'} disabled={isLocked} color={color} sx={sxRight} onClick={onSelectedDsq}>DSQ</Button>
    );

    return (
        <Stack spacing={'-1px'} direction="row" sx={{ m: '0px' }}>
            {startOrFinish === 'START' ? (<StartedButton />) : (<><FinishedButton /><Finished50Button /></>)}
            {startOrFinish === 'START' ? (<><DnsButton /><DsqButton /></>) : (<><DnfButton /><DsqButton /></>)}
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
        <Stack direction="row" spacing={1} sx={{ m: '0px' }}>
            <TimeLabel startOrFinish={startOrFinish} isLocked={isLocked} />
            <Stack direction="column" spacing={1} sx={{ m: '0px' }}>
                <TimeInput seconds={seconds} isError={isError} isFailure={isFailure} isLoading={isLoading} isLocked={isLocked} onChanged={onChangedTime} />
                <JudgeButton startOrFinish={startOrFinish} judge={judge} isError={isError} isFailure={isFailure} isLoading={isLoading} isLocked={isLocked} onSelected={onSelectedJudge} />
            </Stack>
        </Stack>
    );
}