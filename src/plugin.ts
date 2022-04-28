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
  path: '',
  title: 'CodeStar',
});

export const buildRouteRef = createRouteRef({
  path: 'build/:jobFullName/:buildNumber',
  params: ['jobFullName', 'buildNumber'],
  title: 'CodeBuild',
});

export const codeStarPlugin = createPlugin({
  id: 'codestar',
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

export const EntityCodeStarContent = codeStarPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);

export const EntityLatestEmployeeRunCard = codeStarPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () => import('./components/Cards').then(m => m.LatestRunCard),
    },
  }),
);

export const DeployEntityLatestEmployeeRunCard = codeStarPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () => import('./components/Cards').then(m => m.DeployLatestRunCard),
    },
  }),
);

export const PipelineRunCard = codeStarPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () => import('./components/Cards').then(m => m.PipelineRunCard),
    },
  }),
);
