import Penalties from "./api/penaltydata";

function doGet(e: GoogleAppsScript.Events.DoGet) {
    MyLogger.log(JSON.stringify(e));
    const template = HtmlService.createTemplateFromFile("index");
    template.querystring = JSON.stringify(e);
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

function putData(sheetName: string, sheetData: Penalties.SheetData) {
    Logger.log(`sheetName:${sheetName}`);
    Logger.log(sheetData);
    Penalties.putSheetData(sheetName, sheetData);
}
