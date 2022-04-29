import { Link } from '@material-ui/core';
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
          <Link
              href={"https://" + ar[3] + ".console.aws.amazon.com/codesuite/codebuild/" + ar[4] + "/" + ar[5].replace('build', 'projects') + "/" + ar[5] + ":" + ar[6]}
              target="_blank"
          >
            {id}
          </Link>
      )
    }
    let buildTime = builds[0]?.endTime;
    if (buildTime != undefined) {
      console.log("build time", buildTime);
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

export const LatestRunCard = ({
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
  deploymentInfo,
}: {
  deploymentInfo?: DeploymentInfo,
}) => {
  /* if (loading) return <LinearProgress />; */
  const rows = new Map<string, any>()
  console.log(deploymentInfo);
  if (deploymentInfo != undefined) {
    rows.set("Status",<>
        <RunStatus status={deploymentInfo.status?.toLowerCase()} />
      </>
    )
    console.log ("deploymentInfo",deploymentInfo);
    let id = deploymentInfo?.deploymentId;
    let region = "us-west-2";
    console.log("id is", id);
    if (id != undefined) {
      rows.set("Deploy Id",
          <Link
              href={"https://" + region + ".console.aws.amazon.com/codesuite/codedeploy/deployments/" + id + "?" + region }
              target="_blank"
          >
            {id}
          </Link>
      )
    }
    let buildTime = deploymentInfo?.completeTime;
    if (buildTime != undefined) {
      console.log("Deploy Time", buildTime);
      // make this duration or something later.
      rows.set("Completed", buildTime.toDateString() + ":" + buildTime.toTimeString());
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
  branch: string;
  variant?: InfoCardVariants;
}) => {
  const { deploymentsInfo } =  getDeployments() ?? []
  var error = null
  if (deploymentsInfo == undefined || deploymentsInfo.length <= 0) {
    error = "problem"
  }
  return (
    <InfoCard title={`Latest Deploy Status `} variant={variant}>
      {!error && deploymentsInfo != undefined ? (
        <DeployWidgetContent
          deploymentInfo={deploymentsInfo[0]}
        />
      ) : ( "" )}
    </InfoCard>
  );
};


const PipelineWidgetContent = ({
    pipelineInfo,
  }: {
    pipelineInfo?: GetPipelineStateOutput,
}) => {
  /* if (loading) return <LinearProgress />; */
  const rows = new Map<string, any>()
  if(pipelineInfo != undefined && pipelineInfo.stageStates != undefined) {
    console.log("cardinto...",pipelineInfo);
    for (const element of pipelineInfo.stageStates) {
      if (element.actionStates == undefined || element.actionStates.length <= 0) continue;
      rows.set(element.stageName || "undefined" ,
           <>
             <Link
                 href={ element.actionStates[0].entityUrl }
                 target="_blank"
             >
               {element.actionStates[0].latestExecution?.actionExecutionId}
             </Link><br/> <RunStatus status={element.latestExecution?.status} />
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
  const { pipelineInfo }   = getPipelineState() ?? []
  var error = null
  if (pipelineInfo == undefined ) {
    error = "Problem"
  }
  return (
    <InfoCard title={`Latest Pipeline Status`} variant={variant}>
        {!error && pipelineInfo != undefined ? ( 
          <PipelineWidgetContent
             pipelineInfo={pipelineInfo}
            />
        ) : ("")}
    </InfoCard>
  );
};
