import {
  Credentials
} from '../api';

import { buildsResponseMock } from './mocks';
import { MockCodeStarClient } from './MockCodeStarClient';

export class MockCodeStarClientBuild extends MockCodeStarClient {

  async getBuilds(_: {region: string, ids: string[], creds: Credentials}): Promise<any> {
    return new Promise((resolve, _) => { resolve(buildsResponseMock) })
  }

}