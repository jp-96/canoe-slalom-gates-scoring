namespace AppConfig {

    export type AppConfig = {
        sheetName: string;
        beginGate: number;
        gateLength: number;
    }

    export const defaultValue: AppConfig = {
        sheetName: '',
        beginGate: 0,
        gateLength: -1,
    };

    export function buildAppConfig(sheetName: any, beginGate: any, gateLength: any): AppConfig {
        return {
            sheetName: String(sheetName),
            beginGate: Number(beginGate),
            gateLength: Number(gateLength),
        }
    }

}

export default AppConfig;