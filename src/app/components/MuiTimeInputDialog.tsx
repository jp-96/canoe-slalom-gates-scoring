import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import NumberFormat from "react-number-format";
import { formControlLabelClasses } from "@mui/material";

export type TimeJudgeData = {
    hh: number;
    mm: number;
    ss: number;
    judge: string;
};

type TimeJudgeDialogProps = {
    open: boolean;
    bib: string;
    tag: string;
    startOrFinish: string;
    timeJudgeData: TimeJudgeData;
    onCancel: () => void;
    onApply: (newValue: TimeJudgeData) => void;
};

function JudgeButton({
    startOrFinish,
    judge,
    isError = false,
    isFailure = false,
    isLoading = false,
    isLocked = false,
    onSelected = (f) => f
}) {
    const onSelectedStarted = () => onSelected("STARTED");
    const onSelectedDns = () => onSelected("DNS");
    const onSelectedFinished = () => onSelected("FINISHED");
    const onSelectedFinished50 = () => onSelected("FINISHED_50");
    const onSelectedDnf = () => onSelected("DNF");
    const onSelectedDsq = () => onSelected("DSQ");

    const color = isLoading
        ? "secondary"
        : isFailure
            ? "warning"
            : isError
                ? "error"
                : "primary";
    const sx = {
        width: "64px",
        height: "42px",
        fontSize: "1.2rem"
    };
    const sxLeft = {
        ...sx,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    };
    const sxMiddle = {
        ...sx,
        borderRadius: 0
    };
    const sxRight = {
        ...sx,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    };

    const StartedButton = () => (
        <Button
            variant={judge === "STARTED" ? "contained" : "outlined"}
            disabled={isLocked}
            color={color}
            sx={{ ...sxLeft, width: "127px" }}
            onClick={onSelectedStarted}
        >
            ENT
        </Button>
    );
    const FinishedButton = () => (
        <Button
            variant={judge === "FINISHED" ? "contained" : "outlined"}
            disabled={isLocked}
            color={color}
            sx={sxLeft}
            onClick={onSelectedFinished}
        >
            ENT
        </Button>
    );
    const Finished50Button = () => (
        <Button
            variant={judge === "FINISHED_50" ? "contained" : "outlined"}
            disabled={isLocked}
            color={color}
            sx={sxMiddle}
            onClick={onSelectedFinished50}
        >
            +50
        </Button>
    );
    const DnsButton = () => (
        <Button
            variant={judge === "DNS" ? "contained" : "outlined"}
            disabled={isLocked}
            color={color}
            sx={sxMiddle}
            onClick={onSelectedDns}
        >
            DNS
        </Button>
    );
    const DnfButton = () => (
        <Button
            variant={judge === "DNF" ? "contained" : "outlined"}
            disabled={isLocked}
            color={color}
            sx={sxMiddle}
            onClick={onSelectedDnf}
        >
            DNF
        </Button>
    );
    const DsqButton = () => (
        <Button
            variant={judge === "DSQ" ? "contained" : "outlined"}
            disabled={isLocked}
            color={color}
            sx={sxRight}
            onClick={onSelectedDsq}
        >
            DSQ
        </Button>
    );

    return (
        <Stack spacing={"-1px"} direction="row" sx={{ m: "0px" }}>
            {startOrFinish === "START" ? (
                <StartedButton />
            ) : (
                <>
                    <FinishedButton />
                    <Finished50Button />
                </>
            )}
            {startOrFinish === "START" ? (
                <>
                    <DnsButton />
                    <DsqButton />
                </>
            ) : (
                <>
                    <DnfButton />
                    <DsqButton />
                </>
            )}
        </Stack>
    );
}

function TimeCaption() {
    const sx = {
        fontSize: "1rem",
        width: "55px",
        height: "65px",
        lineHeight: "74px",
        userSelect: "none",
    };
    return (
        <Typography variant="caption" sx={sx}>
            Time:
        </Typography>
    );
}

const isAllowed100 = (values) => {
    const numValue = Number(values.value)
    if (isNaN(numValue)) return true
    return (numValue >= 0) && (numValue < 100)
}

const isAllowed60 = (values) => {
    const numValue = Number(values.value)
    if (isNaN(numValue)) return true
    return (numValue >= 0) && (numValue < 60)
}

const TimeHhFormat = (props: any) => {
    return (
        <NumberFormat
            decimalScale={0}
            allowNegative={false}
            isAllowed={isAllowed100}
            {...props}
        />
    );
};

