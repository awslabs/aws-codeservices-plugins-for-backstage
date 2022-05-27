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
import { CodeStar } from '../src/components/Router';
import { entityAllMock, entityBuildMock, entityDeployMock, entityPipelineMock } from '../src/mocks/mocks';

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
        <CodeStar entity={entityAllMock} children={null}/>
      </EntityProvider>
    </TestApiProvider>
    ),
  })
  .registerPlugin(codeStarPlugin).render();