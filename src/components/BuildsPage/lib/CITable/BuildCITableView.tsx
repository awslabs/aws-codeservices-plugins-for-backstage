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
import { Box, Typography} from '@material-ui/core';
import { Link } from '@material-ui/core';
import RetryIcon from '@material-ui/icons/Replay';
import { Table, TableColumn } from '@backstage/core-components';
/* import {Exception } from '../../../../api/ServiceApi'; */
import {Build} from "@aws-sdk/client-codebuild";
import { BuildStatus } from '../../../BuildStatus';

const generatedColumns: TableColumn[] = [
  {
    title: 'Builds',
    field: 'name',
    render: (row: Partial<Build>) => {
      if (row.id !== undefined) {
        const arn = row.arn?.split(':');
        if (arn === undefined) {
          return (<> {row.id} </>)
        }
        return (
          <Link href={`https://${arn[3]}.console.aws.amazon.com/codesuite/codebuild/${arn[4]}/${arn[5].replace('build','projects')}/${arn[5]}:${arn[6]}`} 
          target="_blank" >
            {row.id}
          </Link>
        );
      }
      return (<> {row.id} </>);
    },
  },
  {
    title: 'Number',
    field: 'number',
    render: (row: Partial<Build>) => {
      return (
        <>
          {row.buildNumber}
        </>
      );
    },
  },
  {
    title: 'Submitter',
    field: 'submitter',
    render: (row: Partial<Build>) => {
      return (
        <>
          {row.initiator}
        </>
      );
    },
  },
  {
    title: 'Status',
    field: 'status',
    render: (row: Partial<Build>) => {
      return (
        <Box display="flex" alignItems="center">
          <BuildStatus status={row.buildStatus} />
        </Box>
      );
    },
  },
  {
    title: 'Duration',
    field: 'duration',
    render: (row: Partial<Build>) => {
      if (row.endTime !== undefined && row.startTime !== undefined) {
        return (
          <>
            {(row.endTime.getTime() - row.startTime.getTime()) / 1000} Seconds
          </>
        );
      }
      return(<></>);
    },
  },
];

type Props = {
  loading: boolean;
  retry: () => void;
  builds?: Build[];
};

export const BuildCITableView = ({
  loading,
  builds,
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
      data={builds ?? []}
      title={
        <Box display="flex" alignItems="center">
          <Box mr={2} />
          <Typography variant="h6">AWS CodeBuild</Typography>
        </Box>
      }
      columns={generatedColumns}
    />
  );
};
