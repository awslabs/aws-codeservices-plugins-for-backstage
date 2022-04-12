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
import { Box, IconButton, Link, Typography, Tooltip} from '@material-ui/core';
import { Modal } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import RetryIcon from '@material-ui/icons/Replay';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import CloseIcon from '@material-ui/icons/Close';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import { RunStatus } from '../Status';
/* import { getLatestAppExecutions } from '../../../useBuilds'; */
/* import { buildRouteRef } from '../../../../plugin'; */
import { Table, TableColumn } from '@backstage/core-components';
/* import { Pipeline, Stage, Task, Exception } from '../../../../api/SpinnakerApi'; */

const generatedColumns: TableColumn[] = [
  {
    title: 'Pipeline',
    field: 'name',
    highlight: true,
    render: (row: Partial<Pipeline>) => {
      if (!row.name || !row.application) {
        return (
          <>
            {row.name ||
              row.application ||
              'Unknown'}
          </>
        );
      }

      return (
        <Link
          component={RouterLink}
          to={generatePath(buildRouteRef.path, {
            jobFullName: encodeURIComponent(row.name),
            buildNumber: String(row.application),
          })}
        >
          {row.name}
        </Link>
      );
    },
  },
  {
    title: 'Status',
    field: 'status',
    render: (row: Partial<Pipeline>) => {
      return (
        <Box display="flex" alignItems="center">
          <RunStatus status={row.status} />
        </Box>
      );
    },
  },
  {
    title: 'Failure Diagnosis',
    render: (row: Partial<Pipeline>) => (
      <>
        <p>{getDiagnosis(row)}</p>
      </>
    ),
  },
  {
    title: 'Error',
    field: 'lastBuild.source.branchName',
    render: (row: Partial<Pipeline>) => {
        var exception = getError(row);
        if (!exception)
          return (<></>)

        return (
          simpleModal(exception.exceptionType, exception.details.errors[0])
        );
    },
  },
  {
    title: 'Actions',
    sorting: false,
    render: (row: Partial<Pipeline>) => (
      <Tooltip title="Rerun pipeline">
        <IconButton onClick={row.onRestartClick}>
          <RetryIcon />
        </IconButton>
      </Tooltip>
    ),
    width: '10%',
  },
];

type Props = {
  loading: boolean;
  retry: () => void;
  pipelines?: Pipeline[];
};

export const CITableView = ({
  loading,
  retry,
  pipelines,
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
      data={pipelines ?? []}
      title={
        <Box display="flex" alignItems="center">
          <Box mr={2} />
          <Typography variant="h6">Spinnaker Pipelines</Typography>
        </Box>
      }
      columns={generatedColumns}
    />
  );
};

export const CITable = () => {
  const {appExecs, retry, loading} = getLatestAppExecutions();

  return (
    <CITableView
      loading={loading}
      pipelines={appExecs}
      retry={retry}
    />
  );
};

export function getDiagnosis(p : Partial<Pipeline>) {
  if (!p)
    return "invalid pipeline";

  if (p.status && p.status.toLowerCase() == "success") {
    return "all good";
  }

  var ref : string = ""
  if (!p.stages)
    return "invalid stages";

  p.stages.forEach((s : Stage) => {
      if (s.status.toLowerCase() != "terminal") {
        return;
      }
      ref += s.name;
      s.tasks.forEach((t: Task) => {
        if (t.status.toLowerCase() != "terminal") {
          return;
        }
        ref += " > " + t.name;
      })
  })
  return ref
}

export function getError(p : Partial<Pipeline>) : (Exception  | undefined) {
  if (!p || !p.stages || !p.status || p.status.toLowerCase() != "terminal")
    return undefined;

  let details : Exception | undefined = undefined;
  p.stages.forEach((s : Stage) => {
      if (s.status.toLowerCase() != "terminal") {
        return;
      }

      if (s.outputs && s.outputs.failureMessage) {
        details = {
          exceptionType: "Failed Output",
          details: {
            stackTrace: "",
            error: "Failed Output",
            errors: [s.outputs.failureMessage]
          }
        }
        return;
      }

      if (!s.context ||
          !s.context.exception ||
          !s.context.exception.details ||
          !s.context.exception.details.errors) {
          return
      }

      if (!s.context.exception.details || s.context.exception.details.errors.length < 1)
        return;

      details = s.context.exception;
      return;
  })
  return details
}

export function simpleModal(title: string, content: string) {
      const [open, setOpen] = React.useState(false);

      const handleOpen = () => {
        setOpen(true);
      };

      function getModalStyle() {
        const top = 50;
        const left = 50;

        return {
          top: `${top}%`,
          left: `${left}%`,
          transform: `translate(-${top}%, -${left}%)`,
          'overflow-wrap': 'break-word',
          'overflow-y': 'auto',
          border: '1px solid #000',
          padding: '3px',
          'background-color': 'rgba(250, 250, 230, 0.8)',
        };
      }

      const [modalStyle] = React.useState(getModalStyle);

      const handleClose = () => {
        setOpen(false);
      };

    const body = (
      <p>
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <h2>{title}</h2>
            </Grid>
          </Grid>
          <p>{content}</p>
      </p>
    );

      return (
      <div>
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <p>See Details</p>
          </Grid>
          <Grid item>
            <IconButton onClick={handleOpen}>
              <KeyboardArrowRightIcon/>
            </IconButton>
          </Grid>
        </Grid>
        <Modal
          style={modalStyle}
          open={open}
          onClose={handleClose}
        >
          {body}
        </Modal>
      </div>);
}
