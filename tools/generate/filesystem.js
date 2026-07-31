"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesystem = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const prettier_1 = __importDefault(require("prettier"));
const logger_1 = require("./logger");
const renderer_1 = require("./renderer");
const writtenFiles = [];
const createdDirs = [];
exports.filesystem = {
    async generateFile(templatePath, destinationPath, data, context) {
        try {
            const templateContent = await fs_extra_1.default.readFile(templatePath, 'utf-8');
            let outputContent = (0, renderer_1.renderTemplate)(templateContent, data);
            if (destinationPath.endsWith('.ts') ||
                destinationPath.endsWith('.tsx') ||
                destinationPath.endsWith('.js')) {
                outputContent = await prettier_1.default.format(outputContent, {
                    parser: 'typescript',
                    singleQuote: true,
                    trailingComma: 'es5',
                });
            }
            const dir = path_1.default.dirname(destinationPath);
            logger_1.logger.debug(`Checking directory: ${dir}`, context.verbose);
            if (!(await fs_extra_1.default.pathExists(dir))) {
                if (!context.dryRun) {
                    await fs_extra_1.default.ensureDir(dir);
                    createdDirs.push(dir);
                }
                logger_1.logger.debug(`Created directory: ${dir}`, context.verbose);
            }
            if (await fs_extra_1.default.pathExists(destinationPath)) {
                if (!context.force) {
                    logger_1.logger.warn(`File already exists, skipping (use --force to overwrite): ${destinationPath}`);
                    return;
                }
                logger_1.logger.warn(`Overwriting existing file: ${destinationPath}`);
            }
            if (!context.dryRun) {
                await fs_extra_1.default.writeFile(destinationPath, outputContent, 'utf-8');
                writtenFiles.push(destinationPath);
            }
            if (context.dryRun) {
                logger_1.logger.success(`[DRY RUN] Generated: ${destinationPath}`);
            }
            else {
                logger_1.logger.success(`Generated: ${destinationPath}`);
            }
        }
        catch (error) {
            logger_1.logger.error(`Failed to generate file: ${destinationPath}`);
            logger_1.logger.error(error.message);
            throw error;
        }
    },
    async rollback() {
        logger_1.logger.info('Rolling back generated files...');
        for (const file of writtenFiles) {
            if (await fs_extra_1.default.pathExists(file)) {
                await fs_extra_1.default.remove(file);
                logger_1.logger.debug(`Removed file: ${file}`, true);
            }
        }
        // Sort dirs by length descending so deeper dirs are removed first
        createdDirs.sort((a, b) => b.length - a.length);
        for (const dir of createdDirs) {
            if (await fs_extra_1.default.pathExists(dir)) {
                const files = await fs_extra_1.default.readdir(dir);
                if (files.length === 0) {
                    await fs_extra_1.default.remove(dir);
                    logger_1.logger.debug(`Removed empty directory: ${dir}`, true);
                }
            }
        }
        logger_1.logger.success('Rollback complete.');
    }
};
