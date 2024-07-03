import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useAsync } from 'react-use';
import { useApi, discoveryApiRef } from '@backstage/core-plugin-api';

type JenkinsPipeline = {
  name: string;
  status: string;
  url: string;
  timestamp: any[];
  number: number;
};

type GitLabPipeline = {
  name: string;
  status: string;
  id: string;
  project_id: number;
  web_url: string;
  updated_at: any[];
};

const fetchJenkinsData = async (
  baseUrl: string,
  jobs: { job_name: string }[],
): Promise<JenkinsPipeline[]> => {
  const results = await Promise.all(
    jobs.map(async job => {
      const response = await fetch(
        `${baseUrl}/jenkins/ampc-swagger-apiserver/pipelines`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch Jenkins data: ${response.statusText}`);
      }
      const data = await response.json();
      return data.map((build: any) => ({
        name: job.job_name,
        status: build.result,
        url: build.url,
        timestamp: build.timestamp,
        number: build.number,
      }));
    }),
  );
  return results.flat();
};

const fetchGitLabData = async (
  baseUrl: string,
  projects: { project_id: string; project_name: string }[],
): Promise<GitLabPipeline[]> => {
  const results = await Promise.all(
    projects.map(async project => {
      const response = await fetch(`${baseUrl}/gitlab/10559/pipelines`);
      if (!response.ok) {
        throw new Error(`Failed to fetch GitLab data: ${response.statusText}`);
      }
      const data = await response.json();
      return data.map((pipeline: any) => ({
        name: project.project_name,
        status: pipeline.status.toUpperCase(),
        ref: pipeline.ref,
        project_id: project.project_id,
        web_url: pipeline.web_url,
        updated_at: pipeline.created_at,
        id: pipeline.id,
      }));
    }),
  );
  return results.flat();
};

export const ExampleFetchComponent = ({
  selectedTable,
}: {
  selectedTable: 'jenkins' | 'gitlab';
}) => {
  const { entity } = useEntity();
  const discoveryApi = useApi(discoveryApiRef);
  const jenkinsAnnotation = entity.metadata.annotations?.['cicd.jenkins'];
  const gitlabAnnotation = entity.metadata.annotations?.['cicd.gitlab'];

  const jenkinsJobs = jenkinsAnnotation ? JSON.parse(jenkinsAnnotation) : [];
  const gitlabProjects = gitlabAnnotation ? JSON.parse(gitlabAnnotation) : [];

  const {
    value: apiUrls,
    loading: apiUrlsLoading,
    error: apiUrlsError,
  } = useAsync(async () => {
    const jenkinsBaseUrl = await discoveryApi.getBaseUrl('cicd');
    const gitlabBaseUrl = await discoveryApi.getBaseUrl('cicd');
    return { jenkinsBaseUrl, gitlabBaseUrl };
  }, []);

  const {
    value: jenkinsData,
    loading: loadingJenkins,
    error: errorJenkins,
  } = useAsync(async () => {
    if (apiUrls) {
      return fetchJenkinsData(apiUrls.jenkinsBaseUrl, jenkinsJobs);
    }
    return Promise.resolve([]);
  }, [apiUrls]);

  const {
    value: gitlabData,
    loading: loadingGitLab,
    error: errorGitLab,
  } = useAsync(async () => {
    if (apiUrls) {
      return fetchGitLabData(apiUrls.gitlabBaseUrl, gitlabProjects);
    }
    return Promise.resolve([]);
  }, [apiUrls]);

  if (apiUrlsLoading || loadingJenkins || loadingGitLab) {
    return <Progress />;
  }
  if (apiUrlsError) {
    return <ResponseErrorPanel error={apiUrlsError} />;
  }
  if (errorJenkins) {
    return <ResponseErrorPanel error={errorJenkins} />;
  }
  if (errorGitLab) {
    return <ResponseErrorPanel error={errorGitLab} />;
  }

  const jenkinsColumns: TableColumn<JenkinsPipeline>[] = [
    { title: 'Job Name', field: 'name' },
    {
      title: 'ID',
      field: 'number',
      render: (rowData: JenkinsPipeline) => (
        <a href={rowData.url} target="_blank" rel="noopener noreferrer">
          {rowData.number}
        </a>
      ),
    },
    { title: 'Status', field: 'status' },
    { title: 'Updated Time', field: 'timestamp' },
  ];

  const gitlabColumns: TableColumn<GitLabPipeline>[] = [
    { title: 'Job Name', field: 'name' },
    {
      title: 'ID',
      field: 'id',
      render: (rowData: GitLabPipeline) => (
        <a href={rowData.web_url} target="_blank" rel="noopener noreferrer">
          {rowData.id}
        </a>
      ),
    },
    { title: 'Status', field: 'status' },
    { title: 'Updated Time', field: 'updated_at' },
    { title: 'Branch Name', field: 'ref' },
  ];

  return (
    <div>
      {selectedTable === 'gitlab' && (
        <Table
          title="GitLab Pipeline Status"
          options={{ search: true, paging: true }}
          columns={gitlabColumns}
          data={gitlabData || []}
        />
      )}
      {selectedTable === 'jenkins' && (
        <Table
          title="Jenkins Job Status"
          options={{ search: true, paging: true }}
          columns={jenkinsColumns}
          data={jenkinsData || []}
        />
      )}
    </div>
  );
};
