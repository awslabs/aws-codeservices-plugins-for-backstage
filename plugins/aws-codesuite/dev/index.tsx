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

import { createDevApp } from "@backstage/dev-utils";
import { codeSuitePlugin } from "../src/plugin";
import { EntityProvider } from "@backstage/plugin-catalog-react";
import { TestApiProvider } from "@backstage/test-utils";
import React from "react";
import { Grid } from "@material-ui/core";
import { AWSCodeBuildWidget } from "../src/components/CodeBuildWidget/CodeBuildWidget";
import { AWSCodeDeployWidget } from "../src/components/CodeDeployWidget/CodeDeployWidget";
import { AWSCodePipelineWidget } from "../src/components/CodePipelineWidget/CodePipelineWidget";
import {
  mockCodePipelineEntity,
  MockCodePipelineService,
} from "../src/mocks/mocksCodePipeline";
import {
  awsCodeBuildApiRef,
  awsCodePipelineApiRef,
  awsCodeDeployApiRef,
} from "../src/api";
import {
  mockCodeBuildEntity,
  MockCodeBuildService,
} from "../src/mocks/mocksCodeBuild";
import {
  mockCodeDeployEntity,
  MockCodeDeployService,
} from "../src/mocks/mocksCodeDeploy";
import { AWSCodePipelineExecutionsTable } from "../src/components/CodePipelineExecutionsTable/CodePipelineExecutionsTable";

createDevApp()
  .addPage({
    path: "/fixture-build-card",
    title: "CodeBuild Card",
    element: (
      <TestApiProvider
        apis={[[awsCodeBuildApiRef, new MockCodeBuildService()]]}
      >
        <EntityProvider entity={mockCodeBuildEntity}>
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
    path: "/fixture-deploy-card",
    title: "CodeDeploy Card",
    element: (
      <TestApiProvider
        apis={[[awsCodeDeployApiRef, new MockCodeDeployService()]]}
      >
        <EntityProvider entity={mockCodeDeployEntity}>
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
    path: "/fixture-pipeline-card",
    title: "CodePipeline Card",
    element: (
      <TestApiProvider
        apis={[[awsCodePipelineApiRef, new MockCodePipelineService()]]}
      >
        <EntityProvider entity={mockCodePipelineEntity}>
          <AWSCodePipelineWidget />
        </EntityProvider>
      </TestApiProvider>
    ),
  })
  .addPage({
    path: "/fixture-pipeline-table",
    title: "CodePipeline Table",
    element: (
      <TestApiProvider
        apis={[[awsCodePipelineApiRef, new MockCodePipelineService()]]}
      >
        <AWSCodePipelineExecutionsTable entity={mockCodePipelineEntity} />
      </TestApiProvider>
    ),
  })
  .registerPlugin(codeSuitePlugin)
  .render();
