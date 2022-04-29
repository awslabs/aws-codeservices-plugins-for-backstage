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
import {Box, Link, Typography} from '@material-ui/core';
import RetryIcon from '@material-ui/icons/Replay';
import { RunStatus } from '../Status';
import { Table, TableColumn } from '@backstage/core-components';
import {GetPipelineStateOutput, StageState} from "@aws-sdk/client-codepipeline";



const generatedColumns: TableColumn[] = [
  {
    title: 'State',
    field: 'State',

    render: (row: Partial<StageState>) => {
      if (row !== undefined) {
          return (
             <>
                {row.stageName}
             </> 
            );
      }
      else return(<></>);
    },
  },
  {
    title: 'Id',
    field: '',
    highlight: true,
    render: (row: Partial<StageState>) => {
      if (row.actionStates != null) {
        return (
             <>
             <Link
                 href={row.actionStates[0].entityUrl }
                 target="_blank">
                {row.actionStates[0].latestExecution?.actionExecutionId}
             </Link>
             </>
        );
      }
      else return(<></>);
    },
  },
  {
    title: 'Status',
    field: 'status',
    render: (row: Partial<StageState>) => {
      if (row.actionStates != null) {
        return (
          <Box display="flex" alignItems="center">
             <RunStatus status={row?.actionStates[0]?.latestExecution?.status} />
          </Box>
        );
      }
      else return(<></>);
    },
  }
];

type Props = {
  loading: boolean;
  retry: () => void;
  region: string;
  pipelineInfo?: GetPipelineStateOutput;
};

export const PipeLineCITable = ({
  loading,
  pipelineInfo,
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
        data={pipelineInfo?.stageStates ?? []}
        title={
          <Box display="flex" alignItems="center">
            <Box mr={2} />
            <Typography variant="h6">CodePipeline: &nbsp; 
              <Link href={"https://" + region + ".console.aws.amazon.com/codesuite/codepipeline/pipelines/" + pipelineInfo?.pipelineName + "/view?" + region }
              target="_blank">{pipelineInfo?.pipelineName}</Link>
            </Typography>
          </Box>
        }
        columns={generatedColumns}
      />
    );
  };
  

