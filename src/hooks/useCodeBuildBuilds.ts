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

import {useAsyncRetry} from 'react-use';
import {codeStarApiRef} from '../api';
import {useApi} from '@backstage/core-plugin-api';
import {BUILD_PROJECT_ARN_ANNOTATION, IAM_ROLE_ANNOTATION} from '../constants';
import {Build} from '@aws-sdk/client-codebuild';
import { Entity } from '@backstage/catalog-model';

export function useCodeBuildBuilds(entity: Entity) {
  const api = useApi(codeStarApiRef);

  const iamRole = entity?.metadata.annotations?.[IAM_ROLE_ANNOTATION] ?? '';
  const buildARN = entity?.metadata.annotations?.[BUILD_PROJECT_ARN_ANNOTATION] ?? '';
  const {
    loading,
    value: builds,
    error,
    retry,
  } = useAsyncRetry<Build[]>(async () => {
    const arnElements = buildARN.split(":")
    if (arnElements.length < 6)
      return [];

    const region = arnElements[3];
    const project = arnElements[5].substring("project/".length)

    const creds = await api.generateCredentials({iamRole: iamRole});
    const buildIds = await api.getBuildIds({region: region, project: project, creds});
    if (buildIds.ids) {
      const output = await api.getBuilds({region: region, ids: buildIds.ids, creds})
      return output.builds ?? [];
    }
    return [];
  });

  const buildOutput = builds;
  return {loading, buildOutput, error, retry} as const;
};