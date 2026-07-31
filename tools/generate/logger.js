"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.logger = {
    info: (msg) => console.log(chalk_1.default.blue('ℹ'), msg),
    success: (msg) => console.log(chalk_1.default.green('✔'), msg),
    warn: (msg) => console.log(chalk_1.default.yellow('⚠'), msg),
    error: (msg) => console.log(chalk_1.default.red('✖'), chalk_1.default.red(msg)),
    debug: (msg, verbose = false) => {
        if (verbose) {
            console.log(chalk_1.default.gray('🔍'), chalk_1.default.gray(msg));
        }
    },
};
