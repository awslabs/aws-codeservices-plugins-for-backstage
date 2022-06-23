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
  createRoutableExtension,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import {CodeSuiteClient, codeSuiteApiRef} from './api';

export const rootRouteRef = createRouteRef({
  id: 'aws-codesuite',
});

export const codeSuitePlugin = createPlugin({
  id: 'aws-codesuite',
  apis: [
    createApiFactory({
      api: codeSuiteApiRef,
      deps: {discoveryApi: discoveryApiRef, identityApi: identityApiRef},
      factory: ({discoveryApi, identityApi}) =>
        new CodeSuiteClient({discoveryApi, identityApi}),
    }),
  ],
  routes: {
    entityContent: rootRouteRef,
  },
});

export const EntityAWSCodeSuiteContent = codeSuitePlugin.provide(
  createRoutableExtension({
    name: "EntityAWSCodeSuiteContent",
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);

export const EntityAWSCodeSuiteCards = codeSuitePlugin.provide(
  createComponentExtension({
    name: "EntityAWSCodeSuiteCards",
    component: {
      lazy: () => import('./components/CodeSuiteCards').then(m => m.CodeSuiteCards),
    },
  }),
);

export const EntityAWSCodeBuildCard = codeSuitePlugin.provide(
  createComponentExtension({
    name: "EntityAWSCodeBuildCard",
    component: {
      lazy: () => import('./components/CodeBuildWidget').then(m => m.AWSCodeBuildWidget),
    },
  }),
);

export const EntityAWSCodeDeployCard = codeSuitePlugin.provide(
  createComponentExtension({
    name: "EntityAWSCodeDeployCard",
    component: {
      lazy: () => import('./components/CodeDeployWidget').then(m => m.AWSCodeDeployWidget),
    },
  }),
);

export const EntityAWSCodePipelineCard = codeSuitePlugin.provide(
  createComponentExtension({
    name: "EntityAWSCodePipelineCard",
    component: {
      lazy: () => import('./components/CodePipelineWidget').then(m => m.AWSCodePipelineWidget),
    },
  }),
);
