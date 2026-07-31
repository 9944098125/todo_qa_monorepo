import path from 'path';
import { Generator, GeneratorOptions } from '../types';
import { filesystem } from '../filesystem';
import { PATHS } from '../config';
import { resolveTargetPath, buildContext, getAvailablePages } from '../utils';

export const apiGenerator: Generator = {
  name: 'api',
  description: 'Generate an RTK Query API inside a page',
  prompts: [
    {
      type: 'select',
      name: 'page',
      message: 'Select the page for this API:',
      choices: () => {
        const pages = getAvailablePages();
        if (pages.length === 0) return [{ name: 'No pages found, please create one first.', value: '' }];
        return pages.map(p => ({ name: p, value: p }));
      },
      when: (answers: any) => !answers.page,
    }
  ],
  run: async (options: GeneratorOptions, answers: any) => {
    if (!answers.page) return;
    const name = options.name || answers.page.replace(/Page$/, '');
    const apiName = `${name}Api`;
    
    const targetPath = resolveTargetPath(options, answers);
    const destDir = path.join(targetPath, 'src/app/pages', answers.page, 'slice');
    const indexTsPath = path.join(destDir, 'index.ts');
    
    if (!filesystem.exists(indexTsPath)) {
      console.log(`Error: slice/index.ts does not exist for page ${answers.page}. Please generate a slice first.`);
      return;
    }

    const content = await filesystem.readFile(indexTsPath);
    if (content.includes('createApi')) {
      console.log(`RTK Query API already exists in ${answers.page} slice.`);
      return;
    }

    const apiCode = `
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ${apiName} = createApi({
  reducerPath: '${name}Api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    // Add endpoints here
  }),
});

export const { } = ${apiName};
`;
    await filesystem.writeFile(indexTsPath, content + '\n' + apiCode, options);
  },
};
