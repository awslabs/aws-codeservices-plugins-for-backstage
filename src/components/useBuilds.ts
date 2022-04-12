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
import {useAsync, useAsyncRetry} from 'react-use';
import {codeStarApiRef} from '../api';
import {errorApiRef, useApi} from '@backstage/core-plugin-api';
// import {SPINNAKER_ANNOTATION} from '../constants';

export enum ErrorType {
  CONNECTION_ERROR,
  NOT_FOUND,
}

export function getEmployee(id: string) {
  const api = useApi(codeStarApiRef);
  const errorApi = useApi(errorApiRef);
  const {
    loading,
    value: employee,
    retry,
  } = useAsyncRetry(async () => {
    try {
      return api.getEmployee({id: id})
    } catch (e) {
      errorApi.post(e)
      throw e
    }
  });

  useAsync(async () => {
    const creds = await api.generateCredentials()
    console.log("test >>> ");
    const buildIds = await api.getBuildIds({region: "us-west-2", project: "hello-world", creds});
    if (buildIds.ids == undefined) {
      return
    }
    console.log(api.getBuilds({region: "us-west-2", ids: buildIds.ids, creds}));
  });

  return {loading, employee, retry} as const
};
