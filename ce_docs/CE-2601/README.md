# CE-Explore plugin for Kubernetes cluster monitoring

-> [Jira link](https://jira.axway.com/browse/CE-2601)

The installation and configuration of this plugin is quite straight forward and requires 3 steps:

## 1: Create frontend plugin

From the backstage root dir:

````console
yarn --cwd packages/app add @backstage/plugin-kubernetes
````

Then in packages/app/src/components/catalog/EntityPage.tsx add an regarding Entity block:

```JSX
<EntityLayout.Route path="/kubernetes" title="Kubernetes">
      <EntityKubernetesContent refreshIntervalMs={30000} />
</EntityLayout.Route>
```

## 2: Create backend plugin


From the backstage root dir:

```console
yarn --cwd packages/backend add @backstage/plugin-kubernetes-backend
```

Create packages/backend/src/plugins/kubernetes.ts with the following content:

```typescript
mport { Router } from 'express';
import { PluginEnvironment } from '../types';
import { CatalogClient } from '@backstage/catalog-client';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogApi = new CatalogClient({ discoveryApi: env.discovery });
  const { router } = await KubernetesBuilder.createBuilder({
    logger: env.logger,
    config: env.config,
    catalogApi,
    discovery: env.discovery,
    permissions: env.permissions,
  }).build();
  return router;
}
```

In packages/backend/src/index.ts add the regarding lines.

Add the required import:

```typescript
import kubernetes from './plugins/kubernetes';
```

Add to main function:

```typescript
 const kubernetesEnv = useHotMemoize(module, () => createEnv('kubernetes'));

 apiRouter.use('/kubernetes', await kubernetes(kubernetesEnv));
```

# 3. add configuration to use the k8s plugin

In the app-config.yaml add a kubernetes block (example block for a local minukube test cluster, please adapt):

```yaml
---
kubernetes:
  serviceLocatorMethod:
    type: 'multiTenant'
  clusterLocatorMethods:
    - type: 'config'
      clusters:
        - url: https://192.168.49.2:8443
          name: minikube
          authProvider: 'serviceAccount'
          skipTLSVerify: true
          skipMetricsLookup: true
          serviceAccountToken: ${K8S_MINIKUBE_TOKEN}
          dashboardUrl:  http://127.0.0.1:44131
          dashboardApp: standard
```

Please note that (in this example) the environment variable K8S_MINIKUBE_TOKEN must be set for authentification. You can create it by:

```console
kubectl create token SERVICE_ACCOUNT_NAME
```

To be abble to add the desired k8s services etc. using the backstage "Add existing component" a public(!) readable Git URL (Github, Gitlab etc.)
must exist with at least a catalog-info.yaml at the top level. For a (here used) example component the content could be:

```yaml
---
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  annotations:
    backstage.io/kubernetes-id: my-kubernetes-component
  name: my-kubernetes-component
spec:
  lifecycle: production
  owner: my-team
  type: service
```

Hint: To add more ressources it is required to have one yaml for each instead a single yaml with multiple blocks.

The used annotation (here: "my-kubernetes-component") must be the same as used in the actual kubernetes service.

# 4. Add the new component

In the backstage URL then you can then actually add the functionality by "Add existing API" and specifying the yaml URL (e.g. from GitHub).

It should now appear under the "Kubernetes" tab.


# Open problems

- The kubernetes plugin shows "OK" for the CPU's but with status "Unknown". We must find out how to fix this (perhaps by evaluating the plugin code).
- In the current model there is only one cluster with a single component to be monitored.
