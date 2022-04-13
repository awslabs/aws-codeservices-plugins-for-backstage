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
    <InfoCard title={`Latest status for User ${!builds ? "undefined" : builds}`} variant={variant}>
      {!error ? (
        <WidgetContent
          builds={builds}
        />
      ) : ( "" )}
    </InfoCard>
  );
};
