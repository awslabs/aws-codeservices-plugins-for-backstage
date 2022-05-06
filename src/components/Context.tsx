import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import { codeStarApiRef } from '../api';

export type Props = { entity: Entity, children: any };

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


