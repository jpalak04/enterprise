
# Release Notes
The following represent the changes made for the release 0.1.1

## Change Log

### `.gitignore`
- **Addition**: A new line `local-scripts/` was added to the `.gitignore` file, meaning files within the `local-scripts/` directory will be ignored by Git.

### `.gitlab-ci.yml` (New File)
- **New CI/CD Configuration**: A new `.gitlab-ci.yml` file was created for GitLab CI/CD pipelines. Key configurations include:
  - Docker image specification (`node:16`).
  - Caching for `node_modules/`.
  - Several environment variables defined.
  - Multiple stages for CI/CD pipeline (`install`, `compile`, `build`, `push`, `charts`).
  - Various scripts and settings for each stage, particularly focusing on building and pushing Docker images and Helm charts.

### `Dockerfile`
- **Modification**: The `Dockerfile` was updated to:
  - Install `node-gyp` globally.
  - Change the installation process for sqlite3 dependencies.
  - Modify the command to execute the backend (`chmod +x packages/backend` added).

### `Dockerfile-test` (New File)
- **New Dockerfile for Testing**: This new file sets up a Docker environment based on `node:18-alpine` for testing purposes.

### `README.md`
- **Overhaul**: The `README.md` file was significantly expanded to include:
  - An introduction to the Self Service Developer Portal.
  - Descriptions of different environments (Development, Staging, Production).
  - Details of the build process, including Docker images and Helm charts.
  - Deployment information using Flux.
  - Getting started guide and support information.

### `amplify/amplify-extra.yaml`
- **Addition**: New components added to the YAML file, including `dora-dashboard` with various links and specifications.

### `app-config.dev.yaml`, `app-config.docker.yaml`, `app-config.yaml`
- **Configuration Changes**: These files saw various changes in application and backend configuration, such as:
  - Update in `app` titles and `baseUrl`.
  - Modifications in backend configurations like `baseUrl`, `listen`, and `database` settings.
  - Introduction of Azure AD authentication settings in `app-config.yaml`.

### `charts/developer-portal/templates/deployment.yaml`, `charts/developer-portal/values.yaml`
- **Helm Chart Updates**: Modifications in Helm chart templates and values, including:
  - Changes in environment variable settings.
  - Update in Docker image repository and tag.
  - Adjustment in log level settings.

### `charts/postgres/templates/deployment.yaml`
- **Postgres Helm Chart Update**: Changes in the environment variables, particularly pulling values from `ce-portal-creds` secret.

### `packages/app/src/App.tsx`
- **SignInPage Integration**: Added custom `SignInPage` component with providers for GitHub and Azure AD authentication.

### `packages/app/src/components/signin/identityProviders.ts` (New File)
- **Authentication Providers**: Defines authentication providers for GitHub and Azure AD in a new file.

### `packages/backend/src/plugins/auth.ts`
- **Authentication Plugin Updates**: Significant changes in the backend authentication plugin to integrate GitHub and Microsoft sign-in, including custom sign-in resolver logic for Microsoft authentication.

These changes collectively suggest a significant update in the application, focusing on CI/CD pipeline setup, Docker configurations, Azure AD integration for authentication, and updates to deployment configurations and documentation.