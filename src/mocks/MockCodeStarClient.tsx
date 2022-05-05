import {
  CodeStarApi,
  Credentials
} from '../api';

import { buildsResponseMock, credsMock, deployResponseMock, pipelineResponseMock } from './mocks';

export class MockCodeStarClient implements CodeStarApi {
  async generateCredentials(_ : {iamRole: string}): Promise<Credentials> {
    return new Promise((resolve, _) => { resolve(credsMock) } )
  }

  async getBuildIds(_ : {region: string, project: string, creds: Credentials}): Promise<any> {
    return new Promise((resolve, _) => { resolve({ids: []}) })
  }

  async getBuilds(_: {region: string, ids: string[], creds: Credentials}): Promise<any> {
    return new Promise((resolve, _) => { resolve({loading:[], buildsResponseMock, retry:""}) })
  }

  async getDeploymentIds(_: {region: string, appName: string, deploymentGroupName: string, creds: Credentials}): Promise<any>{
    return new Promise((resolve, _) => { resolve({deployments: []}) })
  }

  async getDeployments(_: {region: string, ids: string[], creds: Credentials}): Promise<any> {
    return new Promise((resolve, _) => { resolve(deployResponseMock) })
  }
  async getPipelineState(_: {region: string, name: string, creds: Credentials}): Promise<any> {
    return new Promise((resolve, _) => { resolve(pipelineResponseMock) })
  }
}
