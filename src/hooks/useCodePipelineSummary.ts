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

import {useAsyncRetry} from 'react-use';
import {codeStarApiRef} from '../api';
import {useApi} from '@backstage/core-plugin-api';
import {GetPipelineStateOutput} from '@aws-sdk/client-codepipeline';

export function useCodePipelineSummary(pipelineName: string, region: string, iamRole: string) {
  const api = useApi(codeStarApiRef);

  const {
    loading,
    value: pipelineInfo,
    error,
    retry
  } = useAsyncRetry<GetPipelineStateOutput | undefined>(async () => {
    const creds = await api.generateCredentials({iamRole: iamRole})
    // eslint-disable-next-line
    const pipelineInfo = await api.getPipelineState({region: region, name: pipelineName, creds});
    if (pipelineInfo.stageStates === undefined) {
      return undefined;
    }
    return pipelineInfo;
  }, []);

  return {loading, pipelineInfo, region, pipelineName, error, retry} as const;
};