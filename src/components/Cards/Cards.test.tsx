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
import { render } from '@testing-library/react';
import {
  errorApiRef,
  configApiRef,
  AnyApiRef,
} from '@backstage/core-plugin-api';
import { rest } from 'msw';
import {
  setupRequestMockHandlers,
  wrapInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import {codeStarApiRef} from '../../api';
import { entityBuildMock, entityDeployMock, entityPipelineMock } from '../../mocks/mocks';
import { buildsResponseMock, credsMock, deployResponseMock, pipelineResponseMock } from '../../mocks/mocks';
import { MockCodeStarClient} from '../../mocks/MockCodeStarClient'
import { BuildLatestRunCard, DeployLatestRunCard, PipelineLatestRunCard } from './Cards';

const errorApiMock = { post: jest.fn(), error$: jest.fn() };

const config = {
  getString: (_: string) => undefined,
};


const apis: [AnyApiRef, Partial<unknown>][] = [
  [configApiRef, config],
  [errorApiRef, errorApiMock],
  [codeStarApiRef, new MockCodeStarClient()],
];

describe('BuildLatestRunCard', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    // jest.resetAllMocks();
    worker.use(
      rest.post(
        'http://exampleapi.com/credentials',
        (_, res, ctx) => res(ctx.json(credsMock)),
      ),
    );
  });

  it('should display widget with Build data', async () => {
    const rendered = render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <EntityProvider entity={entityBuildMock}>
            <BuildLatestRunCard />
          </EntityProvider>
        </TestApiProvider>,
      ),
    );
    expect(
      await rendered.findByText(buildsResponseMock.builds[0].id),
    ).toBeInTheDocument();
  });

  it('should not display widget with build data', async () => {
    const rendered = render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <EntityProvider entity={entityPipelineMock}>
            <BuildLatestRunCard />
          </EntityProvider>
        </TestApiProvider>,
      ),
    );
    await expect(
      rendered.findByText(pipelineResponseMock.pipelineName),
    ).rejects.toThrow();
  });
});



describe('DeployLatestRunCard', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    // jest.resetAllMocks();
    worker.use(
      rest.post(
        'http://exampleapi.com/credentials',
        (_, res, ctx) => res(ctx.json(credsMock)),
      ),
    );
  });

  it('should display widget with Deployment data', async () => {
    const rendered = render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <EntityProvider entity={entityDeployMock}>
            <DeployLatestRunCard />
          </EntityProvider>
        </TestApiProvider>,
      ),
    );
    expect(
      await rendered.findByText(deployResponseMock.deploymentsInfo[0].deploymentId),
    ).toBeInTheDocument();
  });

  it('should not display widget with deploy data', async () => {
    const rendered = render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <EntityProvider entity={entityBuildMock}>
            <DeployLatestRunCard />
          </EntityProvider>
        </TestApiProvider>,
      ),
    );
    await expect(
      rendered.findByText(pipelineResponseMock.pipelineName),
    ).rejects.toThrow();
  });
});

describe('PipelineRunCard', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    // jest.resetAllMocks();
    worker.use(
      rest.post(
        'http://exampleapi.com/credentials',
        (_, res, ctx) => res(ctx.json(credsMock)),
      ),
    );
  });

  it('should display widget with Pipeline data', async () => {
    const rendered = render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <EntityProvider entity={entityPipelineMock }>
            <PipelineLatestRunCard />
          </EntityProvider>
        </TestApiProvider>,
      ),
    );
    expect(
      await rendered.findByText(`AWS CodePipeline: ${pipelineResponseMock.pipelineName}`),
    ).toBeInTheDocument();
  });

  it('should not display widget with Pipeline data', async () => {
    const rendered = render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <EntityProvider entity={entityDeployMock}>
            <PipelineLatestRunCard />
          </EntityProvider>
        </TestApiProvider>,
      ),
    );
    await expect(
      rendered.findByText(`AWS CodePipeline: ${pipelineResponseMock.pipelineName}`),
    ).rejects.toThrow();
  });
});
