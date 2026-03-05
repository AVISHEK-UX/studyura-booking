

## Create Render Blueprint Configuration

### Changes

1. **Create `/render.yaml`** at the project root with this content:

```yaml
services:
  - type: web
    name: studyura
    env: node
    plan: free
    buildCommand: npm ci && npm run build
    startCommand: npm run preview -- --host 0.0.0.0 --port $PORT
```

Note: Using `npm ci && npm run build` as the build command since Render needs to build the production assets first, then `npm run preview` serves them.

2. **Verify `package.json`** — both `build` and `preview` scripts already exist, no changes needed.

That is the only file change required. Once pushed to the main branch via GitHub sync, retry the Render Blueprint deployment.

