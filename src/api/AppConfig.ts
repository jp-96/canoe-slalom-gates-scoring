namespace AppConfig {

    export type AppConfig = {
        sheetName: string;
        beginGate: number;
        gateLength: number;
    }

    export function buildAppConfig(sheetName, beginGate, gateLength): AppConfig {
        return {
            sheetName: String(sheetName),
            beginGate: Number(beginGate),
            gateLength: Number(gateLength),
        }
    }

    export function stringifyAppConfig(appConfig: AppConfig): string {
        return JSON.stringify(appConfig);
    }

    export function parseAppConfigString(appConfigString: string): AppConfig {
        return JSON.parse(appConfigString);
    }

}

export default AppConfig;