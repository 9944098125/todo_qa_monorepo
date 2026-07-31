import { Generator } from './types';
import { componentGenerator } from './generators/component';
import { pageGenerator } from './generators/page';
import { hookGenerator } from './generators/hook';
import { sliceGenerator } from './generators/slice';
import { apiGenerator } from './generators/api';
import { contextGenerator } from './generators/context';

const generatorsMap = new Map<string, Generator>();

export const registry = {
  register(generator: Generator) {
    generatorsMap.set(generator.name, generator);
  },

  get(name: string): Generator | undefined {
    return generatorsMap.get(name);
  },

  getAll(): Generator[] {
    return Array.from(generatorsMap.values());
  },
};

// Register all generators
registry.register(componentGenerator);
registry.register(pageGenerator);
registry.register(hookGenerator);
registry.register(sliceGenerator);
registry.register(apiGenerator);
registry.register(contextGenerator);
