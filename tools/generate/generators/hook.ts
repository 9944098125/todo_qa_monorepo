import path from 'path';
import { Generator, GeneratorOptions } from '../types';
import { prompts } from '../prompts';
import { filesystem } from '../filesystem';
import { PATHS } from '../config';
import { resolveTargetPath, buildContext, getAvailablePages } from '../utils';

export const hookGenerator: Generator = {
  name: 'hook',
  description: 'Generate a custom React hook',
  prompts: [
    {
      type: 'select',
      name: 'target',
      message: 'Where do you want to generate it?',
      choices: [
        { name: '1. A specific Page in src/app/pages', value: 'page' },
        { name: '2. packages/utils (Shared Hook)', value: 'packages/utils' },
      ],
      when: (answers: any) => !answers.shared,
    },
    {
      type: 'select',
      name: 'page',
      message: 'Select the page:',
      choices: () => {
        const pages = getAvailablePages();
        if (pages.length === 0) return [{ name: 'No pages found.', value: '' }];
        return pages.map(p => ({ name: p, value: p }));
      },
      when: (answers: any) => answers.target === 'page',
    }
  ],
  run: async (options: GeneratorOptions, answers: any) => {
    let name = options.name || await prompts.askName('hook');
    if (!name.startsWith('use')) {
      name = `use${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    }

    const targetPath = resolveTargetPath(options, answers, 'packages/utils');
    let destDir = '';
    
    if (options.shared || answers.target === 'packages/utils') {
      destDir = path.join(targetPath, 'src/hooks', name);
    } else {
      if (!answers.page) return;
      destDir = path.join(targetPath, 'src/app/pages', answers.page, 'hooks', name);
    }

    const context = buildContext(options);
    const templateDir = path.join(PATHS.templates, 'hook');
    const templateData = { name };

    await filesystem.generateFile(
      path.join(templateDir, 'hook.ts.hbs'),
      path.join(destDir, `${name}.ts`),
      templateData,
      context
    );
    await filesystem.generateFile(
      path.join(templateDir, 'hook.test.ts.hbs'),
      path.join(destDir, `${name}.test.ts`),
      templateData,
      context
    );
    await filesystem.generateFile(
      path.join(templateDir, 'index.ts.hbs'),
      path.join(destDir, 'index.ts'),
      templateData,
      context
    );
  },
};
