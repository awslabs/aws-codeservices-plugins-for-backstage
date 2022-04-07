import { LinearProgress } from '@material-ui/core';
import React from 'react';
import { getEmployee } from '../useBuilds';
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

  const rows = new Map<string, any>()
  rows.set("firstName", employee?.data.first_name)
  rows.set("lastName", employee?.data.last_name)
  rows.set("email", employee?.data.email)
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
  const {loading, employee} = getEmployee("2")
  var error = null
  return (
    <InfoCard title={`Latest status for User ${!employee ? "undefined" : employee.data.first_name}`} variant={variant}>
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
