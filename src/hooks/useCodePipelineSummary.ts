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
import {useEntity} from '@backstage/plugin-catalog-react';
import {IAM_ROLE_ANNOTATION} from '../constants';
import {PIPELINE_ARN_ANNOTATION} from '../constants';
import {GetPipelineStateOutput} from '@aws-sdk/client-codepipeline';

export function useCodePipelineSummary() {
  const api = useApi(codeStarApiRef);
  const {entity} = useEntity();

  const iamRole = entity?.metadata.annotations?.[IAM_ROLE_ANNOTATION] ?? '';
  const pipelineARN = entity?.metadata.annotations?.[PIPELINE_ARN_ANNOTATION] ?? '';
  const {
    loading,
    value: pipelineInfo,
    error,
    retry
  } = useAsyncRetry<GetPipelineStateOutput | undefined>(async () => {
    const arnElements = pipelineARN.split(":")
    if (arnElements.length < 6)
      return undefined;

    const region = arnElements[3];
    const pipelineName = arnElements[5]

    const creds = await api.generateCredentials({iamRole: iamRole})
    // eslint-disable-next-line
    const pipelineInfo = await api.getPipelineState({region: region, name: pipelineName, creds});
    if (pipelineInfo.stageStates === undefined) {
      return undefined;
    }
    return pipelineInfo;
  });

  return {loading, pipelineInfo, error, retry} as const;
};