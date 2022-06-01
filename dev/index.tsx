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
import { codeStarPlugin } from '../src/plugin';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import {
  AnyApiRef,
} from '@backstage/core-plugin-api';
import { BuildLatestRunCard, codeStarApiRef, DeployLatestRunCard, PipelineLatestRunCard } from '../src';
import { MockCodeStarClient } from '../src/mocks/MockCodeStarClient';
import { entityAllMock, entityBuildMock, entityDeployMock, entityPipelineMock } from '../src/mocks/mocks';
import { CITable } from '../src/components/BuildsPage/lib/CITable';

const apis: [AnyApiRef, Partial<unknown>][] = [
  [codeStarApiRef, new MockCodeStarClient()],
];

createDevApp()
  .addPage({
    path: '/fixture-build',
    title: 'CodeBuild',
    element: (
    <TestApiProvider apis={apis}>
      <EntityProvider entity={entityBuildMock}>
        <BuildLatestRunCard />
      </EntityProvider>
    </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-deploy',
    title: 'CodeDeploy',
    element: (
    <TestApiProvider apis={apis}>
      <EntityProvider entity={entityDeployMock}>
        <DeployLatestRunCard />
      </EntityProvider>
    </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-pipeline-run',
    title: 'CodePipeline',
    element: (
    <TestApiProvider apis={apis}>
      <EntityProvider entity={entityPipelineMock}>
        <PipelineLatestRunCard />
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
  .registerPlugin(codeStarPlugin).render();
