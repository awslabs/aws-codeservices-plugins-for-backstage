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
import { Route, Routes } from 'react-router';
import { useEntity } from '@backstage/plugin-catalog-react';
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import { isAWSCodeStarAvailable } from './Flags';
import { IAM_ROLE_ANNOTATION } from '../constants';
import { CITable } from './BuildsPage/lib/CITable';

export const Router = () => {
  const { entity } = useEntity();
  if (!isAWSCodeStarAvailable(entity)) {
    return <MissingAnnotationEmptyState annotation={IAM_ROLE_ANNOTATION} />;
  }

  return (
    <Routes>
      <Route path="/" element={<CITable />}  />
    </Routes>
  );
};
