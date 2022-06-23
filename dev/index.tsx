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

import { createDevApp } from '@backstage/dev-utils';
import { codeSuitePlugin } from '../src/plugin';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import {
  AnyApiRef,
} from '@backstage/core-plugin-api';
import { codeSuiteApiRef } from '../src';
import { MockCodeSuiteClient } from '../src/mocks/MockCodeSuiteClient';
import { entityAllMock, entityBuildMock, entityDeployMock, entityNoneMock, entityPipelineMock } from '../src/mocks/mocks';
import { CITable } from '../src/components/BuildsPage/lib/CITable';
import { CodeSuiteCards } from '../src/components/CodeSuiteCards/CodeSuiteCards';
import { Grid } from '@material-ui/core';
import { AWSCodeBuildWidget } from '../src/components/CodeBuildWidget/CodeBuildWidget';
import { AWSCodeDeployWidget } from '../src/components/CodeDeployWidget/CodeDeployWidget';
import { AWSCodePipelineWidget } from '../src/components/CodePipelineWidget/CodePipelineWidget';

const apis: [AnyApiRef, Partial<unknown>][] = [
  [codeSuiteApiRef, new MockCodeSuiteClient()],
];

createDevApp()
  .addPage({
    path: '/fixture-build-card',
    title: 'CodeBuild Card',
    element: (
    <TestApiProvider apis={apis}>
      <EntityProvider entity={entityBuildMock}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <AWSCodeBuildWidget />
          </Grid>
          <Grid item md={12}>
            <AWSCodeBuildWidget buildHistoryLength={0} />
          </Grid>
        </Grid>
      </EntityProvider>
    </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-deploy-card',
    title: 'CodeDeploy Card',
    element: (
    <TestApiProvider apis={apis}>
      <EntityProvider entity={entityDeployMock}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <AWSCodeDeployWidget />
          </Grid>
          <Grid item md={12}>
            <AWSCodeDeployWidget deploymentHistoryLength={0} />
          </Grid>
        </Grid>
      </EntityProvider>
    </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-pipeline-card',
    title: 'CodePipeline Card',
    element: (
    <TestApiProvider apis={apis}>
      <EntityProvider entity={entityPipelineMock}>
        <AWSCodePipelineWidget />
      </EntityProvider>
    </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-all-cards',
    title: 'All Cards',
    element: (
    <TestApiProvider apis={apis}>
      <EntityProvider entity={entityAllMock}>
        <Grid container spacing={3} alignItems="stretch">
          <CodeSuiteCards />
        </Grid>
      </EntityProvider>
    </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-missing-annotations',
    title: 'Missing Annotations',
    element: (
    <TestApiProvider apis={apis}>
      <EntityProvider entity={entityNoneMock}>
        <AWSCodeBuildWidget />
        <AWSCodeDeployWidget />
        <AWSCodePipelineWidget />
      </EntityProvider>
    </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-all-tables',
    title: 'All Tables',
    element: (
    <TestApiProvider apis={apis}>
      <EntityProvider entity={entityAllMock}>
        <CITable />
      </EntityProvider>
    </TestApiProvider>
    ),
  })
  .registerPlugin(codeSuitePlugin).render();
