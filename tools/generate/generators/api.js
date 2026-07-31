"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiGenerator = void 0;
const path_1 = __importDefault(require("path"));
const filesystem_1 = require("../filesystem");
const utils_1 = require("../utils");
exports.apiGenerator = {
    name: 'api',
    description: 'Generate an RTK Query API inside a page',
    prompts: [
        {
            type: 'list',
            name: 'page',
            message: 'Select the page for this API:',
            choices: () => {
                const pages = (0, utils_1.getAvailablePages)();
                if (pages.length === 0)
                    return [{ name: 'No pages found, please create one first.', value: '' }];
                return pages.map(p => ({ name: p, value: p }));
            },
            when: (answers) => !answers.page,
        }
    ],
    run: async (options, answers) => {
        if (!answers.page)
            return;
        const name = options.name || answers.page.replace(/Page$/, '');
        const apiName = `${name}Api`;
        const targetPath = (0, utils_1.resolveTargetPath)(options, answers);
        const destDir = path_1.default.join(targetPath, 'src/app/pages', answers.page, 'slice');
        const indexTsPath = path_1.default.join(destDir, 'index.ts');
        if (!filesystem_1.filesystem.exists(indexTsPath)) {
            console.log(`Error: slice/index.ts does not exist for page ${answers.page}. Please generate a slice first.`);
            return;
        }
        const content = await filesystem_1.filesystem.readFile(indexTsPath);
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
        await filesystem_1.filesystem.writeFile(indexTsPath, content + '\n' + apiCode, options);
    },
};
