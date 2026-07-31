"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentGenerator = void 0;
const path_1 = __importDefault(require("path"));
const prompts_1 = require("../prompts");
const filesystem_1 = require("../filesystem");
const config_1 = require("../config");
const utils_1 = require("../utils");
exports.componentGenerator = {
    name: 'component',
    description: 'Generate a React component',
    prompts: [
        {
            type: 'list',
            name: 'target',
            message: 'Where do you want to generate it?',
            choices: [
                { name: '1. src/app/components', value: 'frontend' },
                { name: '2. packages/ui (Shared Component)', value: 'packages/ui' },
            ],
            when: (answers) => !answers.shared,
        }
    ],
    run: async (options, answers) => {
        const name = options.name || await prompts_1.prompts.askName('component');
        const targetPath = (0, utils_1.resolveTargetPath)(options, answers);
        let destDir = '';
        if (options.shared || answers.target === 'packages/ui') {
            destDir = path_1.default.join(targetPath, 'src/components', name);
        }
        else {
            destDir = path_1.default.join(targetPath, 'src/app/components', name);
        }
        const context = (0, utils_1.buildContext)(options);
        const templateDir = path_1.default.join(config_1.PATHS.templates, 'component');
        const templateData = { name };
        await filesystem_1.filesystem.generateFile(path_1.default.join(templateDir, 'Component.tsx.hbs'), path_1.default.join(destDir, 'index.tsx'), templateData, context);
    },
};
