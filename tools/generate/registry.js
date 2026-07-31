"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registry = void 0;
const component_1 = require("./generators/component");
const page_1 = require("./generators/page");
const hook_1 = require("./generators/hook");
const slice_1 = require("./generators/slice");
const api_1 = require("./generators/api");
const context_1 = require("./generators/context");
const generatorsMap = new Map();
exports.registry = {
    register(generator) {
        generatorsMap.set(generator.name, generator);
    },
    get(name) {
        return generatorsMap.get(name);
    },
    getAll() {
        return Array.from(generatorsMap.values());
    },
};
// Register all generators
exports.registry.register(component_1.componentGenerator);
exports.registry.register(page_1.pageGenerator);
exports.registry.register(hook_1.hookGenerator);
exports.registry.register(slice_1.sliceGenerator);
exports.registry.register(api_1.apiGenerator);
exports.registry.register(context_1.contextGenerator);
