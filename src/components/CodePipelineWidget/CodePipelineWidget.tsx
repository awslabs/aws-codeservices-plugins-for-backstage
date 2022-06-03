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

import { GetPipelineStateOutput } from "@aws-sdk/client-codepipeline";
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
import { PIPELINE_ARN_ANNOTATION } from '../../constants';
import { useCodePipelineSummary } from '../../hooks';
import { getCodePipelineArnFromEntity, getIAMRoleFromEntity } from '../../utils';
import { isAWSCodePipelineAvailable } from '../Flags';
import { PipelineStageStatus } from '../PipelineStageStatus';

const PipelineWidgetContent = ({
    pipelineInfo
  }: {
    pipelineInfo: GetPipelineStateOutput,
    region?: string,
}) => {
  const rows = new Map<string, any>()
  if(pipelineInfo.stageStates !== undefined) {
    for (const element of pipelineInfo.stageStates) {
      if (element.actionStates === undefined || element.actionStates.length <= 0) continue;
      rows.set(element.stageName || "undefined" ,
          <>
            <a
                href={element.actionStates[0].entityUrl }
                target="_blank">
            {element.actionStates[0].latestExecution?.actionExecutionId}
            </a>
            <div><PipelineStageStatus status={element.actionStates[0].latestExecution?.status} /></div>
            </>
      )
    }
  }

  return (
    <StructuredMetadataTable metadata = {Object.fromEntries(rows)} />
  );
};

const PipelineLatestRunCard = ({
  entity,
  variant,
}: {
  entity: Entity;
  variant?: InfoCardVariants;
}) => {
  const { pipelineName, region } = getCodePipelineArnFromEntity(entity);
  const { arn: iamRole } = getIAMRoleFromEntity(entity);

  const { pipelineInfo, error, loading } = useCodePipelineSummary(pipelineName, region, iamRole)

  if(pipelineInfo) {
    return (
      <InfoCard title={ <a href={`https://${region}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipelineName}/view?${region}`}
                target="_blank"> AWS CodePipeline</a>} variant={variant}>
          {pipelineInfo &&
            <PipelineWidgetContent
              pipelineInfo={pipelineInfo}
              region={region}
            />
          }
      </InfoCard>
    );
  }

  return (
    <InfoCard title='AWS CodePipeline' variant={variant}>
        {error &&
          <ResponseErrorPanel error={error} />
        }

        {loading &&
          <LinearProgress />
        }
    </InfoCard>
  )
};

export const AWSCodePipelineWidget = ({
  variant,
}: {
  variant?: InfoCardVariants;
}) => {
  const { entity } = useEntity();
  return !isAWSCodePipelineAvailable(entity) ? (
    <MissingAnnotationEmptyState annotation={PIPELINE_ARN_ANNOTATION} />
  ) : (
    <PipelineLatestRunCard entity={entity} variant={variant} />
  );
};