/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
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
import {BUILD_PROJECT_ARN_ANNOTATION, IAM_ROLE_ANNOTATION} from '../constants';
import {DEPLOY_GROUP_ARN_ANNOTATION} from '../constants';
import {PIPELINE_ARN_ANNOTATION} from '../constants';
import {BatchGetDeploymentsCommandOutput} from '@aws-sdk/client-codedeploy';
import {GetPipelineStateOutput, PipelineExecutionSummary} from '@aws-sdk/client-codepipeline';
import {Build} from '@aws-sdk/client-codebuild';

export function useBuilds() {
  const {entity} = useEntity();
  const api = useApi(codeStarApiRef);

  const iamRole = entity?.metadata.annotations?.[IAM_ROLE_ANNOTATION] ?? '';
  const buildARN = entity?.metadata.annotations?.[BUILD_PROJECT_ARN_ANNOTATION] ?? '';
  const {
    loading,
    value: builds,
    error,
    retry,
  } = useAsyncRetry<Build[]>(async () => {
    const arnElements = buildARN.split(":")
    if (arnElements.length < 6)
      return [];

    const region = arnElements[3];
    const project = arnElements[5].substring("project/".length)

    const creds = await api.generateCredentials({iamRole: iamRole});
    const buildIds = await api.getBuildIds({region: region, project: project, creds});
    if (buildIds.ids) {
      const output = await api.getBuilds({region: region, ids: buildIds.ids, creds})
      return output.builds ?? [];
    }
    return [];
  });

  const buildOutput = builds;
  return {loading, buildOutput, error, retry} as const;
};

export function useDeployments() {
  const api = useApi(codeStarApiRef);
  const {entity} = useEntity();

  const iamRole = entity?.metadata.annotations?.[IAM_ROLE_ANNOTATION] ?? '';
  const deployARN = entity?.metadata.annotations?.[DEPLOY_GROUP_ARN_ANNOTATION] ?? '';
  const {
    loading,
    value: deployments,
    error,
    retry,
  } = useAsyncRetry<BatchGetDeploymentsCommandOutput | undefined>(async () => {
    const arnElements = deployARN.split(":")
    if (arnElements.length < 7)
      return undefined;

    const region = arnElements[3];
    const deploymentGroup = arnElements[6].split("/")
    if (deploymentGroup.length < 2)
      return undefined;

    const application = deploymentGroup[0]
    const groupName = deploymentGroup[1]

    const creds = await api.generateCredentials({iamRole: iamRole});
    const output = await api.getDeploymentIds({region: region, appName: application, deploymentGroupName: groupName, creds});
    if (output.deployments === undefined) {
      return undefined;
    }
    return await api.getDeployments({region: region, ids: output.deployments, creds});
  });

  const deploymentsInfo = deployments?.deploymentsInfo;
  return {loading, deploymentsInfo, error, retry} as const
};


export function usePipelineState() {
  const api = useApi(codeStarApiRef);
  const {entity} = useEntity();

  const iamRole = entity?.metadata.annotations?.[IAM_ROLE_ANNOTATION] ?? '';
  const pipelineARN = entity?.metadata.annotations?.[PIPELINE_ARN_ANNOTATION] ?? '';
  const {
    loading,
    value: pipelineInfo,
    error,
    retry
  } = useAsyncRetry<GetPipelineStateOutput | undefined>(async () => {
    const arnElements = pipelineARN.split(":")
    if (arnElements.length < 6)
      return undefined;

    const region = arnElements[3];
    const pipelineName = arnElements[5]

    const creds = await api.generateCredentials({iamRole: iamRole})
    // eslint-disable-next-line
    const pipelineInfo = await api.getPipelineState({region: region, name: pipelineName, creds});
    if (pipelineInfo.stageStates === undefined) {
      return undefined;
    }
    return pipelineInfo;
  });

  return {loading, pipelineInfo, error, retry} as const;
};

export function usePipelineRunsList() {
  const api = useApi(codeStarApiRef);
  const {entity} = useEntity();
  const iamRole = entity?.metadata.annotations?.[IAM_ROLE_ANNOTATION] ?? '';
  const pipelineARN = entity?.metadata.annotations?.[PIPELINE_ARN_ANNOTATION] ?? '';
  const {
    loading,
    value: pipelineRunsSummaries,
    error,
    retry
  } = useAsyncRetry<PipelineExecutionSummary[] | undefined>(async () => {
    const arnElements = pipelineARN.split(":")
    if (arnElements.length < 6)
      return undefined;

    const region = arnElements[3];
    const pipelineName = arnElements[5]

    const creds = await api.generateCredentials({iamRole: iamRole});
    const pipelineRunsList = await api.getPipelineRuns({region: region, name: pipelineName, creds});
    if (pipelineRunsList?.pipelineExecutionSummaries === undefined) {
      return undefined;
    }
    return pipelineRunsList.pipelineExecutionSummaries;
  });

  return {loading, pipelineRunsSummaries, error, retry} as const;
}
