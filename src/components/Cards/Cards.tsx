import { Link } from '@material-ui/core';
import React from 'react';
import {  getBuilds } from '../useBuilds';
import {
  InfoCard,
  InfoCardVariants,
  StructuredMetadataTable,
  /* WarningPanel, */
} from '@backstage/core-components';
import { Build }  from "@aws-sdk/client-codebuild";
import { RunStatus } from '../BuildsPage/lib/Status';

const WidgetContent = ({
  builds,
}: {
  builds?: Build[],
}) => {
  /* if (loading) return <LinearProgress />; */
  const rows = new Map<string, any>()
  if (builds != null && builds.length > 0) {
    rows.set("Status",<>
        <RunStatus status={builds[0].buildStatus?.toLowerCase()} />
      </>
    )
    rows.set("Build", builds[0].arn)
    var ar = builds[0]?.arn?.split(':');
    if (ar != undefined) {
      rows.set("URL",
        <Link
          href= {"https://"+ar[3]+".console.aws.amazon.com/codesuite/codebuild/"+ar[4]+"/"+ar[5].replace('build','projects')+"/"+ar[5]+":"+ar[6]}
          target = "_blank"
        >
          Build Link
        </Link>
      )
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
  branch: string;
  variant?: InfoCardVariants;
}) => {
  const { buildOutput } =  getBuilds() ?? []
  var error = null
  return (
    <InfoCard title={`Latest Build status `} variant={variant}>
      {!error ? (
        <WidgetContent
          builds={buildOutput}
        />
      ) : ( "" )}
    </InfoCard>
  );
};
