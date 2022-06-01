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
import {IAM_ROLE_ANNOTATION} from '../constants';
import {DEPLOY_GROUP_ARN_ANNOTATION} from '../constants';
import {BatchGetDeploymentsCommandOutput} from '@aws-sdk/client-codedeploy';

export function useCodeDeployDeployments() {
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