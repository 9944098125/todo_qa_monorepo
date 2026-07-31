import path from 'path';
import { Generator, GeneratorOptions } from '../types';
import { prompts } from '../prompts';
import { filesystem } from '../filesystem';
import { PATHS } from '../config';
import { resolveTargetPath, buildContext, getAvailablePages } from '../utils';

export const sliceGenerator: Generator = {
  name: 'slice',
  description: 'Generate a Redux Toolkit slice inside a page',
  prompts: [
    {
      type: 'select',
      name: 'page',
      message: 'Select the page for this slice:',
      choices: () => {
        const pages = getAvailablePages();
        if (pages.length === 0) return [{ name: 'No pages found, please create one first.', value: '' }];
        return pages.map(p => ({ name: p, value: p }));
      },
      when: (answers: any) => !answers.page,
    },
    {
      type: 'confirm',
      name: 'requiresApi',
      message: 'Include RTK Query API declaration?',
      default: true,
    }
  ],
  run: async (options: GeneratorOptions, answers: any) => {
    if (!answers.page) {
      console.log('Aborting: No page selected.');
      return;
    }
    const name = options.name || answers.page.replace(/Page$/, '');
    const targetPath = resolveTargetPath(options, answers);
    
    const destDir = path.join(targetPath, 'src/app/pages', answers.page, 'slice');
    const context = buildContext(options);
    const templateDir = path.join(PATHS.templates, 'slice');
    const sliceName = `${name}Slice`;
    const templateData = { 
      name, 
      sliceName,
      requiresApi: answers.requiresApi 
    };

    await filesystem.generateFile(
      path.join(templateDir, 'index.ts.hbs'),
      path.join(destDir, 'index.ts'),
      templateData,
      { ...context, force: true } // Overwrite if placeholder exists
    );

    await filesystem.generateFile(
      path.join(templateDir, 'selectors.ts.hbs'),
      path.join(destDir, 'selectors.ts'),
      templateData,
      context
    );

    await filesystem.generateFile(
      path.join(templateDir, 'types.ts.hbs'),
      path.join(destDir, 'types.ts'),
      templateData,
      context
    );
  },
};
