import HtmlTemplateDataSetter from './api/HtmlTemplateDataSetter';
import CanoeSlalomHeatService from './api/CanoeSlalomHeatService';
import WebApiService from './api/WebApiService';
import CanoeSlalomHeatData from './dao/CanoeSlalomHeatData';
import AppConfig from './api/AppConfig';

function doGet(e: GoogleAppsScript.Events.DoGet) {
    Logger.log(e);
    const u = parsePathInfo_(e);
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

    // アプリ
    return webApp();
}

/**
curl -i -d '{"operationId":"getHeatsAll", "operationData":{}}' \
  -L 'https://script.google.com/.../exec' \
  -H "Accept: application/json" \
  -H "Content-Type: application/json"
*/
function doPost(e: GoogleAppsScript.Events.DoPost) {
    // curl等からアクセスすると認証ページへ遷移してしまうため、path(pathInfo)を設定しないこと。
    Logger.log(e);
    const p: WebApiService.PostParameter = JSON.parse(e.postData.contents);
    const result = WebApiService[p.operationId](p.operationData);
    return createJsonResponse_({ result });
}

function getDataset(criteria: CanoeSlalomHeatService.Criteria) {
    Logger.log(criteria);
    return CanoeSlalomHeatService.getDataset(criteria);
}

function putData(data: CanoeSlalomHeatData.Data) {
    Logger.log(data);
    return CanoeSlalomHeatService.putData(data);
}

function parsePathInfo_(e: any /** GoogleAppsScript.Events.DoGet */) {
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

function createJsonResponse_(json: any) {
    return ContentService
        .createTextOutput(JSON.stringify(json))
        .setMimeType(ContentService.MimeType.JSON);
}
