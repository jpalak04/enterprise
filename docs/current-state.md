## Current State and Roadmap 

**12/28/2023**

## Current State

### Build Pipelines in GitLab CI/CD

- Docker Build and Push:
  - Pipeline for building Docker images and pushing to Artifactory.
- Helm Chart Management:
  - Pipeline for managing Helm charts and pushing to Artifactory.

### Flux Deployments

- Environments: Configurations for different environments are managed and can be viewed [here](https://git.ecd.axway.org/sre/self_service_portal/flux-deployments/-/tree/main/clusters?ref_type=heads).

### Kubernetes Deployments

- **Development Environment**:
  - Infrastructure: Running on VxRail.
  - Database: Self-managed PostgreSQL.
  - Endpoint: [dev.devo.axway.int](http://de.devo.axway.int).
- **Staging Environment**:
  - Infrastructure: Running on EKS (Elastic Kubernetes Service).
  - Database: RDS PostgreSQL.
  - Endpoint: [stage.devo.axway.int](http://stage.devo.axway.int).
- **Production Environment**:
  - Infrastructure: Running on EKS with RDS PostgreSQL.
  - Database: RDS PostgreSQL.
  - Endpoint: [stage.devo.axway.int](http://stage.devo.axway.int).

## Roadmap

### SSL Certificate Implementation

- SSL certificate for all endpoints needs to be added to Axway truststore to ensure browser trust for `*.devo.axway.int`.
- Also need to consider adding endpoints for DORA or other types of graphs/dashboards that we wish to embded

### Secrets Management Strategy

- Develop and implement a comprehensive strategy for managing secrets within the deployment process.

### Enhanced Build Pipeline Security

- Integrate security tools like Twistlock into the build pipeline to ensure thorough validation and security of Docker images.

### Evaluate Ingress Method

- Ingress is using AWS ELB, based on Nginx chart. Need to validate the best practice long term for managing.

### Flux Management

- Flux is being used to manage deployments. We will need to refactor in the future to meet established best practices that emerge.
