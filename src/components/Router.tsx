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
import { rootRouteRef } from '../plugin';
import { useEntity } from '@backstage/plugin-catalog-react';
import { CITable } from './BuildsPage/lib/CITable';
import { Entity } from '@backstage/catalog-model';
import {REGION_ANNOTATION} from '../constants';
import { MissingAnnotationEmptyState } from '@backstage/core-components';

export const isCodeStarAvailable = (entity: Entity) => {
  console.log(entity);
  return Boolean(entity.metadata.annotations?.[REGION_ANNOTATION]);
}

type Props = {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
};

export const Router = (_props: Props) => {
  const { entity } = useEntity();
  if (!isCodeStarAvailable(entity)) {
    return <MissingAnnotationEmptyState annotation={REGION_ANNOTATION} />;
  }

  return (
    <Routes>
      <Route path={`/${rootRouteRef.path}`} element={<CITable />}  />
    </Routes>
  );
};
