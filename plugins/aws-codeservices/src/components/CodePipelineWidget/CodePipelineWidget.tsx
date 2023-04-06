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
  GetPipelineStateOutput,
  StageState,
} from "@aws-sdk/client-codepipeline";
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
import { AWS_CODEPIPELINE_ARN_ANNOTATION } from "../../constants";
import { useCodePipelineSummary } from "../../hooks";
import { getCodePipelineArnFromEntity } from "../../utils";
import { AboutField } from "../AboutField";
import { isAWSCodePipelineAvailable } from "../Flags";
import { PipelineStageStatus } from "../PipelineStageStatus";

const PipelineStageTable = ({
  stages,
  paging,
}: {
  stages: StageState[];
  paging: boolean;
}) => {
  const columns: TableColumn[] = [
    {
      title: "Stage",
      field: "id",
      render: (row: Partial<StageState>) => {
        return row.stageName;
      },
    },
    {
      title: "Status",
      field: "deploymentStatus",
      render: (row: Partial<StageState>) => (
        <PipelineStageStatus status={row.latestExecution?.status} />
      ),
    },
  ];

  return (
    <div>
      <Table
        options={{
          paging: paging,
          search: false,
          toolbar: false,
          padding: "dense",
        }}
        data={stages}
        columns={columns}
      />
    </div>
  );
};

const PipelineWidgetContent = ({
  pipelineState,
  region,
  paging,
}: {
  pipelineState: GetPipelineStateOutput;
  region: string;
  paging: boolean;
}) => {
  const pipelineUrl = `https://${region}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipelineState.pipelineName}/view?region=${region}`;

  return (
    <InfoCard title="AWS CodePipeline" noPadding>
      <Box sx={{ m: 2 }}>
        <Grid container>
          <AboutField label="Pipeline Name" gridSizes={{ md: 12 }}>
            <Link href={pipelineUrl} target="_blank">
              {pipelineState.pipelineName}
            </Link>
          </AboutField>
        </Grid>
      </Box>
      <PipelineStageTable
        stages={pipelineState.stageStates ?? []}
        paging={paging}
      />
    </InfoCard>
  );
};

const PipelineLatestRunCard = ({
  entity,
  variant,
  paging,
}: {
  entity: Entity;
  variant?: InfoCardVariants;
  paging: boolean;
}) => {
  const { region, arn } = getCodePipelineArnFromEntity(entity);

  const { pipelineInfo, error, loading } = useCodePipelineSummary(arn);

  if (pipelineInfo) {
    return (
      <PipelineWidgetContent
        pipelineState={pipelineInfo}
        region={region}
        paging={paging}
      />
    );
  }

  return (
    <InfoCard title="AWS CodePipeline" variant={variant}>
      {error && <ResponseErrorPanel error={error} />}

      {loading && <LinearProgress />}
    </InfoCard>
  );
};

export const AWSCodePipelineWidget = ({
  variant,
  paging = false,
}: {
  variant?: InfoCardVariants;
  paging?: boolean;
}) => {
  const { entity } = useEntity();
  return !isAWSCodePipelineAvailable(entity) ? (
    <MissingAnnotationEmptyState annotation={AWS_CODEPIPELINE_ARN_ANNOTATION} />
  ) : (
    <PipelineLatestRunCard entity={entity} variant={variant} paging={paging} />
  );
};
