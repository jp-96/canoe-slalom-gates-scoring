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

function getData(sheetName: string): Penalties.SheetData {
    return Penalties.getSheetData(sheetName);
}

function putData(sheetName: string, sheetData: Penalties.SheetData) {
    Penalties.putSheetData(sheetName, sheetData);
}
