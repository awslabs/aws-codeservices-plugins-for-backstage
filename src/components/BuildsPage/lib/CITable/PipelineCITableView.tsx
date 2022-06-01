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

import React from 'react';
import {Box, Typography, Link} from '@material-ui/core';
import RetryIcon from '@material-ui/icons/Replay';
import { Table, TableColumn } from '@backstage/core-components';
import { PipelineExecutionSummary } from "@aws-sdk/client-codepipeline";
import {useEntity} from '@backstage/plugin-catalog-react';
import {PIPELINE_ARN_ANNOTATION} from '../../../../constants';
import { PipelineStageStatus } from '../../../PipelineStageStatus';

const generatedColumns: TableColumn[] = [
  {
    title: 'Pipeline',
    field: 'Pipeline',

    render: (row: Partial<PipelineExecutionSummary>) => {
      if (row.pipelineExecutionId) {
          // eslint-disable-next-line
          const {entity} = useEntity();
          const pipelineARN = entity?.metadata.annotations?.[PIPELINE_ARN_ANNOTATION] ?? '';
          const arnElements = pipelineARN.split(":")
          if (arnElements.length < 6)
            return [];

          const region = arnElements[3];
          const pipelineName = arnElements[5]
          return (
            <>
              <Link href={`https://${region}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipelineName}/executions/${row.pipelineExecutionId}/timeline?region=${region}`}
              target="_blank">
                {row.pipelineExecutionId}
              </Link>
            </>
          );
      }
      return(<></>);
    },
  },
  {
    title: 'Last Run',
    field: '',
    render: (row: Partial<PipelineExecutionSummary>) => {
       if (row.lastUpdateTime) {
        return (<p>{row.lastUpdateTime.toLocaleString()}</p>)
      }
      return(<></>);
    },
  },
  {
    title: 'Status',
    field: 'status',
    render: (row: Partial<PipelineExecutionSummary>) => {
      if (row.status) {
        return (
          <Box display="flex" alignItems="center">
            <PipelineStageStatus status={row?.status}/>
          </Box>
        );
      }
      return(<></>);
    },
  },
  {
    title: 'Trigger Type',
    field: 'trigger type',
    render: (row: Partial<PipelineExecutionSummary>) => {
      if (row.trigger) {
        return (
          <>{row.trigger.triggerType}</>
        );
      }
      return(<></>);
    },
  },
  {
    title: 'Trigger Detail',
    field: 'trigger detail',
    render: (row: Partial<PipelineExecutionSummary>) => {
      if (row.trigger) {
        return (
          <>{row.trigger.triggerDetail}</>
        );
      }
      return(<></>);
    },
  }
];

type Props = {
  loading: boolean;
  retry: () => void;
  pipelineRunsSummaries?: PipelineExecutionSummary[];
};

export const PipelineCITableView = ({
  loading,
  pipelineRunsSummaries,
  retry,
}: Props) => {
    return (
      <Table
        isLoading={loading}
        actions={[
          {
            icon: () => <RetryIcon />,
            tooltip: 'Refresh Data',
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
        columns={generatedColumns}
      />
    );
  };

