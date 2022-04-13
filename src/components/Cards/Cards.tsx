import { LinearProgress } from '@material-ui/core';
import React from 'react';
import {  getBuilds } from '../useBuilds';
import {
  InfoCard,
  InfoCardVariants,
  StructuredMetadataTable,
  /* WarningPanel, */
} from '@backstage/core-components';
import { Employee } from '../../api/ServiceApi';

const WidgetContent = ({
  employee,
  loading,
}: {
  employee?: Employee,
  loading?: boolean;
  branch: string;
}) => {
  if (loading) return <LinearProgress />;
  console.log("Cards Employee "+employee)
  const rows = new Map<string, any>()
  rows.set("Status", employee?.builds[0]?.buildStatus)
  rows.set("Build", employee?.builds[0]?.arn)
  return (
    <StructuredMetadataTable
      metadata = {Object.fromEntries(rows)}
    />
  );
};

export const LatestRunCard = ({
  branch = 'master',
  variant,
}: {
  branch: string;
  variant?: InfoCardVariants;
}) => {
    console.log("before ")
     var builds =  getBuilds("us-east-1", "java-app")
    console.log("is this coming here " )
    console.log(builds)
  var error = null
  return (
    <InfoCard title={`Latest status for User ${!builds ? "undefined" : builds}`} variant={variant}>
      {!error ? (
        <WidgetContent
          employee={employee}
          loading={loading}
          branch={branch}
        />
      ) : ( "" )}
    </InfoCard>
  );
};
