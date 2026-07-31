# 🚀 Converting Existing React & Node.js Projects into a PNPM Monorepo

This guide explains how to convert multiple existing repositories (React, Node.js, etc.) into a single **PNPM Workspace Monorepo** without losing project history or code.

---

# 📂 Example

### Before

```text
Frontend/
Backend/
Admin/
```

or

```text
TodoQa/
├── todo_qa_frontend
├── todo_admin
└── todo_backend
```

---

### After

```text
TodoQa/
│
├── apps/
│   ├── frontend/
│   ├── admin/
│   └── backend/
│
├── packages/
│
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── README.md
```

---

# Prerequisites

- Node.js >= 20
- PNPM >= 9

Install PNPM globally if not already installed.

```bash
npm install -g pnpm
```

Verify installation.

```bash
pnpm -v
```

---

# Step 1 - Create the Monorepo Root

```bash
mkdir TodoQa
cd TodoQa
```

Initialize the root package.

```bash
pnpm init
```

---

# Step 2 - Create Workspace Folders

```bash
mkdir apps
mkdir packages
```

Your structure should now be

```text
TodoQa/
├── apps/
├── packages/
└── package.json
```

---

# Step 3 - Move Existing Projects

Move your projects into the `apps` directory.

Example:

```text
TodoQa/
│
├── apps/
│   ├── todo_qa_frontend/
│   ├── todo_admin/
│   └── todo_backend/
```

---

# Step 4 - Create pnpm Workspace

Create

```
pnpm-workspace.yaml
```

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

# Step 5 - Configure Root package.json

Example:

```json
{
	"name": "todoqa",
	"private": true,
	"packageManager": "pnpm@10",
	"scripts": {
		"dev": "pnpm -r dev",
		"build": "pnpm -r build",
		"lint": "pnpm -r lint",
		"test": "pnpm -r test"
	}
}
```

**Important**

`private` **must** be `true`.

---

# Step 6 - Remove Existing Lock Files

Delete the following from every application.

```
node_modules
package-lock.json
yarn.lock
```

Do **not** keep multiple lock files.

Only the workspace root should contain

```
pnpm-lock.yaml
```

---

# Step 7 - Install Dependencies

From the root

```bash
pnpm install
```

PNPM will

- Install dependencies
- Create symlinks
- Generate a single lockfile
- Link workspace packages

---

# Step 8 - Verify Workspace

Run

```bash
pnpm list -r --depth=-1
```

Example

```
todoqa
frontend
backend
admin
```

---

# Step 9 - Ensure Each Project Has Scripts

Each project must have its own scripts.

Example React project

```json
{
	"scripts": {
		"dev": "vite",
		"build": "vite build",
		"preview": "vite preview"
	}
}
```

CRA example

```json
{
	"scripts": {
		"dev": "react-scripts start",
		"build": "react-scripts build"
	}
}
```

Node.js example

```json
{
	"scripts": {
		"dev": "tsx watch src/index.ts",
		"build": "tsc",
		"start": "node dist/index.js"
	}
}
```

---

# Step 10 - Run Applications

Run every application

```bash
pnpm dev
```

Run only frontend

```bash
pnpm --filter frontend dev
```

Run only backend

```bash
pnpm --filter backend dev
```

Run only admin

```bash
pnpm --filter admin dev
```

---

# Step 11 - Finding Package Names

Workspace filters use the **package name**, not the folder name.

Check package names.

```bash
pnpm list -r --depth=-1
```

Example

```
backend
frontend
admin
```

Run

```bash
pnpm --filter backend dev
```

NOT

```bash
pnpm --filter apps/backend dev
```

---

# Step 12 - Installing Dependencies

Install in a specific workspace

```bash
pnpm --filter frontend add axios
```

Development dependency

```bash
pnpm --filter backend add -D tsx
```

Install inside a directory

```bash
pnpm --dir apps/frontend add axios
```

Install in the root workspace

```bash
pnpm add -Dw turbo
```

---

# Step 13 - Shared Packages

Create

```text
packages/
├── ui/
├── types/
├── utils/
├── hooks/
└── config/
```

Example

```
packages/ui
```

```
src/
    Button.tsx
```

Import

```tsx
import { Button } from "@todo/ui";
```

---

# Step 14 - Common Commands

Install everything

```bash
pnpm install
```

Run every app

```bash
pnpm dev
```

Run build

```bash
pnpm build
```

Run lint

```bash
pnpm lint
```

Run tests

```bash
pnpm test
```

Update dependencies

```bash
pnpm update -r
```

Clean install

```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

---

# Common Errors

## None of the selected packages has a "dev" script

Cause

The package does not contain

```json
{
	"scripts": {
		"dev": "..."
	}
}
```

Fix

Add a `dev` script to the application's `package.json`.

---

## No projects matched the filters

Cause

The filter uses the package name.

Incorrect

```bash
pnpm --filter todo-backend
```

Correct

```bash
pnpm --filter backend
```

Verify names

```bash
pnpm list -r --depth=-1
```

---

## Cannot find module

Example

```
Cannot find module '@radix-ui/react-slot'
```

Fix

Install the missing dependency in the correct workspace.

```bash
pnpm --filter frontend add @radix-ui/react-slot
```

or

```bash
pnpm --dir apps/frontend add @radix-ui/react-slot
```

---

## Workspace Not Detected

Check

```
pnpm-workspace.yaml
```

Should be

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Then run

```bash
pnpm install
```

---

# Recommended Production Structure

```text
TodoQa/
│
├── apps/
│   ├── frontend/
│   ├── admin/
│   └── backend/
│
├── packages/
│   ├── ui/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── config/
│   └── constants/
│
├── .github/
├── .husky/
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
├── tsconfig.base.json
└── README.md
```

---

# Recommended Tech Stack

## Frontend

- React 19
- Vite
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Redux Toolkit
- RTK Query
- React Router
- React Hook Form
- Zod
- Axios
- Sonner
- Lucide React

## Backend

- Node.js
- Express
- TypeScript
- Prisma or Mongoose
- JWT
- Zod
- tsx
- ESLint
- Prettier

## Monorepo

- PNPM Workspaces
- Turborepo
- Husky
- lint-staged
- Commitlint
- GitHub Actions

---

# Best Practices

- Use a single `pnpm-lock.yaml` at the root.
- Keep shared code in `packages/` rather than duplicating it.
- Install dependencies in the specific workspace unless they are truly shared tooling.
- Use package names with `--filter`, not folder names.
- Prefer Vite over Create React App for new or modernized React applications.
- Run `pnpm install` only from the workspace root after adding or moving packages.
