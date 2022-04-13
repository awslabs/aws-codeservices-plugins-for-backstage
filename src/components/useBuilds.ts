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
import {useAsyncRetry} from 'react-use';
import {codeStarApiRef} from '../api';
import {useApi, errorApiRef} from '@backstage/core-plugin-api';

export enum ErrorType {
  CONNECTION_ERROR,
  NOT_FOUND,
}

export function getBuilds() {
  const api = useApi(codeStarApiRef);
  const errorApi = useApi(errorApiRef);
  const {
    loading,
    value: builds,
    retry,
  } = useAsyncRetry(async () => {
    try {
      console.log("pulling build data ...")
      const creds = await api.generateCredentials()
      const buildIds = await api.getBuildIds({region: "us-west-2", project: "hello-world", creds});
      if (buildIds.ids == undefined) {
        return
      }
      var builds = await api.getBuilds({region: "us-west-2", ids: buildIds.ids, creds});
      console.log(builds)
      return builds
    } catch (e) {
      errorApi.post(e)
      throw e
    }
  });

  var buildOutput = builds?.builds;
  return {loading, buildOutput, retry} as const
};
