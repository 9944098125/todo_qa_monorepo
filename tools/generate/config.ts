import path from 'path';

export const workspaceRoot = path.resolve(__dirname, '../../');

export const PATHS = {
  apps: {
    frontend: path.join(workspaceRoot, 'apps/frontend'),
    backend: path.join(workspaceRoot, 'apps/backend'),
  },
  packages: {
    ui: path.join(workspaceRoot, 'packages/ui'),
    utils: path.join(workspaceRoot, 'packages/utils'),
    types: path.join(workspaceRoot, 'packages/types'),
    config: path.join(workspaceRoot, 'packages/config'),
  },
  templates: path.join(__dirname, 'templates'),
};

export const TARGET_CHOICES = [
  { name: 'Frontend (apps/frontend)', value: 'frontend' },
  { name: 'Backend (apps/backend)', value: 'backend' },
  { name: 'Shared UI (packages/ui)', value: 'packages/ui' },
  { name: 'Shared Utils (packages/utils)', value: 'packages/utils' },
  { name: 'Shared Types (packages/types)', value: 'packages/types' },
  { name: 'Shared Config (packages/config)', value: 'packages/config' },
];
