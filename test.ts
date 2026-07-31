import { runCLI } from './tools/generate/cli.ts';
runCLI(['node', 'index.ts', 'component', 'layout']).catch(console.error);
