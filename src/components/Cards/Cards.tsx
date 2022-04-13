/* import { LinearProgress } from '@material-ui/core'; */
import React from 'react';
import {  getBuilds } from '../useBuilds';
import {
  InfoCard,
  InfoCardVariants,
  StructuredMetadataTable,
  /* WarningPanel, */
} from '@backstage/core-components';
import { Build }  from "@aws-sdk/client-codebuild";

const WidgetContent = ({
  builds,
}: {
  builds?: Build[],
}) => {
  /* if (loading) return <LinearProgress />; */
  const rows = new Map<string, any>()
  if (builds != null) {
    rows.set("Status",builds[0].buildStatus)
    rows.set("Build", builds[0].arn)
    var ar = builds[0]?.arn?.split(':');
    (ar) => {
      rows.set("URL", "https://"+ar[3]+".console.aws.amazon.com/codesuite/codebuild/"+ar[4]+"/"+ar[5].replace('build','projects')+"/"+ar[5]+":"+ar[6])
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
  var builds =  getBuilds()
  var error = null
  return (
    <InfoCard title={`Latest Build status `} variant={variant}>
      {!error ? (
        <WidgetContent
          builds={builds}
        />
      ) : ( "" )}
    </InfoCard>
  );
};