const TimeMmFormat = (props: any) => {
    return (
        <NumberFormat
            decimalScale={0}
            allowNegative={false}
            isAllowed={isAllowed60}
            {...props}
        />
    );
};

const TimeSsFormat = (props: any) => {
    return (
        <NumberFormat
            decimalScale={3}
            fixedDecimalScale={true}
            allowNegative={false}
            isAllowed={isAllowed60}
            {...props}
        />
    );
};

export default function TimeJudgeDialog(props: TimeJudgeDialogProps) {
    let defaultHh: number | undefined = undefined;
    let defaultMm: number | undefined = undefined;
    let defaultSs: number | undefined = undefined;
    const defaultJudge = props.timeJudgeData.judge;
    if (props.timeJudgeData.hh > 0) {
        defaultHh = props.timeJudgeData.hh;
    }
    if ((props.timeJudgeData.hh > 0) || (props.timeJudgeData.mm > 0)) {
        defaultMm = props.timeJudgeData.mm;
    }
    if ((props.timeJudgeData.hh > 0) || (props.timeJudgeData.mm > 0) || (props.timeJudgeData.ss > 0)) {
        defaultSs = props.timeJudgeData.ss;
    }
    const [hh, setHh] = React.useState<number | undefined>(defaultHh);
    const [mm, setMm] = React.useState<number | undefined>(defaultMm);
    const [ss, setSs] = React.useState<number | undefined>(defaultSs);
    const [judge, setJudge] = React.useState(defaultJudge);

    const resetData = () => {
        setHh(defaultHh);
        setMm(defaultMm);
        setSs(defaultSs);
        setJudge(defaultJudge);
    };

    React.useEffect(() => {
        resetData();
    }, [props.open]);

    const onFocus = (e: any) => {
        e.target.select();
    }

    const onChangeHh = (e: any) => {
        setHh(e.target.value);
    };

    const onChangeMm = (e: any) => {
        setMm(e.target.value)
    };

    const onChangeSs = (e: any) => {
        setSs(e.target.value);
    };

    const onSelectedJudge = (judge: string) => {
        setJudge(judge);
    };

    const onClose = () => {
        resetData();
        props.onCancel();
    };

    const onApply = () => {
        const timeJudgeData: TimeJudgeData = {
            hh: hh ? Number(hh) : 0,
            mm: mm ? Number(mm) : 0,
            ss: ss ? Number(ss) : 0,
            judge
        };

        if (timeJudgeData.hh > 0) {
            setHh(timeJudgeData.hh);
        } else {
            setHh(undefined);
        }
        if ((timeJudgeData.hh > 0) || (timeJudgeData.mm > 0)) {
            setMm(timeJudgeData.mm);
        } else {
            setMm(undefined);
        }
        if ((timeJudgeData.hh > 0) || (timeJudgeData.mm > 0) || (timeJudgeData.ss > 0)) {
            setSs(timeJudgeData.ss);
        } else {
            setSs(undefined);
        }

        props.onApply(timeJudgeData);
    };

    const timeSx = {
        width: "40px",
        input: {
            height: "40px",
            textAlign: "right",
            fontSize: "1.6rem"
        }
    };
    const timeSsSx = {
        ...timeSx,
        width: "90px"
    };
    return (
        <Dialog open={props.open} onClose={onClose}>
            <DialogTitle>
                [{props.bib}] {props.startOrFinish}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={1} direction="column">
                    <Stack spacing={1} direction="row">
                        <TimeCaption />
                        <TextField
                            value={hh}
                            onChange={onChangeHh}
                            label="hh"
                            variant="standard"
                            InputLabelProps={{ shrink: true }}
                            sx={timeSx}
                            InputProps={{
                                inputComponent: TimeHhFormat
                            }}
                            onFocus={onFocus}
                        />
                        <TextField
                            value={mm}
                            onChange={onChangeMm}
                            label="mm"
                            variant="standard"
                            InputLabelProps={{ shrink: true }}
                            sx={timeSx}
                            InputProps={{
                                inputComponent: TimeMmFormat
                            }}
                            onFocus={onFocus}
                        />
                        <TextField
                            value={ss}
                            onChange={onChangeSs}
                            label="ss.SS"
                            variant="standard"
                            InputLabelProps={{ shrink: true }}
                            sx={timeSsSx}
                            InputProps={{
                                inputComponent: TimeSsFormat
                            }}
                            onFocus={onFocus}
                        />
                    </Stack>
                    <JudgeButton
                        startOrFinish={props.startOrFinish}
                        judge={judge}
                        onSelected={onSelectedJudge}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onApply}>OK</Button>
            </DialogActions>
        </Dialog>
    );
}
