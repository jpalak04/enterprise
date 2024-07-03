Author: Chris Coy
Status: Proposed
Deciders: Chris Coy, Jagan Rekala, Sergey Spasskiy, Jacques Gendreau, Alexandre Vaussant

## Context and Problem Statement
Our current architecture relies heavily on Jenkins for deployment processes. Jenkins has been instrumental in our deployment operations, proving its reliability and versatility across various projects. However, as we scale and move towards more modern, cloud-native practices, certain challenges with Jenkins have come to light:

- **Centralization and Imperative Nature**: Jenkins, while powerful, operates centrally and relies on imperative scripts or commands, which can reduce transparency and increase the risk of errors.
- **Complex CI/CD Pipelines**: Jenkins setups often result in intricate and opaque Continuous Integration/Continuous Deployment (CI/CD) pipelines.
- **Manual Oversight**: The necessity for significant manual intervention can introduce human error and inefficiencies.
- **Lack of Declarative Configuration**: Jenkins does not inherently support a declarative approach to infrastructure and deployment, a key aspect of modern DevOps practices.
- **Difficult Change Tracking**: Auditing and tracking changes can be challenging with Jenkins, often leading to inconsistency across environments.
- **Error-Prone**: The imperative nature and manual steps involved can increase the potential for errors in deployment processes.

To complement Jenkins and address these challenges, several projects, including UMSv2 and Self-Service Developer Portal, have adopted GitOps with Flux for our CI/CD processes. This Architectural Decision Record (ADR) is intended to document that decision and is not a reflection of moving away from Jenkins entirely but rather an evolution of our deployment strategy to incorporate Flux where it best fits our needs.

## Proposal: GitOps with Flux
Flux, the Kubernetes GitOps operator, offers a solution to the challenges posed by Jenkins by providing a more streamlined, transparent, and robust deployment workflow. While Jenkins continues to be a critical part of our deployment strategy, especially for product installs for our customers in separate VPCs, Flux is identified as a better fit for specific targets like platform services or internal applications that have a finite set of environments. The adoption of Flux introduces the following advantages:

- **Declarative Infrastructure and Deployment**: Emphasizes a declarative approach where the desired state of the system is defined in version-controlled Git repositories, aligning with modern DevOps practices.
- **Automated and Reliable**: Automates the application of changes, reducing the reliance on manual intervention and associated risks.
- **Enhanced Transparency**: All changes are version-controlled and auditable, improving transparency and traceability.
- **Consistency Across Environments**: Ensures that the deployed state matches the state defined in Git, promoting consistency across all environments.
- **Easier Rollbacks**: Facilitates easy rollback to previous versions in case of issues, enhancing reliability and reducing downtime.
- **Security and Compliance**: Improves security through automated syncs and clear separation of duties, aligning with compliance requirements.
- **Alignment with Modern Practices**: Complements our continued use of Jenkins by aligning with modern cloud-native practices, especially in Kubernetes-based environments.

### Flux-Specific Benefits:
- **Lifecycle Management**: Flux can maintain the lifecycle of other Kubernetes operators and controllers, offering a comprehensive solution for managing complex Kubernetes-native applications.
- **One-Two-Punch**: Flux excels in installing various operator/controller software and maintaining it, in addition to syncing YAML manifests for Custom Resources, thereby automating complex tasks like building entire ELK stacks, sharded MongoDB clusters, or Kafka clusters.
- **Weave GitOps Integration**: Flux, being the backbone of Weave GitOps, provides additional controllers for an enhanced GitOps experience, further streamlining our CI/CD processes.

## Acknowledging the Challenges with Flux
While Flux offers numerous advantages, it's crucial to address the challenges it presents to ensure a smooth adoption and operation:

- **Secrets Management**: Requires robust strategies for handling secrets to prevent exposure in Git repositories.
- **Change Control in Git**: Necessitates a disciplined approach to managing changes to prevent unwanted or unintended automatic applications to the infrastructure.
- **Lack of Administrative UI**: Flux operates primarily through CLI, which can be a shift for teams accustomed to graphical tools.
- **Learning Curve**: Teams need adequate training and resources to familiarize themselves with Flux's concepts and best practices.
- **Integration Complexity**: Careful planning is required to integrate Flux with existing CI/CD pipelines and toolchains.

## Comparison with Argo: Why Flux is the Preferred Choice
While Argo CD is another prominent GitOps tool, our decision to adopt Flux is driven by several strategic and technical considerations, including GitLab's recommendation, native support for Helm releases, a comprehensive ecosystem, alignment with cloud-native practices, and strong community support and momentum.

## Conclusion and Way Forward
This ADR does not advocate for a wholesale replacement of Jenkins but rather introduces Flux as a complementary tool where its features meet our specific needs, especially for platform services or internal applications. Jenkins will continue to play a crucial role in our deployment