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

import { DeploymentInfo } from "@aws-sdk/client-codedeploy";
import { Entity } from '@backstage/catalog-model';
import {
  InfoCard,
  InfoCardVariants,
  MissingAnnotationEmptyState,
  ResponseErrorPanel,
  StructuredMetadataTable
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { LinearProgress } from "@material-ui/core";
import React from 'react';
import { DEPLOY_GROUP_ARN_ANNOTATION } from '../../constants';
import { useCodeDeployDeployments } from '../../hooks';
import { getCodeDeployArnFromEntity, getIAMRoleFromEntity } from '../../utils';
import { DeploymentStatus } from '../DeploymentStatus';
import { isAWSCodeDeployAvailable } from '../Flags';

const DeployWidgetContent = ({
  deploymentInfo,region
}: {
  deploymentInfo?: DeploymentInfo,
  region: string
}) => {
  const rows = new Map<string, any>()
  if (deploymentInfo) {
    rows.set("Status",<>
        <DeploymentStatus status={deploymentInfo.status} />
      </>
    )
    const id = deploymentInfo?.deploymentId;
    if (id !== undefined) {
      rows.set("Deploy ID",
        <a
          href={`https://${region}.console.aws.amazon.com/codesuite/codedeploy/deployments/${id}?${region}`}
          target="_blank">
          {id}
        </a>
      )
    }
    const buildTime = deploymentInfo?.completeTime;
    if (buildTime !== undefined) {
      if (buildTime instanceof Date) {
      // make this duration or something later.
      rows.set("Completed", `${buildTime.toDateString()}:${buildTime.toTimeString()}`);
    }
  }
  }
  return (
    <StructuredMetadataTable metadata = {Object.fromEntries(rows)} />
  );
};

const DeployLatestRunCard = ({
  entity,
  variant,
}: {
  entity: Entity;
  variant?: InfoCardVariants;
}) => {
  const { deploymentGroup, region } = getCodeDeployArnFromEntity(entity);
  const { arn: iamRole } = getIAMRoleFromEntity(entity);

  const { deploymentsInfo, error, loading } =  useCodeDeployDeployments(deploymentGroup, region, iamRole)
  if(deploymentsInfo) {
    return (
      <InfoCard title='AWS CodeDeploy' variant={variant}>
        {!error && deploymentsInfo !== undefined ? (
          <DeployWidgetContent
            deploymentInfo={deploymentsInfo[0]}
            region={region} />
        ) : ( "" )}
      </InfoCard>
    );
  }

  return (
    <InfoCard title='AWS CodeDeploy' variant={variant}>
      {error &&
        <ResponseErrorPanel error={error} />
      }

      {loading &&
        <LinearProgress />
      }
    </InfoCard>
  )
};

export const AWSCodeDeployWidget = ({
  variant,
}: {
  variant?: InfoCardVariants;
}) => {
  const { entity } = useEntity();
  return !isAWSCodeDeployAvailable(entity) ? (
    <MissingAnnotationEmptyState annotation={DEPLOY_GROUP_ARN_ANNOTATION} />
  ) : (
    <DeployLatestRunCard entity={entity} variant={variant} />
  );
};