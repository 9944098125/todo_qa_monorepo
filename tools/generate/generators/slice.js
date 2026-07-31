"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sliceGenerator = void 0;
const path_1 = __importDefault(require("path"));
const filesystem_1 = require("../filesystem");
const config_1 = require("../config");
const utils_1 = require("../utils");
exports.sliceGenerator = {
    name: 'slice',
    description: 'Generate a Redux Toolkit slice inside a page',
    prompts: [
        {
            type: 'list',
            name: 'page',
            message: 'Select the page for this slice:',
            choices: () => {
                const pages = (0, utils_1.getAvailablePages)();
                if (pages.length === 0)
                    return [{ name: 'No pages found, please create one first.', value: '' }];
                return pages.map(p => ({ name: p, value: p }));
            },
            when: (answers) => !answers.page,
        },
        {
            type: 'confirm',
            name: 'requiresApi',
            message: 'Include RTK Query API declaration?',
            default: true,
        }
    ],
    run: async (options, answers) => {
        if (!answers.page) {
            console.log('Aborting: No page selected.');
            return;
        }
        const name = options.name || answers.page.replace(/Page$/, '');
        const targetPath = (0, utils_1.resolveTargetPath)(options, answers);
        const destDir = path_1.default.join(targetPath, 'src/app/pages', answers.page, 'slice');
        const context = (0, utils_1.buildContext)(options);
        const templateDir = path_1.default.join(config_1.PATHS.templates, 'slice');
        const sliceName = `${name}Slice`;
        const templateData = {
            name,
            sliceName,
            requiresApi: answers.requiresApi
        };
        await filesystem_1.filesystem.generateFile(path_1.default.join(templateDir, 'index.ts.hbs'), path_1.default.join(destDir, 'index.ts'), templateData, { ...context, force: true } // Overwrite if placeholder exists
        );
        await filesystem_1.filesystem.generateFile(path_1.default.join(templateDir, 'selectors.ts.hbs'), path_1.default.join(destDir, 'selectors.ts'), templateData, context);
        await filesystem_1.filesystem.generateFile(path_1.default.join(templateDir, 'types.ts.hbs'), path_1.default.join(destDir, 'types.ts'), templateData, context);
    },
};
