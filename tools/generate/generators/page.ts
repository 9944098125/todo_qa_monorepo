import path from 'path';
import { Generator, GeneratorOptions } from '../types';
import { prompts } from '../prompts';
import { filesystem } from '../filesystem';
import { PATHS } from '../config';
import { resolveTargetPath, buildContext } from '../utils';

export const pageGenerator: Generator = {
  name: 'page',
  description: 'Generate a Page',
  prompts: [
    {
      type: 'confirm',
      name: 'requiresApi',
      message: 'Does this page require API integration?',
      default: false,
    }
  ],
  run: async (options: GeneratorOptions, answers: any) => {
    let name = options.name || await prompts.askName('page');

    const targetPath = resolveTargetPath(options, answers);
    const destDir = path.join(targetPath, 'src/app/pages', name);

    const context = buildContext(options);
    const templateDir = path.join(PATHS.templates, 'page');
    const templateData = { name };

    // 1. Generate Page files
    await filesystem.generateFile(
      path.join(templateDir, 'Component.tsx.hbs'),
      path.join(destDir, 'index.tsx'),
      templateData,
      context
    );
    await filesystem.generateFile(
      path.join(templateDir, 'Loadable.tsx.hbs'),
      path.join(destDir, 'Loadable.tsx'),
      templateData,
      context
    );

    // 2. Conditionally generate Slice inside page if requested
    if (answers.requiresApi) {
      const sliceTemplateDir = path.join(PATHS.templates, 'slice');
      const sliceDestDir = path.join(destDir, 'slice');
      const sliceName = `${name}Slice`;
      
      // Pass requiresApi so slice index.ts knows whether to generate RTK query
      const sliceTemplateData = { 
        name, 
        sliceName,
        requiresApi: answers.requiresApi
      };

      await filesystem.generateFile(
        path.join(sliceTemplateDir, 'index.ts.hbs'),
        path.join(sliceDestDir, 'index.ts'),
        sliceTemplateData,
        context
      );
      await filesystem.generateFile(
        path.join(sliceTemplateDir, 'selectors.ts.hbs'),
        path.join(sliceDestDir, 'selectors.ts'),
        sliceTemplateData,
        context
      );
      await filesystem.generateFile(
        path.join(sliceTemplateDir, 'types.ts.hbs'),
        path.join(sliceDestDir, 'types.ts'),
        sliceTemplateData,
        context
      );
    }
  },
};
