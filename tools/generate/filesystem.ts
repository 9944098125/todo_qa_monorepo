import fs from 'fs-extra';
import path from 'path';
import prettier from 'prettier';
import { logger } from './logger';
import { GenerateContext } from './types';
import { renderTemplate } from './renderer';

const writtenFiles: string[] = [];
const createdDirs: string[] = [];

export const filesystem = {
  async generateFile(
    templatePath: string,
    destinationPath: string,
    data: any,
    context: GenerateContext
  ) {
    try {
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      let outputContent = renderTemplate(templateContent, data);

      if (
        destinationPath.endsWith('.ts') ||
        destinationPath.endsWith('.tsx') ||
        destinationPath.endsWith('.js')
      ) {
        outputContent = await prettier.format(outputContent, {
          parser: 'typescript',
          singleQuote: true,
          trailingComma: 'es5',
        });
      }

      const dir = path.dirname(destinationPath);
      
      logger.debug(`Checking directory: ${dir}`, context.verbose);
      if (!(await fs.pathExists(dir))) {
        if (!context.dryRun) {
          await fs.ensureDir(dir);
          createdDirs.push(dir);
        }
        logger.debug(`Created directory: ${dir}`, context.verbose);
      }

      if (await fs.pathExists(destinationPath)) {
        if (!context.force) {
          logger.warn(`File already exists, skipping (use --force to overwrite): ${destinationPath}`);
          return;
        }
        logger.warn(`Overwriting existing file: ${destinationPath}`);
      }

      if (!context.dryRun) {
        await fs.writeFile(destinationPath, outputContent, 'utf-8');
        writtenFiles.push(destinationPath);
      }

      if (context.dryRun) {
        logger.success(`[DRY RUN] Generated: ${destinationPath}`);
      } else {
        logger.success(`Generated: ${destinationPath}`);
      }
    } catch (error: any) {
      logger.error(`Failed to generate file: ${destinationPath}`);
      logger.error(error.message);
      throw error;
    }
  },

  async rollback() {
    logger.info('Rolling back generated files...');
    for (const file of writtenFiles) {
      if (await fs.pathExists(file)) {
        await fs.remove(file);
        logger.debug(`Removed file: ${file}`, true);
      }
    }
    
    // Sort dirs by length descending so deeper dirs are removed first
    createdDirs.sort((a, b) => b.length - a.length);
    for (const dir of createdDirs) {
      if (await fs.pathExists(dir)) {
        const files = await fs.readdir(dir);
        if (files.length === 0) {
          await fs.remove(dir);
          logger.debug(`Removed empty directory: ${dir}`, true);
        }
      }
    }
    logger.success('Rollback complete.');
  }
};
