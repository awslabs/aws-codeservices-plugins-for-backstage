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
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRouteRef,
  identityApiRef,
  configApiRef,
  createRoutableExtension,
} from "@backstage/core-plugin-api";
import {
  awsCodeDeployApiRef,
  awsCodeBuildApiRef,
  awsCodePipelineApiRef,
} from "./api";
import { AwsCodeBuildApiClient } from "./api/AwsCodeBuildApiClient";
import { AwsCodeDeployApiClient } from "./api/AwsCodeDeployApiClient";
import { AwsCodePipelineApiClient } from "./api/AwsCodePipelineApiClient";

export const rootRouteRef = createRouteRef({
  id: "aws-codesuite",
});

export const codeSuitePlugin = createPlugin({
  id: "aws-codesuite",
  apis: [
    createApiFactory({
      api: awsCodePipelineApiRef,
      deps: { configApi: configApiRef, identityApi: identityApiRef },
      factory: ({ configApi, identityApi }) =>
        new AwsCodePipelineApiClient({ configApi, identityApi }),
    }),
    createApiFactory({
      api: awsCodeBuildApiRef,
      deps: { configApi: configApiRef, identityApi: identityApiRef },
      factory: ({ configApi, identityApi }) =>
        new AwsCodeBuildApiClient({ configApi, identityApi }),
    }),
    createApiFactory({
      api: awsCodeDeployApiRef,
      deps: { configApi: configApiRef, identityApi: identityApiRef },
      factory: ({ configApi, identityApi }) =>
        new AwsCodeDeployApiClient({ configApi, identityApi }),
    }),
  ],
  routes: {
    entityContent: rootRouteRef,
  },
});

export const EntityAWSCodeBuildProjectOverviewCard = codeSuitePlugin.provide(
  createComponentExtension({
    name: "EntityAWSCodeBuildCard",
    component: {
      lazy: () =>
        import("./components/CodeBuildWidget").then(
          (m) => m.AWSCodeBuildWidget
        ),
    },
  })
);

export const EntityAWSCodeDeployDeploymentGroupOverviewCard =
  codeSuitePlugin.provide(
    createComponentExtension({
      name: "EntityAWSCodeDeployCard",
      component: {
        lazy: () =>
          import("./components/CodeDeployWidget").then(
            (m) => m.AWSCodeDeployWidget
          ),
      },
    })
  );

export const EntityAWSCodePipelineOverviewCard = codeSuitePlugin.provide(
  createComponentExtension({
    name: "EntityAWSCodePipelineCard",
    component: {
      lazy: () =>
        import("./components/CodePipelineWidget").then(
          (m) => m.AWSCodePipelineWidget
        ),
    },
  })
);

export const EntityAWSCodePipelineContent = codeSuitePlugin.provide(
  createRoutableExtension({
    name: "EntityAWSCodePipelineContent",
    component: () => import("./components/Router").then((m) => m.Router),
    mountPoint: rootRouteRef,
  })
);
