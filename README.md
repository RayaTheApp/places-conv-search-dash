
# Conversation Evaluation Dashboard

This is a code bundle for Conversation Evaluation Dashboard. The original project is available at https://www.figma.com/design/IIYQBc2bUucZ7lqJx1t4vA/Conversation-Evaluation-Dashboard.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3003/` (or the next available port if 3003 is in use).

## Troubleshooting

### SWC Native Binding Error

If you encounter an error like `Failed to load native binding` when running the dev server, this is related to the `@vitejs/plugin-react-swc` plugin. To fix:

1. Update `vite.config.ts` to use the regular React plugin instead:
   ```typescript
   import react from '@vitejs/plugin-react';
   ```
   Instead of:
   ```typescript
   import react from '@vitejs/plugin-react-swc';
   ```

2. Make sure `@vitejs/plugin-react` is installed:
   ```bash
   npm install @vitejs/plugin-react
   ```

3. Restart the dev server

## Development

- The project uses Vite + React + TypeScript
- UI components are built with Radix UI and Tailwind CSS
- Development server runs on port 3003 by default

## Git Setup

The repository is configured with a `.gitignore` file that excludes:
- `node_modules/`
- Build outputs (`build/`, `dist/`)
- Environment files
- Editor configurations
- `.claude/` directory
