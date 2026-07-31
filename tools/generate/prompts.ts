import inquirer from 'inquirer';
import { TARGET_CHOICES } from './config';

export const prompts = {
  async askTarget() {
    const { target } = await inquirer.prompt([
      {
        type: 'select',
        name: 'target',
        message: 'Which project/package is this for?',
        choices: TARGET_CHOICES,
      },
    ]);
    return target;
  },

  async askFeature() {
    const { feature } = await inquirer.prompt([
      {
        type: 'input',
        name: 'feature',
        message: 'Which feature does this belong to? (leave blank for none/shared)',
      },
    ]);
    return feature;
  },

  async askName(entityType: string) {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: `What is the name of the ${entityType}?`,
        validate: (input) => input.trim() !== '' || 'Name is required',
      },
    ]);
    return name;
  },

  async custom(questions: any[]) {
    return inquirer.prompt(questions);
  },
};
