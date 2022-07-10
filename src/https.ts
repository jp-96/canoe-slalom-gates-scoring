import HtmlTemplateDataSetter from './api/HtmlTemplateDataSetter';
import CanoeSlalomHeatService from './api/CanoeSlalomHeatService';
import AppConfig from './api/AppConfig';
import Penalties from './api/penaltydata';
import CanoeSlalomHeatData from './dao/CanoeSlalomHeatData';

function doGet(e: GoogleAppsScript.Events.DoGet) {
    Logger.log(e);
    const p = e.parameter;
    const appConfig = AppConfig.buildAppConfig(p.sheetName, p.beginGate, p.gateLength);
    // if (appConfig.sheetName != "テストデータ") {
    //     return;
    // }
    const template = HtmlTemplateDataSetter.createTemplateFromFile("index", appConfig);
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

function putSingleData(sheetData: Penalties.SheetData): Penalties.SheetData {
    Logger.log(`sheetName:${sheetData.sheetName}`);
    Logger.log(sheetData);
    //const saved = Penalties.putSheetData(sheetData);
    const saved = Penalties.putSingleData(sheetData);
    Logger.log(saved);
    return saved;
}

function getDataset(criteria: CanoeSlalomHeatService.Criteria) {
    Logger.log(criteria);
    return CanoeSlalomHeatService.getDataset(criteria);
}

function putData(data: CanoeSlalomHeatData.Data) {
    Logger.log(data);
    return CanoeSlalomHeatService.putData(data);
}
