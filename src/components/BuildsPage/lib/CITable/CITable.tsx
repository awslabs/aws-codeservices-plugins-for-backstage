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
import Grid from '@material-ui/core/Grid';
import {BuildCITableView} from './BuildCITableView';
import {DeployCITableView} from './DeployCITableView';
import {PipelineCITableView} from './PipelineCITableView';
import {isBuildAvailable, isDeployAvailable, isPipelineAvailable} from '../../../Flags';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useCodeBuildBuilds, useCodeDeployDeployments, useCodePipelineExecutions } from '../../../../hooks';

export const CITable = () => {
  const {loading, buildOutput, retry} = useCodeBuildBuilds();
  const {loading: loadingd, deploymentsInfo, retry: retryd} = useCodeDeployDeployments();
  const {loading: loadingSummaries,  pipelineRunsSummaries, retry: retrySummaries} = useCodePipelineExecutions();
  const { entity } = useEntity();

  return (
    <>
      { isPipelineAvailable(entity) &&
        <Grid item sm={12}>
            <PipelineCITableView
                loading={loadingSummaries}
                pipelineRunsSummaries={pipelineRunsSummaries}
                retry={retrySummaries}
            />
        </Grid>
      }
      { isBuildAvailable(entity) &&
        <Grid item sm={12}>
          <BuildCITableView
            loading={loading}
            builds={buildOutput}
            retry={retry}
          />
        </Grid>
      }
      { isDeployAvailable(entity) &&
        <Grid item sm={12}>
          <DeployCITableView
            loading={loadingd}
            deployments={deploymentsInfo}
            retry={retryd}
          />
        </Grid>
      }
    </>
  );
};
