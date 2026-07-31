# @todo_qa/ui

Shared reusable React components for the monorepo.

## Purpose
This package contains UI primitives (e.g., Button, Input, Modal, Dialog, Card) that can be shared across multiple frontend applications.

## When to use it
- When creating a generic, reusable UI component that has no feature-specific business logic.
- When generating a shared component using `pnpm generate component [Name] --shared`.

## When NOT to use it
- Do not put feature-specific components here. Feature components should go into `apps/frontend/src/features/[featureName]/components/`.
