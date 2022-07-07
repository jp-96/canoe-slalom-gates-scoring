namespace HtmlTemplateParameter {

    interface Container {
        parameter?: any;
    };

    interface HtmlTemplate extends GoogleAppsScript.HTML.HtmlTemplate {
        setHtmlTemplateParameter(parameter?: any): HtmlTemplate;
    }

    export const defaultValue: Container = {};

    /**
     * Pushing Variable: `htmlTemplateParameterString`
     * https://developers.google.com/apps-script/guides/html/templates#pushing_variables_to_templates     
     */
    export const htmlTemplateParameterString = '<? try {?><?= p ?><? } catch {} ?>';

    export function assign(template, parameter?: any) {
        const container: Container = { parameter };
        template.p = JSON.stringify(container);
        return template;
    }

    export function createTemplateFromFile(filename: string, parameter?: any) {
        const template = HtmlService.createTemplateFromFile(filename) as HtmlTemplate;
        template.setHtmlTemplateParameter = (parameter?: any) => assign(template, parameter);
        return parameter ? template.setHtmlTemplateParameter(parameter) : template;
    }

}

export default HtmlTemplateParameter;