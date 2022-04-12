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

import {
  createApiRef,
  DiscoveryApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import {CodeBuildClient} from "@aws-sdk/client-codebuild";
import {ListBuildsForProjectCommand, ListBuildsForProjectCommandOutput} from "@aws-sdk/client-codebuild";
import {BatchGetBuildsCommand, BatchGetBuildsCommandOutput} from "@aws-sdk/client-codebuild";

export const codeStarApiRef = createApiRef<CodeStarApi>({
  id: 'plugin.codestar.service2',
  description: 'Used by the CodeStar plugin to make requests',
});

export interface Employee {
  data: EmployeeData;
};

export interface EmployeeData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

export interface Credentials {
  AccessKeyId: string;
  SecretAccessKey: string;
  SessionToken: string;
  Expiration: string;
};

export interface CodeStarApi {
  getEmployee(options: {id: string}): Promise<Employee>;
  getBuildIds(options: {region: string, project: string, creds: Credentials}): Promise<ListBuildsForProjectCommandOutput>;
  getBuilds(options: {region: string, ids: string[], creds: Credentials}): Promise<BatchGetBuildsCommandOutput>;
  generateCredentials(): Promise<Credentials>;
};

export class CodeStarClient implements CodeStarApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
  }

  async getEmployee({id}: {id: string}): Promise<Employee> {
    const url = `${await this.discoveryApi.getBaseUrl(
      'proxy',
    )}/dummy/api/users/${id}`;
    console.log("url: " + url);

    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error("failed to fetch")
    }
    return await response.json()
  }

  async generateCredentials(): Promise<Credentials> {
    const url = `${await this.discoveryApi.getBaseUrl(
      'aws',
    )}/credentials`;
    const reqBody = JSON.stringify({RoleArn: 'arn:aws:iam::461868971318:role/admin'});
    return await (await fetch(url, {method: 'POST', body: reqBody})).json();
  }

  async getBuildIds({region, project, creds}: {region: string, project: string, creds: Credentials}): Promise<ListBuildsForProjectCommandOutput> {
    const client = new CodeBuildClient({
      region: region,
      credentials: {
        accessKeyId: creds.AccessKeyId,
        secretAccessKey: creds.SecretAccessKey,
        sessionToken: creds.SessionToken
      }
    });
    const command = new ListBuildsForProjectCommand({projectName: project});
    return await client.send(command)
  }

  async getBuilds({region, ids, creds}: {region: string, ids: string[], creds: Credentials}): Promise<BatchGetBuildsCommandOutput> {
    const client = new CodeBuildClient({
      region: region,
      credentials: {
        accessKeyId: creds.AccessKeyId,
        secretAccessKey: creds.SecretAccessKey,
        sessionToken: creds.SessionToken
      }
    });
    const command = new BatchGetBuildsCommand({ids: ids});
    return await client.send(command)
  }
};
