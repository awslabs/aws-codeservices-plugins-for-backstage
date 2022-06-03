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
import {CodeStarClient, codeStarApiRef} from './api';

export const rootRouteRef = createRouteRef({
  id: 'aws-codestar',
});

export const codeStarPlugin = createPlugin({
  id: 'aws-codestar',
  apis: [
    createApiFactory({
      api: codeStarApiRef,
      deps: {discoveryApi: discoveryApiRef, identityApi: identityApiRef},
      factory: ({discoveryApi, identityApi}) =>
        new CodeStarClient({discoveryApi, identityApi}),
    }),
  ],
  routes: {
    entityContent: rootRouteRef,
  },
});

export const EntityAWSCodeStarContent = codeStarPlugin.provide(
  createRoutableExtension({
    name: "EntityAWSCodeStarContent",
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);

export const EntityAWSCodeStarCards = codeStarPlugin.provide(
  createComponentExtension({
    name: "EntityAWSCodeStarCards",
    component: {
      lazy: () => import('./components/Cards').then(m => m.CodeStarCards),
    },
  }),
);

export const EntityAWSCodeBuildCard = codeStarPlugin.provide(
  createComponentExtension({
    name: "EntityAWSCodeBuildCard",
    component: {
      lazy: () => import('./components/Cards').then(m => m.AWSCodeBuildWidget),
    },
  }),
);

export const EntityAWSCodeDeployCard = codeStarPlugin.provide(
  createComponentExtension({
    name: "EntityAWSCodeDeployCard",
    component: {
      lazy: () => import('./components/Cards').then(m => m.AWSCodeDeployWidget),
    },
  }),
);

export const EntityAWSCodePipelineCard = codeStarPlugin.provide(
  createComponentExtension({
    name: "EntityAWSCodePipelineCard",
    component: {
      lazy: () => import('./components/Cards').then(m => m.AWSCodePipelineWidget),
    },
  }),
);
