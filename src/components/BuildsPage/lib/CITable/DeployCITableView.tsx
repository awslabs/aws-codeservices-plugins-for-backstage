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
import {DeploymentInfo} from "@aws-sdk/client-codedeploy";
import {useEntity} from '@backstage/plugin-catalog-react';
import {REGION_ANNOTATION} from '../../../../constants';

const generatedColumns: TableColumn[] = [
  {
    title: 'Id',
    field: 'id',

    render: (row: Partial<DeploymentInfo>) => {
      const {entity} = useEntity();
      const region = entity?.metadata.annotations?.[REGION_ANNOTATION] ?? '';
      return (
         <> <Link
              href={"https://" + region + ".console.aws.amazon.com/codesuite/codedeploy/deployments/" + row.deploymentId + "?" + region }
              target="_blank">
            {row.deploymentId}
          </Link></>
      );
    },
  },
  {
    title: 'Plaform',
    field: '',
    highlight: true,
    render: (row: Partial<DeploymentInfo>) => {
        return (
          <>
            {row.computePlatform}
          </>
        );
    },
  },
  {
    title: 'Creator',
    field: 'creator',
    render: (row: Partial<DeploymentInfo>) => {
      return (
        <>
          {row.creator}
        </>
      );
    },
  },
  {
    title: 'Status',
    field: 'status',
    render: (row: Partial<DeploymentInfo>) => {
      return (
        <Box display="flex" alignItems="center">
          <RunStatus status={row.status?.toLowerCase()} />
        </Box>
      );
    },
  },
  {
    title: 'Duration',
    field: 'duration',
    render: (row: Partial<DeploymentInfo>) => {
      if (row.completeTime != undefined && row.createTime != undefined) {
        if ( row.completeTime instanceof Date && row.createTime instanceof Date) {
        return (
          <>
            {(row.completeTime.getTime() - row.createTime.getTime()) / 1000} Seconds
          </>
        );
      }
      return (<></>)
    }else {
        return(<></>);
      }
    },
  },
];

type Props = {
  loading: boolean;
  retry: () => void;
  deployments?: DeploymentInfo[];
};

export const DeployCITableView = ({
  loading,
  deployments,
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
      data={deployments ?? []}
      title={
        <Box display="flex" alignItems="center">
          <Box mr={2} />
          <Typography variant="h6">CodeDeploy Data</Typography>
        </Box>
      }
      columns={generatedColumns}
    />
  );
};
