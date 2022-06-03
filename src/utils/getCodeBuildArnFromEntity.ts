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

import { Entity } from '@backstage/catalog-model';
import { BUILD_PROJECT_ARN_ANNOTATION } from '../constants';
import { getArnFromEntity } from './getArnFromEntity';
 
export function getCodeBuildArnFromEntity(entity: Entity): {
  arn: string,
  accountId: string,
  region: string,
  service: string,
  resource: string,
  project: string,
} {
  const arn = getArnFromEntity(entity, BUILD_PROJECT_ARN_ANNOTATION);

  const resourceParts = arn.resource.split("/");

  if(resourceParts.length !== 2) {
    throw new Error(`CodeBuild ARN not valid: ${arn.arn}`)
  }

  return {project: resourceParts[1], ...arn}
}