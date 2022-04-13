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
import { Box, Typography} from '@material-ui/core';
import { Link } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import RetryIcon from '@material-ui/icons/Replay';
import { RunStatus } from '../Status';
import { getBuilds } from '../../../useBuilds';
import { getDeployments } from '../../../useBuilds';
/* import { buildRouteRef } from '../../../../plugin'; */
import { Table, TableColumn } from '@backstage/core-components';
/* import {Exception } from '../../../../api/ServiceApi'; */
import {Build} from "@aws-sdk/client-codebuild";
import {DeployCITableView} from './DeployCITable';

const generatedColumns: TableColumn[] = [
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
    title: 'Builds',
    field: 'name',
    highlight: true,
    render: (row: Partial<Build>) => {
      console.log("row.arn = ...",row.arn);
      if (row.id != undefined) {
        const arn = row.arn?.split(':');
        console.log("Array of Arn is",arn);
        if (arn == undefined) {
          return (<> {row.id} </>)
        }
        return (
          <Link href={"https://"+arn[3]+".console.aws.amazon.com/codesuite/codebuild/"+arn[4]+"/"+arn[5].replace('build','projects')+"/"+arn[5]+":"+arn[6]} target="_blank" >
            {row.id}
          </Link>
        );
      } else {
        console.log("else looop....");
        return (<> {row.id} </>);
      }
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
          <RunStatus status={row.buildStatus?.toLowerCase()} />
        </Box>
      );
    },
  },
  {
    title: 'Duration',
    field: 'duration',
    render: (row: Partial<Build>) => {
      if (row.endTime != undefined && row.startTime != undefined) {
        return (
          <>
            {(row.endTime.getTime() - row.startTime.getTime()) / 1000} Seconds
          </>
        );
      } else {
        return(<></>);
      }
    },
  },
];

type Props = {
  loading: boolean;
  retry: () => void;
  builds?: Build[];
};

export const CITableView = ({
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
          <Typography variant="h6">CodeBuild Data</Typography>
        </Box>
      }
      columns={generatedColumns}
    />
  );
};

export const CITable = () => {
  const {loading, buildOutput, retry} = getBuilds();
  const {loadingd, deploymentsInfo, retryd} = getDeployments();

  return (
    <>
      <Grid item sm={12}>
        <CITableView
          loading={loading}
          builds={buildOutput}
          retry={retry}
        />
      </Grid>
      <Grid item sm={12}>
        <DeployCITableView
          loading={loadingd}
          deployments={deploymentsInfo}
          retry={retryd}
        />
      </Grid>
    </>
  );
};
