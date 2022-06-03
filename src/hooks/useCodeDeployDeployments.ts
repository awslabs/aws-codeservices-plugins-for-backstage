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
import {BatchGetDeploymentsCommandOutput} from '@aws-sdk/client-codedeploy';

export function useCodeDeployDeployments(deploymentGroup: string, region: string, iamRole: string) {
  const api = useApi(codeStarApiRef);

  const {
    loading,
    value: deployments,
    error,
    retry,
  } = useAsyncRetry<BatchGetDeploymentsCommandOutput | undefined>(async () => {
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
  }, []);

  const deploymentsInfo = deployments?.deploymentsInfo;
  return {loading, deploymentsInfo, region, deploymentGroup, error, retry} as const
};