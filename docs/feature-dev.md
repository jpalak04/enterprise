# Contributing to the Axway Developer Portal

If you want to contribute a new plugin or just play around

## Getting Started

### Cloning the Repository

To start contributing, first clone the repository:

```bash
git clone https://git.ecd.axway.org/sre/self_service_portal/devops-portal
```

### Backstage Documentation

For detailed guidance on plugin development and utilizing storybooks in Backstage, refer to the following resources:
- [Backstage Plugin Development](https://backstage.io/docs/plugins/create-a-plugin)
- [Storybook in Backstage](https://backstage.io/storybook)

## Development Workflow

### Creating a Feature Branch

1. Create your own feature branch:
   ```bash
   git checkout -b your-feature-name
   ```
2. Make your changes in this branch.

**Note:** Only use "-" to separate branch terms. (ex: "your-feautre-name" **NOT** "your_feature_name")

### Local Testing

**Prerequisites:**
- docker (recommended for easy postgres integration, but not required)
- node v18 
- yarn
- [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) optional but helpful. for example,
```bash
nvm install v18.16.1
nvm use v18.16.1
```

1. Set up a local `.env` file with the necessary environment variable exports. 
2. Run `source .env` to export your environment variables

#### Required Environment Variables for Minimum Local

If you are just wanting to play around and don't need the full feature set:

| Variable          | Description                                           | Example Value                  |
|-------------------|-------------------------------------------------------|--------------------------------|
| `GITLAB_TOKEN`    | Your GitLab Personal Access Token                     | `<Your PAT>`                   |
| `APP_BASE_URL`    | Base URL for the app                                  | `http://localhost:7000`        |
| `BACKEND_BASE_URL` | Base URL for the backend                            | `http://localhost:8008`        |
| `BACKEND_PORT`    | Port for the backend                                  | `8008`                         |
| `LOG_LEVEL`       | Logging level                                         | `debug`                        |

**Note** You will need to create a file app-config.local.yaml with the following:

```yaml 
backend:
  database:
    client: better-sqlite3
    connection: ':memory:'
auth:
  environment: local
  providers: {}
```

#### Required Environment Variables for Full Features

Here is a table of required environment variables for local development:

| Variable          | Description                                           | Example Value                  |
|-------------------|-------------------------------------------------------|--------------------------------|
| `POSTGRES_HOST`   | Hostname for the PostgreSQL server                    | `localhost`                    |
| `POSTGRES_PORT`   | Port for the PostgreSQL server                        | `5432`                         |
| `POSTGRES_USER`   | PostgreSQL username                                   | `<username>`                   |
| `POSTGRES_PASSWORD` | PostgreSQL password                                 | `<password>`                   |
| `AZ_CLIENT_ID`    | Azure Client ID (from Axway-Developer-Portal)         | `<Azure Client ID>`            |
| `AZ_CLIENT_SECRET` | Azure Client Secret (from Axway-Developer-Portal)   | `<Azure Client Secret>`        |
| `AZ_TENANT_ID`    | Azure Tenant ID (from Axway-Developer-Portal)         | `<Azure Tenant ID>`            |
| `AZ_DOMAIN_HINT`  | Azure Domain Hint (from Axway-Developer-Portal)       | `<Azure Domain Hint>`          |
| `GITHUB_TOKEN`    | Your GitHub Personal Access Token                     | `<Your PAT>`                   |
| `GITLAB_TOKEN`    | Your GitLab Personal Access Token                     | `<Your PAT>`                   |
| `APP_BASE_URL`    | Base URL for the app                                  | `http://localhost:7000`        |
| `BACKEND_BASE_URL` | Base URL for the backend                            | `http://localhost:8008`        |
| `BACKEND_PORT`    | Port for the backend                                  | `8008`                         |
| `LOG_LEVEL`       | Logging level                                         | `debug`                        |

3. Setup the database. Be sure that the env variables reflect the appropriate authentication credentials you've setup for PostgresSQL. Below is an example for using docker compose to setup the postgres instance

#### Example Docker Compose for PostgreSQL

For local database setup, you can use Docker Compose:

```yaml
version: '3.8'

services:
  db:
    image: postgres:12
    environment:
      POSTGRES_USER: backstage
      POSTGRES_PASSWORD: backstage1234
      POSTGRES_DB: backstage
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

4. Run `yarn intall`
5. Run `yarn dev` to start the development server.

### Validte against running sandbox environment

In order to validate your changes are working as expected via helm in kubernetes. Use the [Sandbox environment](./sandbox.md).


### Submitting Your Work

Once you are satisfied with your changes:

1. Push your changes to the remote repository.
2. Submit a pull request for review and integration into the main branch.

### Miscelaneoud Troubleshooting tips
If you encounter the following error
```
 Attempted import error: 'useSyncExternalStore' is not exported from 'react' (imported as 'React2').
cd packages/app
yarn add react@latest react-dom@latest
```


