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

import { Build, Project } from "@aws-sdk/client-codebuild";
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
import { AWS_CODEBUILD_PROJECT_ARN_ANNOTATION } from "../../constants";
import { useCodeBuildBuilds } from "../../hooks";
import { formatTime, getCodeBuildArnFromEntity } from "../../utils";
import { getDurationFromStringDates } from "../../utils/getDuration";
import { AboutField } from "../AboutField";
import { BuildStatus } from "../BuildStatus";
import { isAWSCodeBuildProjectAvailable } from "../Flags";

const BuildHistoryTable = ({
  region,
  accountId,
  project,
  builds,
}: {
  region: string;
  accountId: string;
  project: string | undefined;
  builds: Build[];
}) => {
  const columns: TableColumn[] = [
    {
      title: "Build run",
      field: "id",
      render: (row: Partial<Build>) => {
        return (
          <Link
            href={`https://${region}.console.aws.amazon.com/codesuite/codebuild/${accountId}/projects/${project}/build/${project}:${row.id}/?region=${region}`}
            target="_blank"
          >
            #{row.buildNumber}
          </Link>
        );
      },
    },
    {
      title: "Status",
      field: "deploymentStatus",
      render: (row: Partial<Build>) => <BuildStatus status={row.buildStatus} />,
    },
    {
      title: "Duration",
      field: "duration",
      render: (row: Partial<Build>) => {
        if (row.startTime && row.endTime) {
          return getDurationFromStringDates(row.startTime, row.endTime);
        }

        return "";
      },
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
        data={builds}
        columns={columns}
      />
    </div>
  );
};

const projectMostRecentBuildStatus = (builds: Build[]) => {
  if (builds.length > 0) {
    return <BuildStatus status={builds[0].buildStatus} />;
  }

  return <></>;
};

const projectMostRecentBuildExecuted = (builds: Build[]) => {
  if (builds.length > 0) {
    const build = builds.find((el) => el.startTime);

    if (build) {
      return `${formatTime(build.startTime)} ago`;
    }
  }

  return <></>;
};

const projectMostRecentBuildDuration = (builds: Build[]) => {
  if (builds.length > 0) {
    const build = builds.find((el) => el.startTime && el.endTime);

    if (build) {
      return getDurationFromStringDates(build.startTime, build.endTime);
    }
  }

  return <></>;
};

const WidgetContent = ({
  project,
  region,
  accountId,
  builds,
  buildHistoryLength,
}: {
  project: Project;
  region: string;
  accountId: string;
  builds: Build[];
  buildHistoryLength: number;
}) => {
  const projectUrl = `https://${region}.console.aws.amazon.com/codesuite/codebuild/${accountId}/projects/${project.name}/?region=${region}`;

  return (
    <InfoCard title="AWS CodeBuild Project" noPadding>
      <Box sx={{ m: 2 }}>
        <Grid container>
          <AboutField label="Project Name" gridSizes={{ md: 12 }}>
            <Link href={projectUrl} target="_blank">
              {project.name}
            </Link>
          </AboutField>
          <AboutField
            label="Most recent build"
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          >
            {projectMostRecentBuildStatus(builds)}
          </AboutField>
          <AboutField
            label="Last executed"
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          >
            {projectMostRecentBuildExecuted(builds)}
          </AboutField>
          <AboutField label="Duration" gridSizes={{ xs: 12, sm: 6, lg: 4 }}>
            {projectMostRecentBuildDuration(builds)}
          </AboutField>
        </Grid>
      </Box>
      {buildHistoryLength > 0 && (
        <BuildHistoryTable
          region={region}
          accountId={accountId}
          project={project.name}
          builds={builds.slice(0, buildHistoryLength) ?? []}
        />
      )}
    </InfoCard>
  );
};

const BuildLatestRunCard = ({
  entity,
  buildHistoryLength,
  variant,
}: {
  entity: Entity;
  buildHistoryLength: number;
  variant?: InfoCardVariants;
}) => {
  const { accountId, region, arn } = getCodeBuildArnFromEntity(entity);

  const { project, builds, error, loading } = useCodeBuildBuilds(arn);

  if (project && builds) {
    return (
      <WidgetContent
        project={project}
        region={region}
        accountId={accountId}
        builds={builds ?? []}
        buildHistoryLength={buildHistoryLength}
      />
    );
  }

  return (
    <InfoCard title="AWS CodeBuild Project" variant={variant}>
      {error && <ResponseErrorPanel error={error} />}

      {loading && <LinearProgress />}
    </InfoCard>
  );
};

export const AWSCodeBuildWidget = ({
  variant,
  buildHistoryLength = 3,
}: {
  variant?: InfoCardVariants;
  buildHistoryLength?: number;
}) => {
  const { entity } = useEntity();
  return !isAWSCodeBuildProjectAvailable(entity) ? (
    <MissingAnnotationEmptyState
      annotation={AWS_CODEBUILD_PROJECT_ARN_ANNOTATION}
    />
  ) : (
    <BuildLatestRunCard
      entity={entity}
      buildHistoryLength={buildHistoryLength}
      variant={variant}
    />
  );
};
