import { createDevApp } from '@backstage/dev-utils';
import { codeStarPlugin } from '../src/plugin';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import {
  AnyApiRef,
} from '@backstage/core-plugin-api';
import { codeStarApiRef } from '../src';
import { MockCodeStarClient } from '../src/mocks/MockCodeStarClient';
import { BuildWidget, CodeStar, DeployWidget, PipelineWidget } from '../src/components/Router';
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
        <BuildWidget entity={entityBuildMock} children={null} />
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
        <DeployWidget entity={entityDeployMock} children={null} />
      </EntityProvider>
    </TestApiProvider>
    ),
  })
  .addPage({
    path: '/fixture-pipeline-run',
    title: 'CodePipeline Run',
    element: (
    <TestApiProvider apis={apis}>
      <EntityProvider entity={entityPipelineMock}>
        <PipelineWidget entity={entityPipelineMock} children={null} />
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