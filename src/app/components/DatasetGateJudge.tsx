import React, { useState } from "react";
import { useGates } from "../providers/GateProvider";

function DatasetGateJudge({ row, num, judge, isError = false, isFailure = false, isLoading = false, isLocked = false }) {
    const onGateJudge = judge => {
        if ((!isLoading) && (!isLocked)) {
            // ToDo: ディスパッチの呼び出し
            
        }
    };
    const onGateJudge0 = () => onGateJudge('0');
    const onGateJudge2 = () => onGateJudge('2');
    const onGateJudge50 = () => onGateJudge('50');
    const onGateJudgeDnf = () => onGateJudge('DSQ');

    return (
        <div className='gate-penalty'>
            <span className={'gate-penalty-gate ' + ((isError || isFailure) ? 'gate-color-error' : (isLocked ? 'gate-color-gray' : (isLoading ? 'gate-color-red' : 'gate-color-green')))}>{num}</span>
            <span className={'gate-penalty-0 ' + (judge == '0' ? 'gate-penalty-selected' : 'gate-penalty-unselected')} onClick={onGateJudge0} >0</span>
            <span className={'gate-penalty-2 ' + (judge == '2' ? 'gate-penalty-selected' : 'gate-penalty-unselected')} onClick={onGateJudge2} >2</span>
            <span className={'gate-penalty-50 ' + (judge == '50' ? 'gate-penalty-selected' : 'gate-penalty-unselected')} onClick={onGateJudge50} >50</span>
            <span className={'gate-penalty-dsq ' + (judge == 'DSQ' ? 'gate-penalty-selected' : 'gate-penalty-unselected')} onClick={onGateJudgeDnf} >DSQ</span>
        </div>
    );
}

export default DatasetGateJudge;