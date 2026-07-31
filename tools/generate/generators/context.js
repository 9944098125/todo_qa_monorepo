"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextGenerator = void 0;
const path_1 = __importDefault(require("path"));
const prompts_1 = require("../prompts");
const filesystem_1 = require("../filesystem");
const config_1 = require("../config");
const utils_1 = require("../utils");
exports.contextGenerator = {
    name: 'context',
    description: 'Generate a React Context',
    prompts: [
        {
            type: 'list',
            name: 'page',
            message: 'Select the page for this context:',
            choices: () => {
                const pages = (0, utils_1.getAvailablePages)();
                if (pages.length === 0)
                    return [{ name: 'No pages found.', value: '' }];
                return pages.map(p => ({ name: p, value: p }));
            },
        }
    ],
    run: async (options, answers) => {
        let name = options.name || await prompts_1.prompts.askName('context');
        if (!name.endsWith('Context')) {
            name = `${name}Context`;
        }
        if (!answers.page)
            return;
        const targetPath = (0, utils_1.resolveTargetPath)(options, answers);
        const destDir = path_1.default.join(targetPath, 'src/app/pages', answers.page, 'context', name);
        const context = (0, utils_1.buildContext)(options);
        const templateDir = path_1.default.join(config_1.PATHS.templates, 'context');
        const templateData = { name };
        await filesystem_1.filesystem.generateFile(path_1.default.join(templateDir, 'Context.tsx.hbs'), path_1.default.join(destDir, `${name}.tsx`), templateData, context);
        await filesystem_1.filesystem.generateFile(path_1.default.join(templateDir, 'index.ts.hbs'), path_1.default.join(destDir, 'index.ts'), templateData, context);
    },
};
