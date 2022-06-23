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
import {DeploymentGroupInfo, DeploymentInfo} from '@aws-sdk/client-codedeploy';

export function useCodeDeployDeployments(applicationName: string, deploymentGroupName: string, region: string, iamRole: string) {
  const api = useApi(codeStarApiRef);

  const {
    loading,
    value,
    error,
    retry,
  } = useAsyncRetry<{deploymentGroup: DeploymentGroupInfo, deployments: DeploymentInfo[]}>(async () => {
    const creds = await api.generateCredentials({iamRole: iamRole});

    const deploymentGroup = await api.getDeploymentGroup({region: region, appName: applicationName, deploymentGroupName: deploymentGroupName, creds});
    const deploymentIds = await api.getDeploymentIds({region: region, appName: applicationName, deploymentGroupName: deploymentGroupName, creds});
    let deployments : DeploymentInfo[] = [];

    if(deploymentIds.deployments) {
      const deploymentInfo = await api.getDeployments({region: region, ids: deploymentIds.deployments, creds});

      if(deploymentInfo.deploymentsInfo) {
        deployments = deploymentInfo.deploymentsInfo

        deployments = deployments.sort((a, b) => (b.createTime!.getTime() - a.createTime!.getTime()))
      }
    }

    if(deploymentGroup.deploymentGroupsInfo) {
      return {deploymentGroup: deploymentGroup.deploymentGroupsInfo[0], deployments};
    }

    throw new Error('Deployment group undefined')
  }, []);

  return {loading, deploymentGroup: value?.deploymentGroup, deployments: value?.deployments, region, applicationName, deploymentGroupName, error, retry} as const
};