# Cloudflare Workers Deployment Setup

This document explains how to set up automatic deployment to Cloudflare Workers through GitHub Actions.

## Prerequisites

1. A Cloudflare account with Workers enabled
2. Your Cloudflare Account ID
3. A Cloudflare API Token with Workers permissions

## Required GitHub Secrets

You need to add the following secrets to your GitHub repository:

### 1. `CLOUDFLARE_ACCOUNT_ID`

1. Log into your Cloudflare dashboard
2. Select your account
3. Find your Account ID on the right sidebar
4. Copy the Account ID

### 2. `CLOUDFLARE_API_TOKEN`

1. Go to Cloudflare Dashboard > My Profile > API Tokens
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template, or create a custom token with:
   - **Permissions:**
     - Account: Cloudflare Workers Scripts: Edit
     - Zone: Workers Routes: Edit (if using custom domains)
   - **Account Resources:**
     - Include: Your specific account
   - **Zone Resources (optional):**
     - Include: Specific zone (if using custom domain)
4. Click "Continue to summary"
5. Click "Create Token"
6. Copy the token (you won't be able to see it again!)

## Adding Secrets to GitHub

1. Go to your repository on GitHub
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each secret:
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: Your Account ID

   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: Your API Token

## How It Works

### Automatic Deployment

When you push to the `main` branch:

1. CI Pipeline runs tests and builds
2. If successful, the Cloudflare deployment workflow triggers
3. The app is built and deployed to Cloudflare Workers
4. The site is live at: https://tanstack-start-app.isaacgweber.workers.dev

### Manual Deployment

You can also trigger deployment manually:

1. Go to Actions tab in GitHub
2. Select "Deploy to Cloudflare Workers"
3. Click "Run workflow"
4. Select the branch to deploy
5. Click "Run workflow"

## Local Deployment

To deploy from your local machine:

```bash
cd apps/web-start
npm run build
npm run deploy
```

Note: For local deployment, you need to have `wrangler` configured with your Cloudflare credentials.

## Workflow File

The deployment workflow is defined in `.github/workflows/deploy-cloudflare.yml`

Key features:
- Triggers on push to `main` branch
- Can be manually triggered
- Builds the app in production mode
- Uses Cloudflare's official Wrangler GitHub Action
- Provides deployment summary with URL and commit info

## Troubleshooting

### Deployment Fails with Authentication Error

- Verify your API token has the correct permissions
- Check that the Account ID matches your Cloudflare account
- Ensure the secrets are named exactly as specified

### Build Fails

- Check the build logs in GitHub Actions
- Ensure all dependencies are installed (`npm ci`)
- Verify Prisma client generation succeeds

### Worker Size Limits

If you exceed Cloudflare's worker size limits:
- Review and optimize bundle size
- Consider code splitting
- Remove unnecessary dependencies

## Current Configuration

- **Worker Name**: tanstack-start-app
- **URL**: https://tanstack-start-app.isaacgweber.workers.dev
- **Compatibility Date**: 2024-10-01
- **Node Version**: 20
- **Build Command**: `npm run build --filter=web-start`
- **Deploy Command**: `wrangler deploy --compatibility-date 2024-10-01`