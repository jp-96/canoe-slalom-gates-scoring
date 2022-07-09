export default HtmlTemplateDataSetter;
namespace HtmlTemplateDataSetter {

    interface Container {
        data?: any;
    };

    interface HtmlTemplate extends GoogleAppsScript.HTML.HtmlTemplate {
        setData(data?: any): HtmlTemplate;
    }

    /**
     * undefined data.
     */
    export const defaultValue: Container = {};

    /**
     * Pushing Variable: `data`
     * https://developers.google.com/apps-script/guides/html/templates#pushing_variables_to_templates     
     */
    export const htmlTemplateDataString = '<? try {?><?= data ?><? } catch {} ?>';

    function assign(template, data?: any) {
        const container: Container = { data };
        template.data = JSON.stringify(container);
        return template;
    }

    /**
     * Creates a new HtmlTemplate object from a file in the code editor,
     * using HtmlTemplateDataProvider component.
     * @param filename the name of the file to use.
     * @param data the data pushing to template.
     * @returns the new HtmlTemplate object with setData() method added.
     */
    export function createTemplateFromFile(filename: string, data?: any) {
        const template = HtmlService.createTemplateFromFile(filename) as HtmlTemplate;
        template.setHtmlTemplateParameter = (parameter?: any) => assign(template, parameter);
        return data ? template.setHtmlTemplateParameter(data) : template;
    }

}
