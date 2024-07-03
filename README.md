# Self Service Developer Portal

Welcome to the repository for the Self Service  Developer Portal for Axway. This document provides an overview of the portal's environments, build processes, and deployment mechanisms.

## Environments

The Self Service  Developer Portal is accessible through different environments, each serving a specific purpose in the development lifecycle:

- **Development**: For latest in-progress features and testing.
  - URL: [https://dev.devo.axway.int](https://dev.devo.axway.int)

- **Staging**: Pre-release environment for final checks before production release.
  - URL: [https://stage.devo.axway.int](https://stage.devo.axway.int)

- **Production**: The live environment used by end-users.
  - URL: [https://devo.axway.int](https://devo.axway.int)

## High Level Architecture

### Development
The development environment runs in Axway pCloud (vxRails) and relies on a self-managed postgres database. 

![Development Deployment Architecture](docs/Architecture%20Design%20VxRails.png)

### Stage and Prod
Stage and Prod are running on EKS within the IT Infrastrcure VPC.

![Stage and Prod Deployment Architecture](docs/Architecture%20Design%20AWS.png)

## Build Process

Our build process is automated using GitLab CI/CD and is divided into two main streams: features and releases.

The build pipeline can be reviewed [here](./.gitlab-ci.yml).

### Docker Images

- **Features**: For images that are part of ongoing development.
  - Repository: `cesharedservices-docker-snapshot-phx.artifactory-phx.ecd.axway.int`
  
- **Releases**: For stable images ready for stage and production deployment.
  - Repository: `cesharedservices-docker-release-phx.artifactory-phx.ecd.axway.int`
  - Public Saas Repository: `axway.jfrog.io/cesharedservices-docker-release/devops-portal`

### Helm Charts

- **Features**: For Helm charts that are part of ongoing development.
  - Repository: `cesharedservices-helm-snapshot-phx.artifactory-phx.ecd.axway.int`
  
- **Releases**: For stable Helm charts ready for production deployment.
  - Repository: `cesharedservices-helm-release-phx.artifactory-phx.ecd.axway.int`
  - Public Saas Repository: `axway.jfrog.io/cesharedservices-helm-release/devops-portal`

## Deployment

We use Flux to manage the cluster state and ensure that our deployments are declarative, automated, and version-controlled.

- **Flux Configurations**: 
For the specific details on the flux deployment please check [here](https://git.ecd.axway.org/sre/self_service_portal/flux-deployments/-/tree/main/clusters?ref_type=heads)

A separate folder exists for each environment and a dedicated agent is installed within each cluster to monitor changes to the k8s manifests.

- **Helm Chart**:
For specific details on the helm chart check [here](./docs/deployment.md)

## Getting Started

To get started with the Self Service Developer Portal, follow these steps:

1. Ensure you have access to the necessary environments and repositories.
2. Familiarize yourself with our CI/CD process by reviewing the `.gitlab-ci.yml` file in this repository.
3. For contributions, please follow the feature branching workflow and open merge requests defined [here](./docs/feature-dev.md)

## Support

If you encounter any issues or require assistance, please reach out to the Cloud Engineering team or file an issue in the repository's [issue tracker.](https://jira.axway.com/projects/CE/issues)

## Roadmap
To follow the current state  and future direction check [here](./docs/current-state.md).

