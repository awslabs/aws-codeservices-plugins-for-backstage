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
import {
  BUILD_PROJECT_ARN_ANNOTATION,
  DEPLOY_GROUP_ARN_ANNOTATION,
  PIPELINE_ARN_ANNOTATION,
  IAM_ROLE_ANNOTATION
} from '../constants';

export const isAWSCodeStarAvailable = (entity: Entity) => {
  return Boolean(entity.metadata.annotations?.[IAM_ROLE_ANNOTATION]);
}

export const isAWSCodeBuildAvailable = (entity: Entity) => {
  return Boolean(entity.metadata.annotations?.[BUILD_PROJECT_ARN_ANNOTATION]);
}

export const isAWSCodeDeployAvailable = (entity: Entity) => {
  return Boolean(entity.metadata.annotations?.[DEPLOY_GROUP_ARN_ANNOTATION]);
}

export const isAWSCodePipelineAvailable = (entity: Entity) => {
  return Boolean(entity.metadata.annotations?.[PIPELINE_ARN_ANNOTATION]);
}