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

import {
  DeploymentGroupInfo,
  DeploymentInfo,
  DeploymentType,
} from "@aws-sdk/client-codedeploy";
import { Entity } from "@backstage/catalog-model";
import {
  InfoCard,
  InfoCardVariants,
  MissingAnnotationEmptyState,
  ResponseErrorPanel,
  Table,
  TableColumn,
} from "@backstage/core-components";
import { useEntity } from "@backstage/plugin-catalog-react";
import { Box, Grid, LinearProgress, Link } from "@material-ui/core";
import React from "react";
import { AWS_CODEDEPLOY_DEPLOYMENT_GROUP_ARN_ANNOTATION } from "../../constants";
import { useCodeDeployDeployments } from "../../hooks";
import { formatTime, getCodeDeployArnFromEntity } from "../../utils";
import { AboutField } from "../AboutField";
import { DeploymentStatus } from "../DeploymentStatus";
import { isAWSCodeDeployDeploymentGroupAvailable } from "../Flags";

const DeploymentHistoryTable = ({
  region,
  deployments,
}: {
  region: string;
  deployments: DeploymentInfo[];
}) => {
  const columns: TableColumn[] = [
    {
      title: "Deployment ID",
      field: "id",
      render: (row: Partial<DeploymentInfo>) => {
        return (
          <Link
            href={`https://${region}.console.aws.amazon.com/codesuite/codedeploy/deployments/${row.deploymentId}?region=${region}`}
            target="_blank"
          >
            {row.deploymentId}
          </Link>
        );
      },
    },
    {
      title: "Status",
      field: "deploymentStatus",
      render: (row: Partial<DeploymentInfo>) => (
        <DeploymentStatus status={row.status} />
      ),
    },
    {
      title: "Start time",
      field: "startTime",
      render: (row: Partial<DeploymentInfo>) =>
        `${formatTime(row.createTime)} ago`,
    },
  ];

  return (
    <div>
      <Table
        options={{
          paging: false,
          search: false,
          toolbar: false,
          padding: "dense",
        }}
        data={deployments}
        columns={columns}
      />
    </div>
  );
};

const deploymentGroupDeploymentType = (
  deploymentGroup: DeploymentGroupInfo
) => {
  if (deploymentGroup.deploymentStyle) {
    switch (deploymentGroup.deploymentStyle.deploymentType) {
      case DeploymentType.BLUE_GREEN:
        return "Blue/Green";
      case DeploymentType.IN_PLACE:
        return "In-place";
      default:
        break;
    }
  }

  return "None";
};

const deploymentGroupRollback = (deploymentGroup: DeploymentGroupInfo) => {
  if (deploymentGroup.autoRollbackConfiguration?.enabled) {
    return "Yes";
  }

  return "No";
};

const DeployWidgetContent = ({
  deploymentGroup,
  deployments,
  region,
  deploymentHistoryLength,
}: {
  deploymentGroup: DeploymentGroupInfo;
  deployments: DeploymentInfo[];
  region: string;
  deploymentHistoryLength: number;
}) => {
  const deploymentGroupUrl = `https://${region}.console.aws.amazon.com/codesuite/codedeploy/applications/${deploymentGroup.applicationName}/deployment-groups/${deploymentGroup.deploymentGroupName}?region=${region}`;

  return (
    <InfoCard title="AWS CodeDeploy Deployment Group" noPadding>
      <Box sx={{ m: 2 }}>
        <Grid container>
          <AboutField label="Deployment group name" gridSizes={{ md: 12 }}>
            <Link href={deploymentGroupUrl} target="_blank">
              {deploymentGroup.deploymentGroupName}
            </Link>
          </AboutField>
          <AboutField
            label="Compute platform"
            value={deploymentGroup.computePlatform}
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          />
          <AboutField
            label="Deployment type"
            value={deploymentGroupDeploymentType(deploymentGroup)}
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          />
          <AboutField
            label="Rollback enabled"
            value={deploymentGroupRollback(deploymentGroup)}
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          />
        </Grid>
      </Box>
      {deploymentHistoryLength > 0 && (
        <DeploymentHistoryTable
          region={region}
          deployments={deployments.slice(0, deploymentHistoryLength) ?? []}
        />
      )}
    </InfoCard>
  );
};

const DeployLatestRunCard = ({
  entity,
  variant,
  deploymentHistoryLength,
}: {
  entity: Entity;
  variant?: InfoCardVariants;
  deploymentHistoryLength: number;
}) => {
  const { arn, region } = getCodeDeployArnFromEntity(entity);

  const { deploymentGroup, deployments, error, loading } =
    useCodeDeployDeployments(arn);
  if (deploymentGroup) {
    return (
      <DeployWidgetContent
        deploymentGroup={deploymentGroup}
        deployments={deployments ?? []}
        region={region}
        deploymentHistoryLength={deploymentHistoryLength}
      />
    );
  }

  return (
    <InfoCard title="AWS CodeDeploy Deployment Group" variant={variant}>
      {error && <ResponseErrorPanel error={error} />}

      {loading && <LinearProgress />}
    </InfoCard>
  );
};

export const AWSCodeDeployWidget = ({
  variant,
  deploymentHistoryLength = 3,
}: {
  variant?: InfoCardVariants;
  deploymentHistoryLength?: number;
}) => {
  const { entity } = useEntity();
  return !isAWSCodeDeployDeploymentGroupAvailable(entity) ? (
    <MissingAnnotationEmptyState
      annotation={AWS_CODEDEPLOY_DEPLOYMENT_GROUP_ARN_ANNOTATION}
    />
  ) : (
    <DeployLatestRunCard
      entity={entity}
      variant={variant}
      deploymentHistoryLength={deploymentHistoryLength}
    />
  );
};
