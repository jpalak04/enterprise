
# Self Service Portal

A self-service portal, in the context of software development, is typically some form of internal web application that consolidates various tools, resources, and information that developers, operators and administrators need to perform their tasks. It provides a unified, streamlined platform to access services and perform operations without the need for constant human intervention or context switching between platforms.

The importance of a self-service portal lies in its ability to boost productivity, standardize workflows, and enhance collaboration. Here are a few key benefits:

1. **Efficiency and Productivity**: With all tools and resources in one place, developers can quickly find what they need, reducing time spent on searching for information or switching between different platforms. This efficiency gain directly translates into higher productivity.

2. **Standardization**: A self-service portal can enforce certain standards and best practices across an organization. By having standardized templates and workflows, organizations can ensure consistency in their codebase and development practices.

3. **Collaboration and Knowledge Sharing**: Self-service portals often include features like documentation and knowledge sharing. This means that developers can easily share their work, learn from others, and collaborate more effectively.

4. **Autonomy and Empowerment**: Self-service portals empower developers by giving them the resources they need to solve problems independently. This reduces bottlenecks and allows for faster problem resolution.

5. **Transparency**: With a shared platform, it's easier to have an overview of all ongoing projects, who's working on what, and their status. This can improve planning, resource allocation, and project management.

Despite these benefits, the implementation of a self-service portal requires careful planning and commitment. It requires time and resources, both for the initial setup and ongoing maintenance. Plus, to maximize its effectiveness, all teams need to adopt and regularly use the portal. 

In conclusion, a self-service portal can be a game-changer for software development teams, creating a more efficient, collaborative, and transparent environment. However, its success depends on how well it's implemented, maintained, and adopted within the organization.

## Introduction to Backstage

Backstage is an open-source platform built by Spotify that allows developers to manage software development lifecycle and build better software, faster. It's a developer portal that brings all your infrastructure tooling, services, and documentation into a single, streamlined interface.

[Prior Research](https://confluence.axway.com/display/ARCH/Backstage+Internal+Research)

### Why Consider Backstage?

First and foremost, it's Free! It has been accepted by CNCF and is in the incubation phase, but also, Backstage has a significant presence and impact within the community, which means solutions and fixes come frequently, are well maintained, and cover a wide range of concerns.

Being open-sourced and maintained by CNCF and Spotify, one of the leading tech companies, Backstage benefits from a wealth of practical experience and knowledge. This contributes to its continuous development, and ensures it stays relevant and effective in addressing the evolving needs of software development teams.

Moreover, the thriving community surrounding Backstage leads to a rich ecosystem of plugins and extensions. These plugins, contributed by community members, extend the functionality of Backstage and cater to various use-cases, which means you're likely to find a plugin that matches your specific needs. And if it doesn't exist, you have the option to create it and contribute back to the community.

The community also plays a crucial role in spotting bugs, suggesting enhancements, and testing new features. This leads to a well-tested, stable, and progressively improved platform, resulting in more secure and reliable operation for its users.

Lastly, the vast community offers a rich source of support. There's a higher likelihood of finding solutions to issues or getting advice from community members who have encountered similar challenges. This support can significantly reduce the time spent troubleshooting and increase the speed of adoption.

Did I mention it's free?

#### Developer Efficiency and Experience

Backstage aims to streamline the developer experience by creating a one-stop shop for all the tools and services developers use daily. Instead of having to jump between different platforms and context switch, developers can focus on coding and problem-solving.

#### Increased Consistency and Standardization

Backstage encourages adopting standard practices and reducing variance among your teams. By creating templates and standards within Backstage, you can ensure a level of consistency and quality in your codebase.

#### Enhanced Service Discovery

With Backstage, your teams can easily discover and understand existing services, libraries, and datasets, making it easier to choose the best tool for the job and reducing duplication of effort.

#### Extensibility and Customization

Backstage is designed to be extensible and customizable to suit your organization's specific needs. You can add your own plugins or use any of the open source plugins available in the community.

### Risks and Pitfalls

However, to truly reap the benefits of Backstage, there are certain risks and pitfalls that need to be taken into account.

#### Implementation Effort

Implementing Backstage is not a trivial task. It requires time and resources, both for the initial setup and ongoing maintenance. Teams must be committed to regularly updating their tools, documentation, and services on the platform.

#### Organizational Commitment

To make the most out of Backstage, the whole organization needs to adopt it. It requires an organization-wide change in mindset and process. Without buy-in from all teams, the effectiveness of Backstage can be significantly diminished.

#### Expectation Management

While Backstage has the potential to streamline and enhance the developer experience, it is not a silver bullet that will solve all your problems overnight. It requires an ongoing commitment and continuous improvements to meet your organization's evolving needs.

### Conclusion

As with any technology investment, adopting Backstage should be a strategic decision, taking into account the potential benefits and challenges. It can be an excellent platform for organizations willing to invest the necessary resources and effort. However, successful implementation requires buy-in from all teams and an ongoing commitment to maintain and improve the platform.


- ACME (Company)
  - Amplify (Product/Platform)
    - AMPC (Application)
      - Envoy (Service)
    - Amplify Integration
      - XCP
      - XDP
  - Resource
\     - Mongo
      - Hazelcast


### Thoughts

All config with the exception of the static config required to boot the Backstage BE and FE should have a home in some repository, most likely gitlab or github depending on the R&D team.

This will require a top level location to manage concepts related to catalog-line and product and should have a tight coupling to master data. Also, concepts such as "resources", "systems" and "domains" should come out of this Axway managed location. Most likely should be maintained and owned by Cloud Engineering and CCoE.

Components, APIs, Docs, Links to docs, decorators etc should be owned by R&D teams with specific references to the top level managed concepts mentioned previously. There will need to be good supporting documentation and tooling to assist R&D in their efforts to maintain their catalog entries.

Locations for the specific repository groups within gitlab would be registered and then config would be automatically discovered for each project, apigov for example.

Cloud Engineering could submit pull requests to "seed" all the gitlab projects with the basic initial config.


The R&D effort should overall be minimally invasive. Once the initial location has been registered in backstage, it will remain largely static and any incremental changes that occur will be automatically discovered during the normal Backstage catalog mainteance.

We need to do a better job linking our master data to the component level. I managed to solve this problem by querying gitlab for csr-profile config and then using that to crosswalk back to the master data. I think this could be much easier if we had better linkage between the 2.



