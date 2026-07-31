"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hookGenerator = void 0;
const path_1 = __importDefault(require("path"));
const prompts_1 = require("../prompts");
const filesystem_1 = require("../filesystem");
const config_1 = require("../config");
const utils_1 = require("../utils");
exports.hookGenerator = {
    name: 'hook',
    description: 'Generate a custom React hook',
    prompts: [
        {
            type: 'list',
            name: 'target',
            message: 'Where do you want to generate it?',
            choices: [
                { name: '1. A specific Page in src/app/pages', value: 'page' },
                { name: '2. packages/utils (Shared Hook)', value: 'packages/utils' },
            ],
            when: (answers) => !answers.shared,
        },
        {
            type: 'list',
            name: 'page',
            message: 'Select the page:',
            choices: () => {
                const pages = (0, utils_1.getAvailablePages)();
                if (pages.length === 0)
                    return [{ name: 'No pages found.', value: '' }];
                return pages.map(p => ({ name: p, value: p }));
            },
            when: (answers) => answers.target === 'page',
        }
    ],
    run: async (options, answers) => {
        let name = options.name || await prompts_1.prompts.askName('hook');
        if (!name.startsWith('use')) {
            name = `use${name.charAt(0).toUpperCase()}${name.slice(1)}`;
        }
        const targetPath = (0, utils_1.resolveTargetPath)(options, answers, 'packages/utils');
        let destDir = '';
        if (options.shared || answers.target === 'packages/utils') {
            destDir = path_1.default.join(targetPath, 'src/hooks', name);
        }
        else {
            if (!answers.page)
                return;
            destDir = path_1.default.join(targetPath, 'src/app/pages', answers.page, 'hooks', name);
        }
        const context = (0, utils_1.buildContext)(options);
        const templateDir = path_1.default.join(config_1.PATHS.templates, 'hook');
        const templateData = { name };
        await filesystem_1.filesystem.generateFile(path_1.default.join(templateDir, 'hook.ts.hbs'), path_1.default.join(destDir, `${name}.ts`), templateData, context);
        await filesystem_1.filesystem.generateFile(path_1.default.join(templateDir, 'hook.test.ts.hbs'), path_1.default.join(destDir, `${name}.test.ts`), templateData, context);
        await filesystem_1.filesystem.generateFile(path_1.default.join(templateDir, 'index.ts.hbs'), path_1.default.join(destDir, 'index.ts'), templateData, context);
    },
};
