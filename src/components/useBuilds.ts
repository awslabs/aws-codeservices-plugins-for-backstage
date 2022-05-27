/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {useAsyncRetry} from 'react-use';
import {codeStarApiRef} from '../api';
import {useApi} from '@backstage/core-plugin-api';
import {useEntity} from '@backstage/plugin-catalog-react';
import {REGION_ANNOTATION, BUILD_PROJECT_ANNOTATION, IAM_ROLE_ANNOTATION} from '../constants';
import {DEPLOY_APPLICATION_ANNOTATION, DEPLOY_GROUP_NAME_ANNOTATION} from '../constants';
import {PIPELINE_NAME_ANNOTATION} from '../constants';
import { BatchGetDeploymentsCommandOutput } from '@aws-sdk/client-codedeploy';
import { GetPipelineStateOutput, PipelineExecutionSummary } from '@aws-sdk/client-codepipeline';
import { BatchGetBuildsCommandOutput } from '@aws-sdk/client-codebuild';

export enum ErrorType {
  CONNECTION_ERROR,
  NOT_FOUND,
}

export function useBuilds() {
  const {entity} = useEntity();
  const api = useApi(codeStarApiRef);
  const region = entity?.metadata.annotations?.[REGION_ANNOTATION] ?? '';
  const project = entity?.metadata.annotations?.[BUILD_PROJECT_ANNOTATION] ?? '';
  const iamRole = entity?.metadata.annotations?.[IAM_ROLE_ANNOTATION] ?? '';
  // const errorApi = useApi(errorApiRef);
  const {
    loading,
    value: builds,
    retry,
  } = useAsyncRetry<BatchGetBuildsCommandOutput | undefined>(async () => {
    try {
      const creds = await api.generateCredentials({iamRole: iamRole});
      const buildIds = await api.getBuildIds({region: region, project: project, creds});
      if (buildIds.ids === undefined) {
        return undefined;
      }
      return await api.getBuilds({region: region, ids: buildIds.ids, creds});
    } catch (e) {
      // errorApi.post(e)
      throw e
    }
  });

  const buildOutput = builds?.builds;
  return {loading, buildOutput, region, retry} as const;
};

export function useDeployments() {
  const api = useApi(codeStarApiRef);
  const {entity} = useEntity();
  const region = entity?.metadata.annotations?.[REGION_ANNOTATION] ?? '';
  const application = entity?.metadata.annotations?.[DEPLOY_APPLICATION_ANNOTATION] ?? '';
  const groupName = entity?.metadata.annotations?.[DEPLOY_GROUP_NAME_ANNOTATION] ?? '';
  const iamRole = entity?.metadata.annotations?.[IAM_ROLE_ANNOTATION] ?? '';
  // const errorApi = useApi(errorApiRef);
  const {
    loading,
    value: deployments,
    retry,
  } = useAsyncRetry<BatchGetDeploymentsCommandOutput | null>(async () => {
    try {
      const creds = await api.generateCredentials({iamRole: iamRole});
      const output = await api.getDeploymentIds({region: region, appName: application, deploymentGroupName: groupName, creds});
      if (output.deployments === undefined) {
        return null;
      }
      return await api.getDeployments({region: region, ids: output.deployments, creds});
    } catch (e) {
      // errorApi.post(e)
      throw e;
    }
  });

  const deploymentsInfo = deployments?.deploymentsInfo;
  return {loadingd: loading, deploymentsInfo, region: region, retryd: retry} as const
};


export function usePipelineState() {
  const api = useApi(codeStarApiRef);
  const {entity} = useEntity();
  const region = entity?.metadata.annotations?.[REGION_ANNOTATION] ?? '';
  const pipelineName = entity?.metadata.annotations?.[PIPELINE_NAME_ANNOTATION] ?? '';
  const iamRole = entity?.metadata.annotations?.[IAM_ROLE_ANNOTATION] ?? '';
  // const errorApi = useApi(errorApiRef);
  const {
    loading,
    value: pipelineInfo,
    retry
  } = useAsyncRetry<GetPipelineStateOutput | undefined>(async () => {
    try {
      const creds = await api.generateCredentials({iamRole: iamRole})
      // eslint-disable-next-line
      const pipelineInfo = await api.getPipelineState({region: region, name: pipelineName, creds});
      if (pipelineInfo?.stageStates === undefined) {
        return undefined;
      }
      return pipelineInfo;
    } catch (e) {
      // errorApi.post(e)
      throw e
    }
  });
  const loadingPipeline = loading;
  const retryPipeline = retry;
  return {loadingPipeline, pipelineInfo, region, retryPipeline} as const;
};

export function usePipelineRunsList() {
  const api = useApi(codeStarApiRef);
  const {entity} = useEntity();
  const region = entity?.metadata.annotations?.[REGION_ANNOTATION] ?? '';
  const pipelineName = entity?.metadata.annotations?.[PIPELINE_NAME_ANNOTATION] ?? '';
  const iamRole = entity?.metadata.annotations?.[IAM_ROLE_ANNOTATION] ?? '';
  // const errorApi = useApi(errorApiRef);
  const {
    loading,
    value: pipelineRunsSummaries,
    retry
  } = useAsyncRetry<PipelineExecutionSummary[] | undefined>(async () => {
    try {
      const creds = await api.generateCredentials({iamRole: iamRole});
      const pipelineRunsList = await api.getPipelineRuns({region: region, name: pipelineName, creds});
      if (pipelineRunsList?.pipelineExecutionSummaries === undefined) {
        return undefined;
      }
      return pipelineRunsList.pipelineExecutionSummaries;
    } catch (e) {
      // errorApi.post(e)
      throw e;
    }
  });
  const loadingSummaries = loading;
  const retrySummaries = retry;
  return {loadingSummaries, pipelineRunsSummaries, pipelineName, region, retrySummaries} as const;
}
