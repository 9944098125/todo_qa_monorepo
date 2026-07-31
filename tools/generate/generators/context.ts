import path from 'path';
import { Generator, GeneratorOptions } from '../types';
import { prompts } from '../prompts';
import { filesystem } from '../filesystem';
import { PATHS } from '../config';
import { resolveTargetPath, buildContext, getAvailablePages } from '../utils';

export const contextGenerator: Generator = {
  name: 'context',
  description: 'Generate a React Context',
  prompts: [
    {
      type: 'select',
      name: 'page',
      message: 'Select the page for this context:',
      choices: () => {
        const pages = getAvailablePages();
        if (pages.length === 0) return [{ name: 'No pages found.', value: '' }];
        return pages.map(p => ({ name: p, value: p }));
      },
    }
  ],
  run: async (options: GeneratorOptions, answers: any) => {
    let name = options.name || await prompts.askName('context');
    if (!name.endsWith('Context')) {
      name = `${name}Context`;
    }

    if (!answers.page) return;

    const targetPath = resolveTargetPath(options, answers);
    const destDir = path.join(targetPath, 'src/app/pages', answers.page, 'context', name);
    
    const context = buildContext(options);
    const templateDir = path.join(PATHS.templates, 'context');
    const templateData = { name };

    await filesystem.generateFile(
      path.join(templateDir, 'Context.tsx.hbs'),
      path.join(destDir, `${name}.tsx`),
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
