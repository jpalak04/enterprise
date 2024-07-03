# Sandbox Environemnts for Self Service Developer Portal

## Prerequisites
- Ensure you have access to the Kubernetes cluster and the necessary permissions to create resources in a new namespace.
- Have `kubectl` and `helm` installed and configured to interact with your Kubernetes cluster.
- Also install `kubectx`, `kubens` to help manage the switching between different k8s environments
- Nice to have is `k9s` for easy monitoriing of a running kubernetes cluster
- Ensure you have access to the Git repository containing the application code and configuration.
- Kubecontext for the DEV environment

## Updating the Application Version
make sure you clone the git repo for flux deployments. 

[Flux Dev and Sandbox Manaifests](https://git.ecd.axway.org/sre/self_service_portal/flux-deployments/-/tree/dev/clusters/self-service-portal-dev?ref_type=heads)

The Flux agent for Dev and Sandox works off of the "dev" branch. 

`git checkout dev`

The application version is controlled by two parameters in the HelmRelease manifest: the chart version and the image tag. To deploy a new version of the application, you will need to update these parameters.

### 1. Update the Chart Version

The chart version determines which version of the Helm chart to use. It's specified under `spec.chart.spec.version`.

**Example:**

```yaml
spec:
  chart:
    spec:
      version: "0.1.0-helm-verify" # Update this version as needed
```

**To update the chart version:**

1. Locate the `HelmRelease` manifest for the CE Developer Portal.
2. Under `spec.chart.spec`, update the `version` field with the new chart version.
3. Save the changes.

### 2. Update the Image Tag

The image tag specifies which version of the container image to deploy. It's defined under `spec.values.image.tag`.

**Example:**

```yaml
values:
  image:
    tag: 0.1.0-helm-verify # Update this tag as needed
```

**To update the image tag:**

1. In the same `HelmRelease` manifest, locate the `spec.values.image` section.
2. Update the `tag` field with the new image version.
3. Save the changes.

**Note:** The chart and image versions are currently bundled and released as part of the same pipeline, so the version will typically be the same. However, this is not a guarantee, in the future, so it is a good practice to pay attention to both the chart and image. For example. if the helm chart remains static you could keep the chart version at `0.1.0-helm-verify` and bump the image version to a new feature `0.1.0-new-feature` and it would still deploy the new container without issue.
(helm-verify and new-feature or presented as examples)

### 3. Apply the Changes

Push the changes for the specific deployment and flux should take care of it if all is correctly configured

### 4. Verify the Deployment

Monitor the deployment process. Ensure that the new version is deployed successfully and is running without issues.


## Troubleshooting

# Troubleshooting Deployment with Flux and Helm in Kubernetes

When deploying applications in a Kubernetes environment using Flux and Helm, it's essential to know how to check the status of your deployments and troubleshoot any issues that may arise. The following instructions will guide you through the process of monitoring and troubleshooting your HelmRelease deployments in a specified `<sandbox-name>` namespace.

## Prerequisites

- Ensure `kubectl` and `flux` CLI tools are installed and configured.
- You should have the necessary permissions to view resources and logs in the specified namespace.

## Checking Deployment Status

1. **Check the HelmRelease Status**

   To check the status of your HelmRelease, use the Flux CLI:

   ```bash
   flux get helmreleases --namespace=<sandbox-name>
   ```

   Replace `<sandbox-name>` with your actual namespace. This command provides a summary of all the HelmReleases in the specified namespace, including their revision, conditions, and last applied revision.

2. **Check Individual Resource Status**

   To get more detailed information about specific resources (like Pods, Deployments, Services, etc.) within the HelmRelease, use `kubectl`:

   ```bash
   kubectl get all --namespace=<sandbox-name>
   ```

   This command lists all the resources in the specified namespace, allowing you to quickly spot any resources that are not in the desired state.

3. **Describe Resources**

   If a particular resource is not behaving as expected, use the `describe` command to get more detailed information:

   ```bash
   kubectl describe <resource-type>/<resource-name> --namespace=<sandbox-name>
   ```

   Replace `<resource-type>` and `<resource-name>` with the actual type and name of the resource you wish to inspect (e.g., `pod/my-pod-name`).

## Troubleshooting and Verification Issues

1. **Check HelmRelease Events**

   Flux logs important events for each HelmRelease, which can be useful for troubleshooting:

   ```bash
   flux get events --kind=HelmRelease --namespace=<sandbox-name>
   ```

   Look for any errors or issues in the events that might indicate what's going wrong.

2. **Check Flux Logs**

   If you suspect an issue with the Flux system itself, check the logs of the Flux controllers:

   ```bash
   kubectl logs -n flux-system deploy/flux-controller
   ```

3. **Check Application Logs**

   Application logs can provide insight into runtime issues:

   ```bash
   kubectl logs <pod-name> --namespace=<sandbox-name>
   ```

   Replace `<pod-name>` with the name of the pod you're investigating.

4. **Check Helm Status**

   To see the status of the Helm release managed by Flux, you can use the Helm CLI:

   ```bash
   helm status <release-name> --namespace=<sandbox-name>
   ```

   Replace `<release-name>` with the name of your Helm release.

5. **Reconciliation Details**

   If the HelmRelease is not getting applied or you suspect a reconciliation issue, check the reconciliation details:

   ```bash
   flux get hr <release-name> --namespace=<sandbox-name> --with-source
   ```

For more detailed documentation on Flux, refer to the official documentation:

- [Flux Documentation](https://fluxcd.io/docs/)


2. **Verify Deployment**
Verify that the application is running correctly in the `ce-developer-portal-sandbox-1` namespace.

3. **Check Pods, Services, and Ingress:**
   Ensure that the pods are running, services are correctly set up, and ingress is properly configured.

    ```bash
    kubectl get all -n ce-developer-portal-sandbox-1
    ```

4. **Access the Application:**
   Access the application through the ingress host `<domain-environment>.devo.axway.int`.

   The domain environment is set within the helm values file that was provided in the setup. For example,

   ```
   ingress:
     host: sandbox.devo.axway.int
   ```


## Setting Up a New Sandbox Environment in Kubernetes

### Overview
This guide will walk you through setting up a new sandbox environment for the Developer Portal application built on Backstage. We will use namespace separation in Kubernetes to isolate the sandbox environment from other environments.

### Prerequisites
- Ensure you have access to the Kubernetes cluster and the necessary permissions to create resources in a new namespace.
- Have `kubectl` and `helm` installed and configured to interact with your Kubernetes cluster.
- Also install `kubectx` and `kubens` to help manage the switchin between different k8s environments
- Ensure you have access to the Git repository containing the application code and configuration.
- Kubecontext for the DEV environment 

### 1. Create a New Sandbox Database Role for Postgres DB

The database is shared in DEV and uses datbase prefix in backstage to isolate access across environments

```
CREATE ROLE <sandbox user> WITH LOGIN PASSWORD '<sandbox password>';
alter role <sandbox user>  CREATEDB;
```

### 2. Create a New Sandbox Configuration File
Create a `app-config.<sandbox-name>.yaml` with the specific configurations for your sandbox environment.

```yaml
# Backstage override configuration for your sandbox development environment
app:
  title: Axway R&D and Operations Backstage App-Sandbox

backend:
  database:
    prefix: backstage_<sandbox-name>_
```
The above configuration will use a Backstage option to use a prefix for table creation to help segregate environments

### 3. Update Helm Chart for the Sandbox Environment
1. **Update Chart Version:**
   In `charts/developer-portal/Chart.yaml`, increment the version number (e.g., from `0.1.0` to `0.2.0`).
   This may or may not be necessary, depending on your version scheme

2. **Update Service Configuration:**
   In `charts/developer-portal/templates/service.yaml`, add a conditional block to configure the `postgresql` service specifically for the sandbox environment.

3. **Create `values.<sandbox-name>.yaml`:**
   Create a new `charts/developer-portal/values.<sandbox-name>.yaml` file to hold the values specific to the sandbox environment, such as ingress host, environment name, and log level.

### 4. Deploy to Kubernetes
After making the necessary changes and merging them to the appropriate branch, your CI/CD pipeline should trigger, building and pushing the Docker image, and packaging and pushing the Helm chart.

1. **Ensure Namespace Exists:**
   Create the `ce-developer-portal-sandbox-1` namespace if it doesn't exist.

    ```bash
    kubectl create namespace ce-developer-portal-sandbox-1
    ```

