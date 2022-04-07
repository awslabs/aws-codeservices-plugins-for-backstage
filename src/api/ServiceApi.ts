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

export interface CodeStarApi {
  getEmployee(options: {id: string}): Promise<Employee>;
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
};
