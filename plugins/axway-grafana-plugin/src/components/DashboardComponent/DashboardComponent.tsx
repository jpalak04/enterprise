import React from 'react';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  StatusOK,
  TableColumn,
  Link,
  Table,
} from '@backstage/core-components';

//import { usePermissions, AppPermission } from 'app/src/components/auth';

import { usePermissions, useUserRoles } from 'app/src/components/auth';
import { Box, Chip, Typography } from '@material-ui/core';
//import { PermissionProvider } from 'app/src/components/auth';

interface TableData {
  id: number;
  branch: string;
  hash: string;
  status: string;
}

const generateTestData = (rows = 10) => {
  const data: Array<TableData> = [];
  while (data.length <= rows) {
    data.push({
      id: data.length + 18534,
      branch: 'techdocs: modify documentation header',
      hash: 'techdocs/docs-header 5749c98e3f61f8bb116e5cb87b0e4e1 ',
      status: 'Success',
    });
  }
  return data;
};

const columns: TableColumn[] = [
  {
    title: 'ID',
    field: 'id',
    highlight: true,
    type: 'numeric',
    width: '80px',
  },
  {
    title: 'Message/Source',
    highlight: true,
    render: (row: Partial<TableData>) => (
      <>
        <Link to="#message-source">{row.branch}</Link>
        <Typography variant="body2">{row.hash}</Typography>
      </>
    ),
  },
  {
    title: 'Status',
    render: (row: Partial<TableData>) => (
      <Box display="flex" alignItems="center">
        <StatusOK />
        <Typography variant="body2">{row.status}</Typography>
      </Box>
    ),
  },
  {
    title: 'Tags',
    render: () => <Chip label="Tag Name" />,
    width: '10%',
  },
];

export const DashboardComponent = () => {

  const { roles, loading, error } = useUserRoles(); // Destructuring all three values
  usePermissions
  // Optionally, handle the loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Optionally, handle the error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  // Function to handle rendering content based on role
  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!roles.includes('Demo.DoThis')) {
      return <Typography variant="h6" color="error">User Unauthorized</Typography>;
    }
    console.log(roles);
    // Authorized content
    return (
      <>
        <ContentHeader title="Dashboard Viewer">
          <SupportButton>This component is a viewer for grafana based dashboards</SupportButton>
        </ContentHeader>
        <Table
          options={{ paging: true, padding: 'dense' }}
          data={generateTestData(10)}
          columns={columns}
          title="Deployment Table"
        />
      </>
    );
  };

  if (!roles.includes('Demo.DoThis')) {
    return <Typography variant="h6" color="error">User Unauthorized</Typography>;
  }
 
  return (
    <Page themeId="tool">
      <Header title="Demo Deployment Page" subtitle="Deployment">
        <HeaderLabel label="Owner" value="Cloud Engineering" />
        <HeaderLabel label="Lifecycle" value="Production" />
      </Header>
      <Content>
        {renderContent()}
      </Content>
    </Page>
  );
};
