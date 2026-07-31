import path from 'path';
import fs from 'fs-extra';
import { PATHS } from './config';
import { GenerateContext, GeneratorOptions } from './types';

export function resolveTargetPath(options: GeneratorOptions, answers: any, defaultSharedTarget: string = 'packages/ui'): string {
  const target = options.shared ? defaultSharedTarget : answers.target || 'frontend';
  
  if (target === 'frontend') return PATHS.apps.frontend;
  if (target === 'backend') return PATHS.apps.backend;
  if (target === 'packages/ui') return PATHS.packages.ui;
  if (target === 'packages/utils') return PATHS.packages.utils;
  if (target === 'packages/types') return PATHS.packages.types;
  if (target === 'packages/config') return PATHS.packages.config;
  
  return PATHS.apps.frontend;
}

export function buildContext(options: GeneratorOptions): GenerateContext {
  return {
    cwd: process.cwd(),
    dryRun: !!options.dryRun,
    force: !!options.force,
    verbose: !!options.verbose,
  };
}

export function getAvailablePages(): string[] {
  const pagesDir = path.join(PATHS.apps.frontend, 'src/app/pages');
  try {
    if (!fs.existsSync(pagesDir)) return [];
    return fs
      .readdirSync(pagesDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  } catch (e) {
    return [];
  }
}
