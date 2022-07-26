namespace WebApiData {

    export type RowsParameter = {
        heatName: string;
        row1?: number;
        row2?: number;
    }

    export type GatesParameter = {
        heatName: string;
        num1?: number;
        num2?: number;
    }

    export type Heat = {
        heatName: string;
    };

    export type Record = {
        runner: Runner;
        started: Started;
        finished: Finished;
        gates: Gate[];
    };

    export type Runner = {
        row: number;
        bib: string;
        heat: string;
        locked: string;
    };

    export type Started = {
        judge: string;
        time: string;
    };

    export type Finished = {
        judge: string;
        time: string;
    };

    export type Gate = {
        num: number;
        judge: string;
    };
}

export default WebApiData;
