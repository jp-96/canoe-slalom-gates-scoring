import HtmlTemplateDataSetter from './api/HtmlTemplateDataSetter';
import CanoeSlalomHeatService from './api/CanoeSlalomHeatService';
import CanoeSlalomHeatData from './dao/CanoeSlalomHeatData';
import AppConfig from './api/AppConfig';

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

function getDataset(criteria: CanoeSlalomHeatService.Criteria) {
    Logger.log(criteria);
    return CanoeSlalomHeatService.getDataset(criteria);
}

function putData(data: CanoeSlalomHeatData.Data) {
    Logger.log(data);
    return CanoeSlalomHeatService.putData(data);
}
