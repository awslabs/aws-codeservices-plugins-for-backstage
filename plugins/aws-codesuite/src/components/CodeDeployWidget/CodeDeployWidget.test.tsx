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

import { AnyApiRef } from "@backstage/core-plugin-api";
import { EntityProvider } from "@backstage/plugin-catalog-react";
import {
  setupRequestMockHandlers,
  TestApiProvider,
  wrapInTestApp,
} from "@backstage/test-utils";
import { render } from "@testing-library/react";
import { setupServer } from "msw/node";
import { awsCodeDeployApiRef } from "../../api";
import {
  mockCodeDeployEntity,
  MockCodeDeployService,
} from "../../mocks/mocksCodeDeploy";
import React from "react";

import { AWSCodeDeployWidget } from "./CodeDeployWidget";

const apis: [AnyApiRef, Partial<unknown>][] = [
  [awsCodeDeployApiRef, new MockCodeDeployService()],
];

describe("AWSCodeDeployWidget", () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  it("should display widget when ARN is present", async () => {
    const rendered = render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <EntityProvider entity={mockCodeDeployEntity}>
            <AWSCodeDeployWidget />
          </EntityProvider>
        </TestApiProvider>
      )
    );
    expect(
      await rendered.findByText("DgpECS-test-cluster-test-service")
    ).toBeInTheDocument();
  });
});
