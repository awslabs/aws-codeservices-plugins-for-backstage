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

import React from 'react';
import {  useBuilds, usePipelineState } from '../useBuilds';
import {  useDeployments } from '../useBuilds';
import {
  InfoCard,
  InfoCardVariants,
  ResponseErrorPanel,
  StructuredMetadataTable,
  /* WarningPanel, */
} from '@backstage/core-components';
import { Build }  from "@aws-sdk/client-codebuild";
import { DeploymentInfo }  from "@aws-sdk/client-codedeploy";
import { RunStatus } from '../BuildsPage/lib/Status';
import { GetPipelineStateOutput } from "@aws-sdk/client-codepipeline";
import { isBuildAvailable, isDeployAvailable, isPipelineAvailable } from '../Flags';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Grid, LinearProgress }  from "@material-ui/core"
import { DEPLOY_GROUP_ARN_ANNOTATION } from '../../constants';
import { PIPELINE_ARN_ANNOTATION } from '../../constants';


const WidgetContent = ({
  builds,
}: {
  builds?: Build[],
}) => {
  /* if (loading) return <LinearProgress />; */
  const rows = new Map<string, any>()
  if (builds && builds.length > 0) {
    rows.set("Status", <>
          <RunStatus status={builds[0].buildStatus?.toLowerCase()}/>
        </>
    )

    const id = builds[0]?.id?.split(':');
    const ar = builds[0]?.arn?.split(':');
    if (ar !== undefined && id !== undefined) {
      rows.set("Build ID",
          <a
              href={`https://${ar[3]}.console.aws.amazon.com/codesuite/codebuild/${ar[4]}/${ar[5].replace('build', 'projects')}/${ar[5]}:${ar[6]}`}
              target="_blank"
          >
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
    <StructuredMetadataTable
      metadata = {Object.fromEntries(rows)}
    />
  );
};

export const BuildLatestRunCard = ({
  variant,
}: {
  variant?: InfoCardVariants;
}) => {
  const { buildOutput, error, loading } =  useBuilds()

  if(buildOutput) {
    return (
      <InfoCard title='AWS CodeBuild' variant={variant}>
        <WidgetContent
          builds={buildOutput}
        />
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

/* ---------------------------------------- */

const DeployWidgetContent = ({
  deploymentInfo,region
}: {
  deploymentInfo?: DeploymentInfo,
  region: string
}) => {
  /* if (loading) return <LinearProgress />; */
  const rows = new Map<string, any>()
  if (deploymentInfo) {
    rows.set("Status",<>
        <RunStatus status={deploymentInfo.status?.toLowerCase()} />
      </>
    )
    const id = deploymentInfo?.deploymentId;
    if (id !== undefined) {
      rows.set("Deploy ID",
          <a
              href={`https://${region}.console.aws.amazon.com/codesuite/codedeploy/deployments/${id}?${region}`}
              target="_blank"
          >
            {id}
          </a>
      )
    }
    const buildTime = deploymentInfo?.completeTime;
    if (buildTime !== undefined) {
      if (buildTime instanceof Date) {
      // make this duration or something later.
      rows.set("Completed", `${buildTime.toDateString()}:${buildTime.toTimeString()}`);
    }
  }
  }
  return (
    <StructuredMetadataTable
      metadata = {Object.fromEntries(rows)}
    />
  );
};

export const DeployLatestRunCard = ({
  variant,
}: {
  variant?: InfoCardVariants;
}) => {
  const { deploymentsInfo, error, loading } =  useDeployments()
  const { entity } = useEntity();
  const deployARN = entity?.metadata.annotations?.[DEPLOY_GROUP_ARN_ANNOTATION] ?? '';
  const arnElements = deployARN.split(":")
  if (arnElements.length < 7)
    return (<></>);

  const region = arnElements[3];

  if(deploymentsInfo) {
    return (
      <InfoCard title='AWS CodeDeploy' variant={variant}>
        {!error && deploymentsInfo !== undefined ? (
          <DeployWidgetContent
            deploymentInfo={deploymentsInfo[0]}
            region={region}
          />
        ) : ( "" )}
      </InfoCard>
    );
  }

  return (
    <InfoCard title='AWS CodeDeploy' variant={variant}>
        {error &&
          <ResponseErrorPanel error={error} />
        }

        {loading &&
          <LinearProgress />
        }
    </InfoCard>
  )
};


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
            <div><RunStatus status={element.actionStates[0].latestExecution?.status} /></div>
            </>
       )
    }
  }

  return (
    <StructuredMetadataTable
      metadata = {Object.fromEntries(rows)}
    />
  );
};


export const PipelineLatestRunCard = ({
  variant,
}: {
  variant?: InfoCardVariants;
}) => {
  const { pipelineInfo, error, loading } = usePipelineState()
  const { entity } = useEntity();
  const pipelineARN = entity?.metadata.annotations?.[PIPELINE_ARN_ANNOTATION] ?? '';
  const arnElements = pipelineARN.split(":")
  if (arnElements.length < 6)
    return (<></>);

  const region = arnElements[3];

  if(pipelineInfo) {
    return (
      <InfoCard title={ <a href={`https://${region}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipelineInfo?.pipelineName}/view?${region}`}
                target="_blank"> AWS CodePipeline: {pipelineInfo?.pipelineName} </a>} variant={variant}>
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

export const CodeStarCards = ({
  variant,
}: {
  variant?: InfoCardVariants;
}) => {
  const { entity } = useEntity();
  return(
    <>
      { isPipelineAvailable(entity) &&
        <Grid item sm={4}>
          <PipelineLatestRunCard variant={variant} />
        </Grid>
      }
      { isBuildAvailable(entity) &&
        <Grid item sm={4}>
          <BuildLatestRunCard variant={variant} />
        </Grid>
      }
      { isDeployAvailable(entity) &&
        <Grid item sm={4}>
          <DeployLatestRunCard variant={variant} />
        </Grid>
      }
    </>
  );
};
