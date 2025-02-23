# UI Experiments

**AI Chat Demo:** [https://ui-experiment-02.vercel.app/](https://ui-experiment-02.vercel.app/)

**Dark Table Demo:** [https://ui-experiments-green.vercel.app/](https://ui-experiments-green.vercel.app/)

# shadcn/ui monorepo template

This template is for creating a monorepo with shadcn/ui.

## Usage

```bash
pnpm dlx shadcn@latest init
```

## Adding components

To add components to your app, run the following command at the root of your `experiment-01` app:

```bash
pnpm dlx shadcn@latest add button -c apps/experiment-01
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/ui/button";
```
