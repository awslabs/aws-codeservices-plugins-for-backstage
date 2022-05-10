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
import {
  codeStarApiRef,
} from '../../../../api';
import {
  entityBuildMock,
  credsMock,
  buildsResponseMock,
  entityAllMock,
  pipelineRunsResponseMock,
  deployResponseMock
} from '../../../../mocks/mocks';
import {CodeStar} from '../../../Router';
import {MockCodeStarClient} from '../../../../mocks/MockCodeStarClient'

const errorApiMock = { post: jest.fn(), error$: jest.fn() };

const config = {
  getString: (_: string) => undefined,
};

//let CodeStarClientFake = new MockCodeStarClient()

const apis: [AnyApiRef, Partial<unknown>][] = [
  [configApiRef, config],
  [errorApiRef, errorApiMock],
  [codeStarApiRef, new MockCodeStarClient()],
];

describe('CITable', () => {
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

  it.only('should display widget with CITable data', async () => {
    const rendered = render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <EntityProvider entity={entityBuildMock}>
            <CodeStar entity={entityBuildMock} children={null}/>
          </EntityProvider>
        </TestApiProvider>,
      ),
    );
    expect(
      await rendered.findByText(buildsResponseMock.builds[0].id),
    ).toBeInTheDocument();
    await expect(
      rendered.findByText(deployResponseMock.deploymentsInfo[0].deploymentId),
    ).rejects.toThrow();
    await expect(
      rendered.findByText(pipelineRunsResponseMock.pipelineExecutionSummaries[0].pipelineExecutionId),
    ).rejects.toThrow();
  });

  it('should display all CICD tables when all annotations are present', async () => {
    const rendered = render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <EntityProvider entity={entityAllMock}>
            <CodeStar entity={entityAllMock} children={null}/>
          </EntityProvider>
        </TestApiProvider>,
      ),
    );
    expect(
      await rendered.findByText(buildsResponseMock.builds[0].id),
    ).toBeInTheDocument();
    expect(
      await rendered.findByText(buildsResponseMock.builds[0].buildNumber),
    ).toBeInTheDocument();

    expect(
      await rendered.findByText(buildsResponseMock.builds[1].id),
    ).toBeInTheDocument();
    expect(
      await rendered.findByText(buildsResponseMock.builds[1].buildNumber),
    ).toBeInTheDocument();

    expect(
      await rendered.findByText(deployResponseMock.deploymentsInfo[0].deploymentId),
    ).toBeInTheDocument();


    expect(
      await rendered.findByText(pipelineRunsResponseMock.pipelineExecutionSummaries[0].pipelineExecutionId),
    ).toBeInTheDocument();
    expect(
      await rendered.findByText(pipelineRunsResponseMock.pipelineExecutionSummaries[0].lastUpdateTime.toLocaleString()),
    ).toBeInTheDocument();
    expect(
      await rendered.findByText(pipelineRunsResponseMock.pipelineExecutionSummaries[0].trigger?.triggerDetail),
    ).toBeInTheDocument();

    expect(
      await rendered.findByText(pipelineRunsResponseMock.pipelineExecutionSummaries[1].pipelineExecutionId),
    ).toBeInTheDocument();
    expect(
      await rendered.findByText(pipelineRunsResponseMock.pipelineExecutionSummaries[1].trigger?.triggerDetail),
    ).toBeInTheDocument();
  });
});


