import { PipelineData } from "../types";

export function marshalGitlabResponse(response: any): PipelineData {
    return {
        id: response.id,
        status: response.status,
        stage: response.stage,
        name: response.name,
        ref: response.ref,
        tag: response.tag,
        coverage: response.coverage,
        allow_failure: response.allow_failure,
        created_at: response.created_at,
        started_at: response.started_at,
        finished_at: response.finished_at,
        duration: response.duration,
        queued_duration: response.queued_duration,
        user: {
            id: response.user.id,
            username: response.user.username,
            name: response.user.name,
            avatar_url: response.user.avatar_url,
            web_url: response.user.web_url
        },
        commit: {
            id: response.commit.id,
            short_id: response.commit.short_id,
            title: response.commit.title,
            message: response.commit.message,
            author_name: response.commit.author_name,
            author_email: response.commit.author_email,
            web_url: response.commit.web_url
        },
        pipeline: {
            id: response.pipeline.id,
            status: response.pipeline.status,
            source: response.pipeline.source,
            created_at: response.pipeline.created_at,
            web_url: response.pipeline.web_url
        },
        web_url: response.web_url,
        artifacts: response.artifacts.map((artifact: any) => ({
            file_type: artifact.file_type,
            size: artifact.size,
            filename: artifact.filename
        })),
        runner: {
            id: response.runner.id,
            description: response.runner.description,
            ip_address: response.runner.ip_address,
            status: response.runner.status
        },
        project: {
            name: response.project.name,
            web_url: response.project.web_url
        },
        build_number: response.build_number
    };
}

export function marshalJenkinsResponse(response: any): PipelineData {
    return {
        id: response.id,
        status: response.status,
        stage: response.stage,
        name: response.name,
        ref: response.ref,
        tag: response.tag,
        coverage: response.coverage,
        allow_failure: response.allow_failure,
        created_at: response.created_at,
        started_at: response.started_at,
        finished_at: response.finished_at,
        duration: response.duration,
        queued_duration: response.queued_duration,
        user: {
            id: response.user.id,
            username: response.user.username,
            name: response.user.name,
            avatar_url: response.user.avatar_url,
            web_url: response.user.web_url
        },
        commit: {
            id: response.commit.id,
            short_id: response.commit.short_id,
            title: response.commit.title,
            message: response.commit.message,
            author_name: response.commit.author_name,
            author_email: response.commit.author_email,
            web_url: response.commit.web_url
        },
        pipeline: {
            id: response.pipeline.id,
            status: response.pipeline.status,
            source: response.pipeline.source,
            created_at: response.pipeline.created_at,
            web_url: response.pipeline.web_url
        },
        web_url: response.web_url,
        artifacts: response.artifacts.map((artifact: any) => ({
            file_type: artifact.file_type,
            size: artifact.size,
            filename: artifact.filename
        })),
        runner: {
            id: response.runner.id,
            description: response.runner.description,
            ip_address: response.runner.ip_address,
            status: response.runner.status
        },
        project: {
            name: response.project.name,
            web_url: response.project.web_url
        },
        build_number: response.build_number
    };
}
