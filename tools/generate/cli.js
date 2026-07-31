"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCLI = runCLI;
const inquirer_1 = __importDefault(require("inquirer"));
const registry_1 = require("./registry");
const logger_1 = require("./logger");
const filesystem_1 = require("./filesystem");
async function runCLI(args) {
    try {
        const rawArgs = args.slice(2);
        let generatorName = rawArgs[0];
        let entityName = rawArgs[1];
        // Parse flags manually to avoid extra dependencies
        const options = {
            name: entityName,
            feature: getFlagValue(rawArgs, '--feature'),
            shared: hasFlag(rawArgs, '--shared'),
            force: hasFlag(rawArgs, '--force'),
            dryRun: hasFlag(rawArgs, '--dry-run'),
            verbose: hasFlag(rawArgs, '--verbose'),
        };
        if (!generatorName || generatorName.startsWith('--')) {
            const answers = await inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'generator',
                    message: 'What would you like to generate?',
                    choices: registry_1.registry.getAll().map((g) => ({
                        name: `${g.name} - ${g.description}`,
                        value: g.name,
                    })),
                },
            ]);
            generatorName = answers.generator;
        }
        const generator = registry_1.registry.get(generatorName);
        if (!generator) {
            logger_1.logger.error(`Generator "${generatorName}" not found.`);
            process.exit(1);
        }
        const promptAnswers = await inquirer_1.default.prompt(generator.prompts);
        // Merge answers, command line arguments can override prompt defaults
        // Note: If using CLI args, we skip prompts for name/target usually, but the generator logic handles this by using options first.
        await generator.run(options, promptAnswers);
    }
    catch (error) {
        logger_1.logger.error('Generation failed.');
        console.error(error);
        require('fs').writeFileSync('error.log', String(error.stack || error));
        await filesystem_1.filesystem.rollback();
        process.exit(1);
    }
}
function hasFlag(args, flag) {
    return args.includes(flag);
}
function getFlagValue(args, flag) {
    const index = args.indexOf(flag);
    if (index !== -1 && index + 1 < args.length && !args[index + 1].startsWith('--')) {
        return args[index + 1];
    }
    return undefined;
}
