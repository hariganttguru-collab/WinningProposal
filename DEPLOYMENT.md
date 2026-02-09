# Deploying to Azure Web App

## Prerequisites

- Azure account
- This repo connected to GitHub (e.g. `hariganttguru-collab/WinningProposal`)

## One-time Azure setup

1. **Create a Web App** (Azure Portal or CLI)
   - Runtime: **Node 20** (or 18) on Linux
   - Plan: Free (F1) or Basic

2. **Set startup command**
   - In the Web App: **Configuration** → **General settings**
   - Startup Command: `npm start`

3. **Get publish profile**
   - Web App → **Get publish profile** (download the `.PublishSettings` file)
   - Open it in a text editor and copy the entire contents

4. **Add GitHub secret**
   - Repo → **Settings** → **Secrets and variables** → **Actions**
   - **New repository secret**: name = `AZURE_WEBAPP_PUBLISH_PROFILE`, value = pasted publish profile content

5. **Set app name in workflow**
   - Edit `.github/workflows/azure-webapp.yml`
   - Replace `YOUR_APP_NAME` with your Azure Web App name (e.g. `winningproposal`)

## Deploy

- Push to the `main` branch. The GitHub Action will build and deploy to Azure.

## Local test before deploy

```bash
# From repo root (WinningProposal/)
npm run build
npm start
# Open http://localhost:8080
```
