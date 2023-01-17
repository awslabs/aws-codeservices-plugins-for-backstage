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
import { Box, Typography, Link } from "@material-ui/core";
import RetryIcon from "@material-ui/icons/Replay";
import { Table, SubvalueCell } from "@backstage/core-components";
import { PipelineExecutionSummary } from "@aws-sdk/client-codepipeline";
import { Entity } from "@backstage/catalog-model";
import { formatTime, getCodePipelineArnFromEntity } from "../../utils";
import { PipelineStageStatus } from "../PipelineStageStatus";
import { useCodePipelineExecutions } from "../../hooks";

const renderTrigger = (
  row: Partial<PipelineExecutionSummary>
): React.ReactNode => {
  if (row.sourceRevisions === undefined) {
    return (
      <Typography variant="body2" noWrap>
        -
      </Typography>
    );
  }

  let commitMessage = "";

  if (row.sourceRevisions.length > 0) {
    const sourceRevision = row.sourceRevisions[0];

    if (sourceRevision.revisionSummary) {
      switch (sourceRevision.actionName) {
        case "SourceAction":
          commitMessage = sourceRevision.revisionSummary || "";
          break;
        case "Source":
          commitMessage = sourceRevision.revisionSummary || "";
          break;
        case "Checkout": {
          const summary = JSON.parse(sourceRevision.revisionSummary || "{}");

          commitMessage = summary.CommitMessage;
          break;
        }
        default:
          break;
      }
    }

    const subvalue = (
      <>
        {sourceRevision.revisionId?.substring(0, 6) || ""} - {commitMessage}
      </>
    );
    return (
      <SubvalueCell value={sourceRevision.actionName} subvalue={subvalue} />
    );
  }

  return "-";
};

const generatedColumns = (pipelineName: string, region: string) => {
  return [
    {
      title: "Execution",
      field: "Pipeline",

      render: (row: Partial<PipelineExecutionSummary>) => {
        if (row.pipelineExecutionId) {
          return (
            <>
              <Link
                href={`https://${region}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipelineName}/executions/${row.pipelineExecutionId}/timeline?region=${region}`}
                target="_blank"
              >
                {row.pipelineExecutionId}
              </Link>
            </>
          );
        }
        return <></>;
      },
    },
    {
      title: "Last Run",
      field: "",
      render: (row: Partial<PipelineExecutionSummary>) =>
        `${formatTime(row.lastUpdateTime)} ago`,
    },
    {
      title: "Status",
      field: "status",
      render: (row: Partial<PipelineExecutionSummary>) => {
        if (row.status) {
          return (
            <Box display="flex" alignItems="center">
              <PipelineStageStatus status={row?.status} />
            </Box>
          );
        }
        return <></>;
      },
    },
    {
      title: "Source Revision",
      field: "revisions",
      render: (row: Partial<PipelineExecutionSummary>) => renderTrigger(row),
    },
  ];
};

type Props = {
  entity: Entity;
};

export const AWSCodePipelineExecutionsTable = ({ entity }: Props) => {
  const { pipelineName, region, arn } = getCodePipelineArnFromEntity(entity);

  const { loading, pipelineRunsSummaries, retry } =
    useCodePipelineExecutions(arn);
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
      data={pipelineRunsSummaries ?? []}
      title={
        <Box display="flex" alignItems="center">
          <Box mr={2} />
          <Typography variant="h6">AWS CodePipeline</Typography>
        </Box>
      }
      columns={generatedColumns(pipelineName, region)}
    />
  );
};
