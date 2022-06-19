import MyLogger from './api/mylogger';

function doGet(e: GoogleAppsScript.Events.DoGet) {
    MyLogger.log(JSON.stringify(e));
    const template = HtmlService.createTemplateFromFile("index");
    template.querystring = JSON.stringify(e);
    return template
        .evaluate()
        .addMetaTag("viewport", "width=device-width, initial-scale=1.0")
        .setTitle("React App on Google Apps Script");
}