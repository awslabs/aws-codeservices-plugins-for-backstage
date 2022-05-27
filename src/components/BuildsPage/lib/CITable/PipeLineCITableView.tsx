/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import {Box, Typography, Link} from '@material-ui/core';
import RetryIcon from '@material-ui/icons/Replay';
import { RunStatus } from '../Status';
import { Table, TableColumn } from '@backstage/core-components';
import { PipelineExecutionSummary } from "@aws-sdk/client-codepipeline";
import {useEntity} from '@backstage/plugin-catalog-react';
import {REGION_ANNOTATION} from '../../../../constants';

const generatedColumns: TableColumn[] = [
  {
    title: 'Pipeline',
    field: 'Pipeline',

    render: (row: Partial<PipelineExecutionSummary>) => {
      if (row.pipelineExecutionId) {
          // eslint-disable-next-line
          const {entity} = useEntity();
          const region = entity?.metadata.annotations?.[REGION_ANNOTATION] ?? '';
          return (
            <>
              <Link href={`https://${region}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${"Hello-world-pipeline"}/executions/${row.pipelineExecutionId}/timeline?region=${region}`} 
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
    highlight: true,
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
            <RunStatus status={row?.status}/>
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
  region: string;
  pipelineRunsSummaries?: PipelineExecutionSummary[];
  pipelineName: string;
};

export const PipelineCITableView = ({
  loading,
  pipelineRunsSummaries,
  pipelineName,
  region,
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
            <Typography variant="h6">AWS CodePipeline: &nbsp;
              <a href={`https://${region}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipelineName}/view?${region}`}
              target="_blank">{pipelineName}</a>
            </Typography>
          </Box>
        }
        columns={generatedColumns}
      />
    );
  };

