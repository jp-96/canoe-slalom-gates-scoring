import AppConfig from "./api/AppConfig";
import Penalties from "./api/penaltydata";

function doGet(e: GoogleAppsScript.Events.DoGet) {
    Logger.log(e);
    const p = e.parameter;
    const appConfig = AppConfig.buildAppConfig(p.sheetName, p.beginGate, p.gateLength);
    if (appConfig.sheetName != "テストデータ") {
        return;
    }
    const template = HtmlService.createTemplateFromFile("index");
    template.appConfigString = AppConfig.stringifyAppConfig(appConfig);
    return template
        .evaluate()
        .addMetaTag("viewport", "width=device-width, initial-scale=1.0")
        .setTitle("React App on Google Apps Script");
}

function getData(sheetName: string, beginGate: number, gateLength: number): Penalties.SheetData {
    Logger.log(`sheetName:${sheetName}\nbeginGate: ${beginGate}\ngateLength: ${gateLength}`);
    const data = Penalties.getSheetData(sheetName, beginGate, gateLength);
    Logger.log(data);
    return data;
}

function putData(sheetName: string, sheetData: Penalties.SheetData): Penalties.SheetData {
    Logger.log(`sheetName:${sheetName}`);
    Logger.log(sheetData);
    const saved = Penalties.putSheetData(sheetName, sheetData);
    Logger.log(saved);
    return saved;
}
