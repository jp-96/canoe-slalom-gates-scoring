import { renderIntoDocument } from "react-dom/test-utils";
import Penalties from "./api/penaltydata";

function doGet(e: GoogleAppsScript.Events.DoGet) {
    Logger.log(e);
    const p = e.parameter;
    if (p.sheetName != "テストデータ") {
        return;
    }
    const template = HtmlService.createTemplateFromFile("index");
    template.sheetName = p.sheetName;
    template.beginGate = p.beginGate;
    template.gateLength = p.gateLength;
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
