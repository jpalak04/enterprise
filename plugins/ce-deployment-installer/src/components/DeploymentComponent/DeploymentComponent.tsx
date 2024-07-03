import React from 'react';
import {
  Header,
  Page,
  Content,
  HeaderLabel,
} from '@backstage/core-components';
import { DeploymentFromConfig } from './DeploymentForm';



export const DeploymentComponent = () => (
  <Page themeId="tool">
    <Header title="Cloud Engineering Deployment Installer" subtitle="Upload Installers to Staging Area">
      <HeaderLabel label="Owner" value="Cloud Engineering" />
      <HeaderLabel label="Lifecycle" value="Production" />
      <HeaderLabel label="Lifecycle" value="Production" />
    </Header>
    <Content>
      <DeploymentFromConfig></DeploymentFromConfig>
    </Content>
  </Page>
);
