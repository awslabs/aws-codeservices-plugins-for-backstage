import { Entity } from '@backstage/catalog-model';
import {
  BUILD_PROJECT_ANNOTATION,
  DEPLOY_APPLICATION_ANNOTATION,
  DEPLOY_GROUP_NAME_ANNOTATION,
  PIPELINE_NAME_ANNOTATION,
  IAM_ROLE_ANNOTATION,
  REGION_ANNOTATION} from '../constants';

export const isCodeStarAvailable = (entity: Entity) => {
  return Boolean(entity.metadata.annotations?.[REGION_ANNOTATION]) &&
         Boolean(entity.metadata.annotations?.[IAM_ROLE_ANNOTATION]);
}

export const isBuildAvailable = (entity: Entity) => {
  return Boolean(entity.metadata.annotations?.[BUILD_PROJECT_ANNOTATION]);
}

export const isDeployAvailable = (entity: Entity) => {
  return Boolean(entity.metadata.annotations?.[DEPLOY_APPLICATION_ANNOTATION]) &&
         Boolean(entity.metadata.annotations?.[DEPLOY_GROUP_NAME_ANNOTATION]);
}

export const isPipelineAvailable = (entity: Entity) => {
  return Boolean(entity.metadata.annotations?.[PIPELINE_NAME_ANNOTATION]);
}

