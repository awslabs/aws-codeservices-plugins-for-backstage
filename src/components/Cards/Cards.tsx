import React from 'react';
import {  getBuilds, getPipelineState } from '../useBuilds';
import {  getDeployments } from '../useBuilds';
import {
  InfoCard,
  InfoCardVariants,
  StructuredMetadataTable,
  /* WarningPanel, */
} from '@backstage/core-components';
import { Build }  from "@aws-sdk/client-codebuild";
import { DeploymentInfo }  from "@aws-sdk/client-codedeploy";
import { RunStatus } from '../BuildsPage/lib/Status';
import { GetPipelineStateOutput } from "@aws-sdk/client-codepipeline";


const WidgetContent = ({
  builds,
}: {
  builds?: Build[],
}) => {
  /* if (loading) return <LinearProgress />; */
  const rows = new Map<string, any>()
  if (builds != null && builds.length > 0) {
    rows.set("Status", <>
          <RunStatus status={builds[0].buildStatus?.toLowerCase()}/>
        </>
    )

    let id = builds[0]?.id?.split(':');
    let ar = builds[0]?.arn?.split(':');
    if (ar != undefined && id != undefined) {
      rows.set("Build Id",
          <a
              href={"https://" + ar[3] + ".console.aws.amazon.com/codesuite/codebuild/" + ar[4] + "/" + ar[5].replace('build', 'projects') + "/" + ar[5] + ":" + ar[6]}
              target="_blank"
          >
            {id}
          </a>
      )
    }
    let buildTime = builds[0]?.endTime;
    if (buildTime != undefined) {

      // make this duration or something later.
      if (buildTime instanceof Date) {
        rows.set("Completed",  buildTime.toDateString() + ":" + buildTime.toTimeString());
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
  const { buildOutput } =  getBuilds() ?? []
  var error = null
  return (
    <InfoCard title={`Latest Build Status `} variant={variant}>
      {!error ? (
        <WidgetContent
          builds={buildOutput}
        />
      ) : ( "" )}
    </InfoCard>
  );
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
  if (deploymentInfo != undefined) {
    rows.set("Status",<>
        <RunStatus status={deploymentInfo.status?.toLowerCase()} />
      </>
    )
    let id = deploymentInfo?.deploymentId;
    if (id != undefined) {
      rows.set("Deploy Id",
          <a
              href={"https://" + region + ".console.aws.amazon.com/codesuite/codedeploy/deployments/" + id + "?" + region }
              target="_blank"
          >
            {id}
          </a>
      )
    }
    let buildTime = deploymentInfo?.completeTime;
    if (buildTime != undefined) {
      if (buildTime instanceof Date) {
      // make this duration or something later.
      rows.set("Completed", buildTime.toDateString() + ":" + buildTime.toTimeString());
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
  const { deploymentsInfo,region } =  getDeployments() ?? []
  var error = null
  if (deploymentsInfo == undefined || deploymentsInfo.length <= 0) {
    error = "problem"
  }
  return (
    <InfoCard title={`Latest Deploy Status `} variant={variant}>
      {!error && deploymentsInfo != undefined ? (
        <DeployWidgetContent
          deploymentInfo={deploymentsInfo[0]}
          region={region}
        />
      ) : ( "" )}
    </InfoCard>
  );
};


const PipelineWidgetContent = ({
    pipelineInfo
  }: {
    pipelineInfo?: GetPipelineStateOutput,
    region?: string,
}) => {
  /* if (loading) return <LinearProgress />; */
  const rows = new Map<string, any>()
  if(pipelineInfo != undefined && pipelineInfo.stageStates != undefined) {
    for (const element of pipelineInfo.stageStates) {
      if (element.actionStates == undefined || element.actionStates.length <= 0) continue;
      rows.set(element.stageName || "undefined" ,
           <>
             <a
                 href={element.actionStates[0].entityUrl }
                 target="_blank">
            {element.actionStates[0].latestExecution?.actionExecutionId}
             </a>
            <div><RunStatus status={element.latestExecution?.status} /></div>
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


export const  PipelineRunCard = ({
  variant,
}: {
  variant?: InfoCardVariants;
}) => {
  const { pipelineInfo, region } = getPipelineState() ?? []
  var error = null
  if (pipelineInfo == undefined ) {
    error = "Problem"
  }
  return (
    <InfoCard title={ <a href={"https://" + region + ".console.aws.amazon.com/codesuite/codepipeline/pipelines/" + pipelineInfo?.pipelineName + "/view?" + region }
              target="_blank"> {pipelineInfo?.pipelineName} </a>} variant={variant}>
        {!error && pipelineInfo != undefined ? ( 
          <PipelineWidgetContent
             pipelineInfo={pipelineInfo} 
             region={region}
            />
        ) : ("")}
    </InfoCard>
  );
};
