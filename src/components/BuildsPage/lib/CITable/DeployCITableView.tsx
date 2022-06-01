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
import {Box, Link, Typography} from '@material-ui/core';
import RetryIcon from '@material-ui/icons/Replay';
import { Table, TableColumn } from '@backstage/core-components';
import {DeploymentInfo} from "@aws-sdk/client-codedeploy";
import {useEntity} from '@backstage/plugin-catalog-react';
import {DEPLOY_GROUP_ARN_ANNOTATION} from '../../../../constants';
import { DeploymentStatus } from '../../../DeploymentStatus';
import { Entity } from '@backstage/catalog-model';
import { useCodeDeployDeployments } from '../../../../hooks';

const generatedColumns: TableColumn[] = [
  {
    title: 'Id',
    field: 'id',

    render: (row: Partial<DeploymentInfo>) => {
      // eslint-disable-next-line
      const {entity} = useEntity();
      const deployARN = entity?.metadata.annotations?.[DEPLOY_GROUP_ARN_ANNOTATION] ?? '';
      const arnElements = deployARN.split(":")
      if (arnElements.length < 7)
        return [];

      const region = arnElements[3];
      return (
         <> <Link
              href={`https://${region}.console.aws.amazon.com/codesuite/codedeploy/deployments/${row.deploymentId}?${region}`}
              target="_blank">
            {row.deploymentId}
          </Link></>
      );
    },
  },
  {
    title: 'Plaform',
    field: '',
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
          <DeploymentStatus status={row.status} />
        </Box>
      );
    },
  },
  {
    title: 'Duration',
    field: 'duration',
    render: (row: Partial<DeploymentInfo>) => {
      if (row.completeTime !== undefined && row.createTime !== undefined) {
        if ( row.completeTime instanceof Date && row.createTime instanceof Date) {
        return (
          <>
            {(row.completeTime.getTime() - row.createTime.getTime()) / 1000} Seconds
          </>
        );
      }
      return (<></>)
    }
    return(<></>);
    },
  },
];

type Props = {
  entity: Entity;
};

export const DeployCITableView = ({
  entity,
}: Props) => {
  const {loading, deploymentsInfo, retry} = useCodeDeployDeployments(entity);
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
      data={deploymentsInfo ?? []}
      title={
        <Box display="flex" alignItems="center">
          <Box mr={2} />
          <Typography variant="h6">AWS CodeDeploy</Typography>
        </Box>
      }
      columns={generatedColumns}
    />
  );
};
