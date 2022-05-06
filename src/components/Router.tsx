/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { Route, Routes } from 'react-router';
import { useEntity } from '@backstage/plugin-catalog-react';
import { CITable } from './BuildsPage/lib/CITable';
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import { BuildLatestRunCard, DeployLatestRunCard, PipelineLatestRunCard } from './Cards/Cards';
import { Props, ContextProvider } from './Context';
import { isCodeStarAvailable } from './Flags';
import { REGION_ANNOTATION, BUILD_PROJECT_ANNOTATION, PIPELINE_NAME_ANNOTATION, DEPLOY_APPLICATION_ANNOTATION } from '../constants';
import { isBuildAvailable, isDeployAvailable, isPipelineAvailable } from './Flags';

export const Router = (_props: Props) => {
  const { entity } = useEntity();
  if (!isCodeStarAvailable(entity)) {
    return <MissingAnnotationEmptyState annotation={REGION_ANNOTATION} />;
  }

  return (
    <Routes>
      <Route path="/" element={<CodeStar entity={entity} children={null}/>}  />
    </Routes>
  );
};

export const BuildWidget: React.FC<Props> = ({ entity }) => {
  if (isBuildAvailable(entity)) {
    return (
      <ContextProvider entity={entity}>
        <BuildLatestRunCard />
      </ContextProvider>
    );
  }
  return <MissingAnnotationEmptyState annotation={BUILD_PROJECT_ANNOTATION} />;
};


export const DeployWidget: React.FC<Props> = ({ entity }) => {
  if (isDeployAvailable(entity)) {
    return (
      <ContextProvider entity={entity}>
        <DeployLatestRunCard />
      </ContextProvider>
    );
  }
  return <MissingAnnotationEmptyState annotation={DEPLOY_APPLICATION_ANNOTATION} />;
};


export const PipelineWidget: React.FC<Props> = ({ entity }) => {
  if (isPipelineAvailable(entity)) {
    return (
      <ContextProvider entity={entity}>
        <PipelineLatestRunCard />
      </ContextProvider>
    );
  }
  return <MissingAnnotationEmptyState annotation={PIPELINE_NAME_ANNOTATION} />;
};

export const CodeStar: React.FC<Props> = ({ entity }) => {
  return (
    <ContextProvider entity={entity} >
      <CITable/>
    </ContextProvider>
  );
};
