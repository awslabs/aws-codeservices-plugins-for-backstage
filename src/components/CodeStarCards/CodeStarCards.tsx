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

import {
  InfoCardVariants
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Grid } from "@material-ui/core";
import React from 'react';
import { AWSCodeBuildWidget } from '../CodeBuildWidget/CodeBuildWidget';
import { AWSCodeDeployWidget } from '../CodeDeployWidget/CodeDeployWidget';
import { AWSCodePipelineWidget } from '../CodePipelineWidget/CodePipelineWidget';
import { isAWSCodeBuildAvailable, isAWSCodeDeployAvailable, isAWSCodePipelineAvailable } from '../Flags';

export const CodeStarCards = ({
  variant,
}: {
  variant?: InfoCardVariants;
}) => {
  const { entity } = useEntity();
  return(
    <>
      { isAWSCodePipelineAvailable(entity) &&
        <Grid item md={6} xs={12}>
          <AWSCodePipelineWidget variant={variant} />
        </Grid>
      }
      { isAWSCodeBuildAvailable(entity) &&
        <Grid item md={6} xs={12}>
          <AWSCodeBuildWidget variant={variant} />
        </Grid>
      }
      { isAWSCodeDeployAvailable(entity) &&
        <Grid item md={6} xs={12}>
          <AWSCodeDeployWidget variant={variant} />
        </Grid>
      }
    </>
  );
};
