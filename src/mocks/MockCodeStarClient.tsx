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
