"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageGenerator = void 0;
const path_1 = __importDefault(require("path"));
const prompts_1 = require("../prompts");
const filesystem_1 = require("../filesystem");
const config_1 = require("../config");
const utils_1 = require("../utils");
exports.pageGenerator = {
    name: 'page',
    description: 'Generate a Page',
    prompts: [
        {
            type: 'confirm',
            name: 'requiresApi',
            message: 'Does this page require API integration?',
            default: false,
        }
    ],
    run: async (options, answers) => {
        let name = options.name || await prompts_1.prompts.askName('page');
        const targetPath = (0, utils_1.resolveTargetPath)(options, answers);
        const destDir = path_1.default.join(targetPath, 'src/app/pages', name);
        const context = (0, utils_1.buildContext)(options);
        const templateDir = path_1.default.join(config_1.PATHS.templates, 'page');
        const templateData = { name };
        // 1. Generate Page files
        await filesystem_1.filesystem.generateFile(path_1.default.join(templateDir, 'Component.tsx.hbs'), path_1.default.join(destDir, 'index.tsx'), templateData, context);
        await filesystem_1.filesystem.generateFile(path_1.default.join(templateDir, 'Loadable.tsx.hbs'), path_1.default.join(destDir, 'Loadable.tsx'), templateData, context);
        // 2. Conditionally generate Slice inside page if requested
        if (answers.requiresApi) {
            const sliceTemplateDir = path_1.default.join(config_1.PATHS.templates, 'slice');
            const sliceDestDir = path_1.default.join(destDir, 'slice');
            const sliceName = `${name}Slice`;
            // Pass requiresApi so slice index.ts knows whether to generate RTK query
            const sliceTemplateData = {
                name,
                sliceName,
                requiresApi: answers.requiresApi
            };
            await filesystem_1.filesystem.generateFile(path_1.default.join(sliceTemplateDir, 'index.ts.hbs'), path_1.default.join(sliceDestDir, 'index.ts'), sliceTemplateData, context);
            await filesystem_1.filesystem.generateFile(path_1.default.join(sliceTemplateDir, 'selectors.ts.hbs'), path_1.default.join(sliceDestDir, 'selectors.ts'), sliceTemplateData, context);
            await filesystem_1.filesystem.generateFile(path_1.default.join(sliceTemplateDir, 'types.ts.hbs'), path_1.default.join(sliceDestDir, 'types.ts'), sliceTemplateData, context);
        }
    },
};
