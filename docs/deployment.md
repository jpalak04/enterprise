# Deployment to Kubernetes
If you are working on kubernetes related tasks or need to make changes to flux in an isolated evironment, you may wish to use your own pCloud cluster or perhaps minikube or similar. We use helm for the deployments.

## Helm Charts

The charts can be found [here](../charts/)

## Helm Template Configuration

The values below will need to be prvided via secret or values file overrides.

| Key                  | Value Placeholder         | Description                                                                                     |
|----------------------|---------------------------|-------------------------------------------------------------------------------------------------|
| `image.repository`   | `{{ .Values.image.repository }}` | The Docker image repository for the `ce-developer-portal` container.                             |
| `image.tag`          | `{{ .Values.image.tag }}` | The tag of the Docker image to be pulled for the `ce-developer-portal` container.               |
| `service.port`       | `{{ .Values.service.port }}` | The port that the `ce-developer-portal` container should expose.                                |
| `POSTGRES_USER`      | From Secret `ce-portal-creds`: `POSTGRES_USER` | The username for PostgreSQL authentication, retrieved from the secret `ce-portal-creds`.        |
| `POSTGRES_PASSWORD`  | From Secret `ce-portal-creds`: `POSTGRES_PASSWORD` | The password for PostgreSQL authentication, retrieved from the secret `ce-portal-creds`.        |
| `GITHUB_TOKEN`       | From Secret `ce-portal-creds`: `GITHUB_TOKEN` | The GitHub token used for authentication, retrieved from the secret `ce-portal-creds`.          |
| `POSTGRES_DB`        | From Secret `ce-portal-creds`: `POSTGRES_DB` | The name of the PostgreSQL database, retrieved from the secret `ce-portal-creds`.               |
| `PLUGIN_DIVISION_MODE` | From Secret `ce-portal-creds`: `PLUGIN_DIVISION_MODE` | The mode for plugin division in Backstage, retrieved from the secret `ce-portal-creds`.         |
| `POSTGRES_HOST`      | From Secret `ce-portal-creds`: `POSTGRES_HOST` | The hostname or IP of the PostgreSQL server, retrieved from the secret `ce-portal-creds`.       |
| `POSTGRES_PORT`      | From Secret `ce-portal-creds`: `POSTGRES_PORT` | The port for the PostgreSQL server, retrieved from the secret `ce-portal-creds`.                |
| `BACKEND_PORT`       | From Secret `ce-portal-creds`: `BACKEND_PORT` | The port for the Backstage backend, retrieved from the secret `ce-portal-creds`.                |
| `APP_BASE_URL`       | From Secret `ce-portal-creds`: `APP_BASE_URL` | The base URL for the application, retrieved from the secret `ce-portal-creds`.                  |
| `BACKEND_BASE_URL`   | From Secret `ce-portal-creds`: `BACKEND_BASE_URL` | The base URL for the Backstage backend, retrieved from the secret `ce-portal-creds`.            |
| `AZ_CLIENT_ID`       | From Secret `ce-portal-creds`: `AZ_CLIENT_ID` | The Azure Client ID for authentication, retrieved from the secret `ce-portal-creds`.            |
| `AZ_CLIENT_SECRET`   | From Secret `ce-portal-creds`: `AZ_CLIENT_SECRET` | The Azure Client Secret for authentication, retrieved from the secret `ce-portal-creds`.        |
| `AZ_TENANT_ID`       | From Secret `ce-portal-creds`: `AZ_TENANT_ID` | The Azure Tenant ID, retrieved from the secret `ce-portal-creds`.                               |
| `AZ_DOMAIN_HINT`     | From Secret `ce-portal-creds`: `AZ_DOMAIN_HINT` | The Azure Domain Hint, retrieved from the secret `ce-portal-creds`.                             |
| `LOG_LEVEL`          | `{{ .Values.app.logLevel }}` | The logging level for the `ce-developer-portal` application.                                    |
| `image.secret`       | `{{ .Values.image.secret }}` | The name of the Kubernetes secret used for pulling images from a private Docker registry.       |

## Helm Direct
You can run helm directly against your kubectx or use flux if you wish. 

**Note:** For flux, you will need to perform all of the setup steps for flux-system and agents within your cluster and gitlab

### Dry Run Example
With your kubeconfig pointed to the appropriate environment, simply run:
```bash
 helm install developer-portal ./developer-portal/ --dry-run -f values.yaml -f values.mycustom.yaml
 ```
 Once you are satisfied with the helm manifest that the dry-run reveals, you can simply install.
 
 ## Managed Environmnets

 Dev, Stage and Prod are already in place and are managed by Flux. See this [repo for more details](https://git.ecd.axway.org/sre/self_service_portal/flux-deployments)
