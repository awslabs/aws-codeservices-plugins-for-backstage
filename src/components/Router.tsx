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
import { Entity } from '@backstage/catalog-model';
import {REGION_ANNOTATION} from '../constants';
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import { codeStarApiRef } from '../api';
import { BuildLatestRunCard, DeployLatestRunCard, PipelineRunCard } from './Cards/Cards';

export const isCodeStarAvailable = (entity: Entity) => {
  return Boolean(entity.metadata.annotations?.[REGION_ANNOTATION]);
}

type Props = { entity: Entity };

export const Router = (_props: Props) => {
  const { entity } = useEntity();
  if (!isCodeStarAvailable(entity)) {
    return <MissingAnnotationEmptyState annotation={REGION_ANNOTATION} />;
  }

  return (
    <Routes>
      <Route path="/" element={<CodeStar entity={entity}/>}  />
    </Routes>
  );
};

export type Settings = {
  entity: Entity;
};

export const StateContext = React.createContext<
  [Settings, React.Dispatch<Settings>]
>([] as any);
const STORAGE_KEY = `${codeStarApiRef.id}.settings`;

export const ContextProvider: React.FC<Props> = ({ entity, children }) => {
  const [settings, setSettings] = useLocalStorage(STORAGE_KEY, { entity });
  if (settings === undefined) {
    throw new Error('Firebase functions plugin settings is undefined');
  }

  useEffect(() => {
    if (settings.entity !== entity) {
      setSettings({ entity });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity]);

  return (
    <StateContext.Provider value={[settings, setSettings]}>
      <>{children}</>
    </StateContext.Provider>
  );
};

export const BuildWidget: React.FC<Props> = ({ entity }) => {
  return (
    <ContextProvider entity={entity}>
      <BuildLatestRunCard />
    </ContextProvider>
  );
};


export const DeployWidget: React.FC<Props> = ({ entity }) => {
  return (
    <ContextProvider entity={entity}>
      <DeployLatestRunCard />
    </ContextProvider>
  );
};


export const PipelineWidget: React.FC<Props> = ({ entity }) => {
  return (
    <ContextProvider entity={entity}>
      <PipelineRunCard />
    </ContextProvider>
  );
};

export const CodeStar: React.FC<Props> = ({ entity }) => {
  return (
    <ContextProvider entity={entity}>
      <CITable />
    </ContextProvider>
  );
};
