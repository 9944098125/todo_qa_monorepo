import path from 'path';
import { Generator, GeneratorOptions } from '../types';
import { prompts } from '../prompts';
import { filesystem } from '../filesystem';
import { PATHS } from '../config';
import { resolveTargetPath, buildContext } from '../utils';

export const componentGenerator: Generator = {
  name: 'component',
  description: 'Generate a React component',
  prompts: [
    {
      type: 'select',
      name: 'target',
      message: 'Where do you want to generate it?',
      choices: [
        { name: '1. src/app/components', value: 'frontend' },
      ],
      when: (answers: any) => !answers.shared,
    }
  ],
  run: async (options: GeneratorOptions, answers: any) => {
    const name = options.name || await prompts.askName('component');
    const targetPath = resolveTargetPath(options, answers);
    
    let destDir = '';
    if (options.shared || answers.target === 'packages/ui') {
      destDir = path.join(targetPath, 'src/components', name);
    } else {
      destDir = path.join(targetPath, 'src/app/components', name);
    }

    const context = buildContext(options);
    const templateDir = path.join(PATHS.templates, 'component');
    
    const templateData = { name };

    await filesystem.generateFile(
      path.join(templateDir, 'Component.tsx.hbs'),
      path.join(destDir, 'index.tsx'),
      templateData,
      context
    );
  },
};
