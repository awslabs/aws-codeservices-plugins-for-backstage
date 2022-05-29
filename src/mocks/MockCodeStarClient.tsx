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

import {
  CodeStarApi,
  Credentials
} from '../api';

import { buildsResponseMock, credsMock, deployResponseMock, pipelineResponseMock, pipelineRunsResponseMock } from './mocks';

export class MockCodeStarClient implements CodeStarApi {
  async generateCredentials({} : {iamRole: string}): Promise<Credentials> {
    return new Promise((resolve) => { resolve(credsMock) } )
  }

  async getBuildIds({} : {region: string, project: string, creds: Credentials}): Promise<any> {
    return new Promise((resolve) => { resolve({ids: []}) })
  }

  async getBuilds({}: {region: string, ids: string[], creds: Credentials}): Promise<any> {
    return new Promise((resolve) => { resolve(buildsResponseMock) })
  }

  async getDeploymentIds({}: {region: string, appName: string, deploymentGroupName: string, creds: Credentials}): Promise<any>{
    return new Promise((resolve) => { resolve({deployments: []}) })
  }

  async getDeployments({}: {region: string, ids: string[], creds: Credentials}): Promise<any> {
    return new Promise((resolve) => { resolve(deployResponseMock) })
  }
  async getPipelineState({}: {region: string, name: string, creds: Credentials}): Promise<any> {
    return new Promise((resolve) => { resolve(pipelineResponseMock) })
  }
  async getPipelineRuns({}: {region: string, name: string, creds: Credentials}): Promise<any> {
    return new Promise((resolve) => { resolve(pipelineRunsResponseMock) })
  }
}
