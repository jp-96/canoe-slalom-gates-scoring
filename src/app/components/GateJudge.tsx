import React, {useState} from "react";

function GateJudge({ gateNumber, gateColor='green', defaultPenalty = ''}) {
    const [penalty, setPenalty] = useState(defaultPenalty);
    const onGateJudge = penalty => setPenalty(penalty);
    return (
        <div className='gate-penalty'>
            <span className={'gate-penalty-gate ' +(gateColor=='green' ? 'gate-color-green' : 'gate-color-red')}>{gateNumber}</span>
            <span className={'gate-penalty-0 ' + (penalty == '0' ? 'gate-penalty-selected' : 'gate-penalty-unselected')} onClick={() => onGateJudge('0')} >0</span>
            <span className={'gate-penalty-2 '  + (penalty == '2' ? 'gate-penalty-selected' : 'gate-penalty-unselected')} onClick={() => onGateJudge('2')} >2</span>
            <span className={'gate-penalty-50 '  + (penalty == '50' ? 'gate-penalty-selected' : 'gate-penalty-unselected')} onClick={() => onGateJudge('50')} >50</span>
            <span className={'gate-penalty-dnf ' + (penalty == 'DNF' ? 'gate-penalty-selected' : 'gate-penalty-unselected')} onClick={() => onGateJudge('DNF')} >DNF</span>
        </div>
    );

}

export default GateJudge;