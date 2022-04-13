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
import { Box, IconButton, Typography} from '@material-ui/core';
import { Modal } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import RetryIcon from '@material-ui/icons/Replay';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import CloseIcon from '@material-ui/icons/Close';
/* import { generatePath, Link as RouterLink } from 'react-router-dom'; */
import { RunStatus } from '../Status';
import { getBuilds } from '../../../useBuilds';
/* import { buildRouteRef } from '../../../../plugin'; */
import { Table, TableColumn } from '@backstage/core-components';
/* import {Exception } from '../../../../api/ServiceApi'; */
import {Build} from "@aws-sdk/client-codebuild";

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
      if (!row.id || !row.projectName) {
        return (
          <>
            {row.id ||
              row.projectName ||
              'Unknown'}
          </>
        );
      }

      return (
        row.id
        /* <Link */
        /*   component={RouterLink} */
        /*   to={generatePath(buildRouteRef.path, { */
        /*     jobFullName: encodeURIComponent(row.id), */
        /*     buildNumber: String(row.buildNumber), */
        /*   })} */
        /* > */
          /* {row.id} */
        /* </Link> */
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
  /* { */
  /*   title: 'Failure Diagnosis', */
  /*   render: (row: Partial<BatchGetBuildsOutput>) => ( */
  /*     <> */
  /*       <p>{getDiagnosis(row)}</p> */
  /*     </> */
  /*   ), */
  /* }, */
  /* { */
  /*   title: 'Error', */
  /*   field: 'lastBuild.source.branchName', */
  /*   render: (row: Partial<BatchGetBuildsOutput>) => { */
  /*       var exception = getError(row); */
  /*       if (!exception) */
  /*         return (<></>) */

  /*       return ( */
  /*         simpleModal(exception.exceptionType, exception.details.errors[0]) */
  /*       ); */
  /*   }, */
  /* }, */
  /* { */
  /*   title: 'Actions', */
  /*   sorting: false, */
  /*   render: (row: Partial<Build>) => ( */
  /*     <Tooltip title="Rerun pipeline"> */
  /*       <IconButton onClick={row.onRestartClick}> */
  /*         <RetryIcon /> */
  /*       </IconButton> */
  /*     </Tooltip> */
  /*   ), */
  /*   width: '10%', */
  /* }, */
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

  return (
    <CITableView
      loading={loading}
      builds={buildOutput}
      retry={retry}
    />
  );
};

/* export function getDiagnosis(p : Partial<BatchGetBuildsOutput>) { */
/*   if (!p) */
/*     return "invalid build"; */

/*   if (p.status && p.status.toLowerCase() == "success") { */
/*     return "all good"; */
/*   } */

/*   var ref : string = "" */
/*   if (!p.stages) */
/*     return "invalid stages"; */

/*   p.stages.forEach((s : Stage) => { */
/*       if (s.status.toLowerCase() != "terminal") { */
/*         return; */
/*       } */
/*       ref += s.name; */
/*       s.tasks.forEach((t: Task) => { */
/*         if (t.status.toLowerCase() != "terminal") { */
/*           return; */
/*         } */
/*         ref += " > " + t.name; */
/*       }) */
/*   }) */
/*   return ref */
/* } */

/* export function getError(p : Partial<BatchGetBuildsOutput>) : (Exception  | undefined) { */
/*   if (!p || !p.stages || !p.status || p.status.toLowerCase() != "terminal") */
/*     return undefined; */

/*   let details : Exception | undefined = undefined; */
/*   p.stages.forEach((s : Stage) => { */
/*       if (s.status.toLowerCase() != "terminal") { */
/*         return; */
/*       } */

/*       if (s.outputs && s.outputs.failureMessage) { */
/*         details = { */
/*           exceptionType: "Failed Output", */
/*           details: { */
/*             stackTrace: "", */
/*             error: "Failed Output", */
/*             errors: [s.outputs.failureMessage] */
/*           } */
/*         } */
/*         return; */
/*       } */

/*       if (!s.context || */
/*           !s.context.exception || */
/*           !s.context.exception.details || */
/*           !s.context.exception.details.errors) { */
/*           return */
/*       } */

/*       if (!s.context.exception.details || s.context.exception.details.errors.length < 1) */
/*         return; */

/*       details = s.context.exception; */
/*       return; */
/*   }) */
/*   return details */
/* } */

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
