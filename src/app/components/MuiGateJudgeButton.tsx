import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useData } from "../providers/CanoeSlalomHeatDataProvider";

export default function MuiGateJudgeButton({ row, num, judge, isError = false, isFailure = false, isLoading = false, isLocked = false }) {
  const { setGateJudge } = useData();
  const onGateJudge = judge => {
    if ((!isLoading) && (!isLocked)) {
      setGateJudge(row, num, judge);
    }
  };
  const handleSelected = (
    event: React.MouseEvent<HTMLElement>,
    newSelected: string | null
  ) => {
    if (newSelected !== null) {
      onGateJudge(newSelected);
    }
  };
  const gateSx = {
    fontSize: "1.2rem",
    width: "50px",
    height: "50px",
    border: 1,
    borderRadius: "50%",
    borderColor: isLocked ? 'gray' : 'green',
  };
  const buttonSx = {
    width: "55px",
    height: "50px",
    fontSize: "1.2rem"
  };
  const tbColor = isLocked ? 'standard' : isLoading ? 'standard' : isFailure ? 'error' : 'primary'
  return (
    <Stack direction="row" spacing={2} >
      <Typography variant="caption" sx={gateSx} display="flex" justifyContent="center" alignItems="center">{num}</Typography>
      <ToggleButtonGroup value={judge} exclusive onChange={handleSelected} color={tbColor}>
        <ToggleButton value="0" sx={buttonSx}>0</ToggleButton>
        <ToggleButton value="2" sx={buttonSx}>2</ToggleButton>
        <ToggleButton value="50" sx={buttonSx}>50</ToggleButton>
        <ToggleButton value="DSQ" sx={buttonSx}>DSQ</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}