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

import React from "react";
import { Box, Typography } from "@material-ui/core";
import { Link } from "@material-ui/core";
import RetryIcon from "@material-ui/icons/Replay";
import { Table } from "@backstage/core-components";
import { Build } from "@aws-sdk/client-codebuild";
import { BuildStatus } from "../BuildStatus";
import { Entity } from "@backstage/catalog-model";
import { useCodeBuildBuilds } from "../../hooks";
import { formatTime, getCodeBuildArnFromEntity } from "../../utils";
import { getDurationFromDates } from "../../utils/getDuration";

const getBuildLink = (
  id: string | undefined,
  project: string,
  accountId: string,
  region: string
) => {
  if (id) {
    return (
      <Link
        href={`https://${region}.console.aws.amazon.com/codesuite/codebuild/${accountId}/projects/${project}/build/${id}/?region=${region}`}
        target="_blank"
      >
        {id}
      </Link>
    );
  }

  return "Unknown";
};

const generatedColumns = (
  region: string,
  project: string,
  accountId: string
) => {
  return [
    {
      title: "ID",
      field: "name",
      render: (row: Partial<Build>) =>
        getBuildLink(row.id, project, accountId, region),
    },
    {
      title: "Number",
      field: "buildNumber",
    },
    {
      title: "Submitter",
      field: "initiator",
    },
    {
      title: "Status",
      field: "status",
      render: (row: Partial<Build>) => {
        return (
          <Box display="flex" alignItems="center">
            <BuildStatus status={row.buildStatus} />
          </Box>
        );
      },
    },
    {
      title: "Duration",
      field: "duration",
      render: (row: Partial<Build>) => {
        if (row.endTime !== undefined && row.startTime !== undefined) {
          return getDurationFromDates(row.startTime, row.endTime);
        }
        return <></>;
      },
    },
    {
      title: "Completed",
      field: "completed",
      render: (row: Partial<Build>) => formatTime(row.endTime),
    },
  ];
};

type Props = {
  entity: Entity;
};

export const AWSCodeBuildBuildsTable = ({ entity }: Props) => {
  const { accountId, projectName, region, arn } =
    getCodeBuildArnFromEntity(entity);

  const { loading, builds, retry } = useCodeBuildBuilds(arn);
  return (
    <Table
      isLoading={loading}
      actions={[
        {
          icon: () => <RetryIcon />,
          tooltip: "Refresh Data",
          isFreeAction: true,
          onClick: () => retry(),
        },
      ]}
      data={builds ?? []}
      title={
        <Box display="flex" alignItems="center">
          <Box mr={2} />
          <Typography variant="h6">AWS CodeBuild Project</Typography>
        </Box>
      }
      columns={generatedColumns(region, projectName, accountId)}
    />
  );
};
