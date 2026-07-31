import inquirer from 'inquirer';
import { registry } from './registry';
import { logger } from './logger';
import { GeneratorOptions } from './types';
import { filesystem } from './filesystem';

export async function runCLI(args: string[]) {
  try {
    const rawArgs = args.slice(2);
    let generatorName = rawArgs[0];
    let entityName = rawArgs[1];
    
    // Parse flags manually to avoid extra dependencies
    const options: GeneratorOptions = {
      name: entityName,
      feature: getFlagValue(rawArgs, '--feature'),
      shared: hasFlag(rawArgs, '--shared'),
      force: hasFlag(rawArgs, '--force'),
      dryRun: hasFlag(rawArgs, '--dry-run'),
      verbose: hasFlag(rawArgs, '--verbose'),
    };

    if (!generatorName || generatorName.startsWith('--')) {
      const answers = await inquirer.prompt([
        {
          type: 'select',
          name: 'generator',
          message: 'What would you like to generate?',
          choices: registry.getAll().map((g) => ({
            name: `${g.name} - ${g.description}`,
            value: g.name,
          })),
        },
      ]);
      generatorName = answers.generator;
    }

    const generator = registry.get(generatorName);
    
    if (!generator) {
      logger.error(`Generator "${generatorName}" not found.`);
      process.exit(1);
    }

    const promptAnswers = await inquirer.prompt(generator.prompts);

    // Merge answers, command line arguments can override prompt defaults
    // Note: If using CLI args, we skip prompts for name/target usually, but the generator logic handles this by using options first.
    await generator.run(options, promptAnswers);

  } catch (error) {
    logger.error('Generation failed.');
    await filesystem.rollback();
    process.exit(1);
  }
}

function hasFlag(args: string[], flag: string): boolean {
  return args.includes(flag);
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index !== -1 && index + 1 < args.length && !args[index + 1].startsWith('--')) {
    return args[index + 1];
  }
  return undefined;
}
