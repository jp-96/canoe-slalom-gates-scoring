import React, { useState } from "react";
import { useGates } from "../providers/GateProvider";

function GateJudge({ race, bib, gateNumber, penalty, isError = false, isLoading = false, isLocked = false }) {
    const { setPenalty } = useGates();
    const onGateJudge = newPenalty => {
        if ((!isLoading) && (!isLocked)) {
            setPenalty(race, bib, gateNumber, newPenalty);
        }
    };
    const onGateJudge0 = () => onGateJudge('0');
    const onGateJudge2 = () => onGateJudge('2');
    const onGateJudge50 = () => onGateJudge('50');
    const onGateJudgeDnf = () => onGateJudge('DNF');

    return (
        <div className='gate-penalty'>
            <span className={'gate-penalty-gate ' + (isError ? 'gate-color-error' : (isLocked ? 'gate-color-gray' : (isLoading ? 'gate-color-red' : 'gate-color-green')))}>{gateNumber}</span>
            <span className={'gate-penalty-0 ' + (penalty == '0' ? 'gate-penalty-selected' : 'gate-penalty-unselected')} onClick={onGateJudge0} >0</span>
            <span className={'gate-penalty-2 ' + (penalty == '2' ? 'gate-penalty-selected' : 'gate-penalty-unselected')} onClick={onGateJudge2} >2</span>
            <span className={'gate-penalty-50 ' + (penalty == '50' ? 'gate-penalty-selected' : 'gate-penalty-unselected')} onClick={onGateJudge50} >50</span>
            <span className={'gate-penalty-dnf ' + (penalty == 'DNF' ? 'gate-penalty-selected' : 'gate-penalty-unselected')} onClick={onGateJudgeDnf} >DNF</span>
        </div>
    );
}

export default GateJudge;