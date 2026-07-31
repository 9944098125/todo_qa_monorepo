"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TARGET_CHOICES = exports.PATHS = exports.workspaceRoot = void 0;
const path_1 = __importDefault(require("path"));
exports.workspaceRoot = path_1.default.resolve(__dirname, '../../');
exports.PATHS = {
    apps: {
        frontend: path_1.default.join(exports.workspaceRoot, 'apps/frontend'),
        backend: path_1.default.join(exports.workspaceRoot, 'apps/backend'),
    },
    packages: {
        ui: path_1.default.join(exports.workspaceRoot, 'packages/ui'),
        utils: path_1.default.join(exports.workspaceRoot, 'packages/utils'),
        types: path_1.default.join(exports.workspaceRoot, 'packages/types'),
        config: path_1.default.join(exports.workspaceRoot, 'packages/config'),
    },
    templates: path_1.default.join(__dirname, 'templates'),
};
exports.TARGET_CHOICES = [
    { name: 'Frontend (apps/frontend)', value: 'frontend' },
    { name: 'Backend (apps/backend)', value: 'backend' },
    { name: 'Shared UI (packages/ui)', value: 'packages/ui' },
    { name: 'Shared Utils (packages/utils)', value: 'packages/utils' },
    { name: 'Shared Types (packages/types)', value: 'packages/types' },
    { name: 'Shared Config (packages/config)', value: 'packages/config' },
];
