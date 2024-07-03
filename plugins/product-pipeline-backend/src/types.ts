// packages/shared/src/types.ts
export interface PipelineData {
    id: number;
    status: string;
    stage: string;
    name: string;
    ref: string;
    tag: boolean;
    coverage: number | null;
    allow_failure: boolean;
    created_at: string;
    started_at: string;
    finished_at: string;
    duration: number;
    queued_duration: number;
    user: {
      id: number;
      username: string;
      name: string;
      avatar_url: string;
      web_url: string;
    };
    commit: {
      id: string;
      short_id: string;
      title: string;
      message: string;
      author_name: string;
      author_email: string;
      web_url: string;
    };
    pipeline: {
      id: number;
      status: string;
      source: string;
      created_at: string;
      web_url: string;
    };
    web_url: string;
    artifacts: {
      file_type: string;
      size: number;
      filename: string;
    }[];
    runner: {
      id: number;
      description: string;
      ip_address: string;
      status: string;
    };
    project: {
      name: string;
      web_url: string;
    };
    build_number: number;
  }
  