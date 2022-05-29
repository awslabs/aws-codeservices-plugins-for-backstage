import { Entity } from '@backstage/catalog-model';
import {
  BUILD_PROJECT_ARN_ANNOTATION,
  DEPLOY_GROUP_ARN_ANNOTATION,
  PIPELINE_ARN_ANNOTATION,
  IAM_ROLE_ANNOTATION
} from '../constants';

export const isCodeStarAvailable = (entity: Entity) => {
  return Boolean(entity.metadata.annotations?.[IAM_ROLE_ANNOTATION]);
}

export const isBuildAvailable = (entity: Entity) => {
  return Boolean(entity.metadata.annotations?.[BUILD_PROJECT_ARN_ANNOTATION]);
}

export const isDeployAvailable = (entity: Entity) => {
  return Boolean(entity.metadata.annotations?.[DEPLOY_GROUP_ARN_ANNOTATION]);
}

export const isPipelineAvailable = (entity: Entity) => {
  return Boolean(entity.metadata.annotations?.[PIPELINE_ARN_ANNOTATION]);
}

