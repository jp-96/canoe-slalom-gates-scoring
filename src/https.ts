import HtmlTemplateDataSetter from './api/HtmlTemplateDataSetter';
import CanoeSlalomHeatService from './api/CanoeSlalomHeatService';
import WebApiService from './api/WebApiService';
import CanoeSlalomHeatData from './dao/CanoeSlalomHeatData';
import AppConfig from './api/AppConfig';

function doGet(e: GoogleAppsScript.Events.DoGet) {
    Logger.log(e);
    const u = parsePathInfo(e);
    Logger.log(u);

    const webApp = () => {
        const p = e.parameter;
        const appConfig = AppConfig.buildAppConfig(p.sheetName, p.beginGate, p.gateLength, p.start, p.finish);
        const template = HtmlTemplateDataSetter.createTemplateFromFile("index", appConfig);
        return template
            .evaluate()
            .addMetaTag("viewport", "width=device-width, initial-scale=1.0")
            .setTitle("Canoe Slalom Scoring App.");
    };

    const getHeatsAll = () => {
        const json = WebApiService.getHeatsAll();
        return responseJson(json);
    }

    switch (u.paths.length) {
        case 1:
            if (u.paths[0] === 'api') {
                const v = u.values.api;
                if (v) {
                    // 未サポート
                } else {
                    // スタートリスト名一覧
                    return getHeatsAll();
                }
            }
            break;
        case 2:
            break;
        default:
            break;
    }

    // アプリ
    return webApp();
}

function doPost(e: GoogleAppsScript.Events.DoPost) {
    Logger.log(e);
    const u = parsePathInfo(e);
    Logger.log(u);

}

function getDataset(criteria: CanoeSlalomHeatService.Criteria) {
    Logger.log(criteria);
    return CanoeSlalomHeatService.getDataset(criteria);
}

function putData(data: CanoeSlalomHeatData.Data) {
    Logger.log(data);
    return CanoeSlalomHeatService.putData(data);
}

function parsePathInfo(e: any) {
    const paths: string[] = [];
    const values: any = {};
    const r = {
        paths,
        values,
    };
    if (e.pathInfo) {
        const p = e.pathInfo.split('/');
        let key: string = '';
        for (let i = 0; i < p.length; i++) {
            if ((i % 2) > 0) {
                // value
                r.values[key] = decodeURIComponent(p[i]);
            } else {
                key = decodeURIComponent(p[i]);
                r.paths.push(key);
                r.values[key] = null;
            }
        }
    }
    return r;
}

function responseJson(json: any) {
    return ContentService
        .createTextOutput(JSON.stringify(json))
        .setMimeType(ContentService.MimeType.JSON);
}