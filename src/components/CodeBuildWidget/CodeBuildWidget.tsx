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

import { Build } from "@aws-sdk/client-codebuild";
import { Entity } from '@backstage/catalog-model';
import {
  InfoCard,
  InfoCardVariants,
  MissingAnnotationEmptyState,
  ResponseErrorPanel,
  StructuredMetadataTable
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { LinearProgress } from "@material-ui/core";
import React from 'react';
import { BUILD_PROJECT_ARN_ANNOTATION } from '../../constants';
import { useCodeBuildBuilds } from '../../hooks';
import { getCodeBuildArnFromEntity, getIAMRoleFromEntity } from '../../utils';
import { BuildStatus } from '../BuildStatus';
import { isAWSCodeBuildAvailable } from '../Flags';

const WidgetContent = ({
  project,
  region,
  accountId,
  builds,
}: {
  project: string,
  region: string,
  accountId: string,
  builds?: Build[],
}) => {
  const rows = new Map<string, any>()
  if (builds && builds.length > 0) {
    rows.set("Status", <>
        <BuildStatus status={builds[0].buildStatus}/>
      </>
    )

    const id = builds[0]?.id;

    if (id) {
      rows.set("Build ID",
        <a
          href={`https://${region}.console.aws.amazon.com/codesuite/codebuild/${accountId}/projects/${project}/build/${id}/?region=${region}`}
          target="_blank">
          {id}
        </a>
      )
    }
    const buildTime = builds[0]?.endTime;
    if (buildTime) {
      // make this duration or something later.
      if (buildTime instanceof Date) {
        rows.set("Completed", `${buildTime.toDateString()}:${buildTime.toTimeString()}`);
      }
    }
  }
  return (
    <StructuredMetadataTable metadata = {Object.fromEntries(rows)} />
  );
};

const BuildLatestRunCard = ({
  entity,
  variant,
}: {
  entity: Entity;
  variant?: InfoCardVariants;
}) => {
  const { accountId, project, region } = getCodeBuildArnFromEntity(entity);
  const { arn: iamRole } = getIAMRoleFromEntity(entity);

  const { buildOutput, error, loading } =  useCodeBuildBuilds(project, region, iamRole);

  if(buildOutput) {
    return (
      <InfoCard title='AWS CodeBuild' variant={variant}>
        <WidgetContent project={project} region={region} accountId={accountId} builds={buildOutput} />
      </InfoCard>
    );
  }

  return (
    <InfoCard title='AWS CodeBuild' variant={variant}>
      {error &&
        <ResponseErrorPanel error={error} />
      }

      {loading &&
        <LinearProgress />
      }
    </InfoCard>
  )
};

export const AWSCodeBuildWidget = ({
  variant,
}: {
  variant?: InfoCardVariants;
}) => {
  const { entity } = useEntity();
   return !isAWSCodeBuildAvailable(entity) ? (
     <MissingAnnotationEmptyState annotation={BUILD_PROJECT_ARN_ANNOTATION} />
   ) : (
     <BuildLatestRunCard entity={entity} variant={variant} />
   );
};