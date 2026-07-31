"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTargetPath = resolveTargetPath;
exports.buildContext = buildContext;
exports.getAvailablePages = getAvailablePages;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_1 = require("./config");
function resolveTargetPath(options, answers, defaultSharedTarget = 'packages/ui') {
    const target = options.shared ? defaultSharedTarget : answers.target || 'frontend';
    if (target === 'frontend')
        return config_1.PATHS.apps.frontend;
    if (target === 'backend')
        return config_1.PATHS.apps.backend;
    if (target === 'packages/ui')
        return config_1.PATHS.packages.ui;
    if (target === 'packages/utils')
        return config_1.PATHS.packages.utils;
    if (target === 'packages/types')
        return config_1.PATHS.packages.types;
    if (target === 'packages/config')
        return config_1.PATHS.packages.config;
    return config_1.PATHS.apps.frontend;
}
function buildContext(options) {
    return {
        cwd: process.cwd(),
        dryRun: !!options.dryRun,
        force: !!options.force,
        verbose: !!options.verbose,
    };
}
function getAvailablePages() {
    const pagesDir = path_1.default.join(config_1.PATHS.apps.frontend, 'src/app/pages');
    try {
        if (!fs_extra_1.default.existsSync(pagesDir))
            return [];
        return fs_extra_1.default
            .readdirSync(pagesDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
    }
    catch (e) {
        return [];
    }
}
