"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prompts = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const config_1 = require("./config");
exports.prompts = {
    async askTarget() {
        const { target } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'target',
                message: 'Which project/package is this for?',
                choices: config_1.TARGET_CHOICES,
            },
        ]);
        return target;
    },
    async askFeature() {
        const { feature } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'feature',
                message: 'Which feature does this belong to? (leave blank for none/shared)',
            },
        ]);
        return feature;
    },
    async askName(entityType) {
        const { name } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'name',
                message: `What is the name of the ${entityType}?`,
                validate: (input) => input.trim() !== '' || 'Name is required',
            },
        ]);
        return name;
    },
    async custom(questions) {
        return inquirer_1.default.prompt(questions);
    },
};
