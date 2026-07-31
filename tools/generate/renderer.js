"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = void 0;
const handlebars_1 = __importDefault(require("handlebars"));
// Helpers
handlebars_1.default.registerHelper('pascalCase', (str) => {
    return str
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .replace(new RegExp(/[^\w\s]/, 'g'), '')
        .replace(new RegExp(/\s+(.)(\w*)/, 'g'), ($1, $2, $3) => `${$2.toUpperCase()}${$3.toLowerCase()}`)
        .replace(new RegExp(/\w/), (s) => s.toUpperCase());
});
handlebars_1.default.registerHelper('camelCase', (str) => {
    const pascal = handlebars_1.default.helpers.pascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
});
handlebars_1.default.registerHelper('kebabCase', (str) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
});
const renderTemplate = (templateContent, data) => {
    const template = handlebars_1.default.compile(templateContent);
    return template(data);
};
exports.renderTemplate = renderTemplate;
