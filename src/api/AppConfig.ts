namespace AppConfig {

    export type AppConfig = {
        sheetName: string;
        beginGate: number;
        gateLength: number;
        start: number;
        finish: number;
    }

    export const defaultValue: AppConfig = {
        sheetName: '',
        beginGate: 0,
        gateLength: 0,
        start: 0,
        finish: 0,
    };

    export function buildAppConfig(sheetName: any, beginGate: any, gateLength: any, start: any, finish: any): AppConfig {
        return {
            sheetName: String(sheetName),
            beginGate: Number(beginGate),
            gateLength: Number(gateLength),
            start: Number(start),
            finish: Number(finish),
        }
    }

}

export default AppConfig;