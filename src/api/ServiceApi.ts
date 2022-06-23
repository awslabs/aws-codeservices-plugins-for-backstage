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
  createApiRef,
  DiscoveryApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import {BatchGetProjectsCommand, BatchGetProjectsCommandOutput, CodeBuildClient} from "@aws-sdk/client-codebuild";
import {ListBuildsForProjectCommand, ListBuildsForProjectCommandOutput} from "@aws-sdk/client-codebuild";
import {BatchGetBuildsCommand, BatchGetBuildsCommandOutput} from "@aws-sdk/client-codebuild";

import {BatchGetDeploymentGroupsCommand, BatchGetDeploymentGroupsCommandOutput, CodeDeployClient} from "@aws-sdk/client-codedeploy";
import {ListDeploymentsCommand, ListDeploymentsCommandOutput} from "@aws-sdk/client-codedeploy";
import {BatchGetDeploymentsCommand, BatchGetDeploymentsCommandOutput} from "@aws-sdk/client-codedeploy";
import {CodePipelineClient, GetPipelineStateCommand, GetPipelineStateOutput} from "@aws-sdk/client-codepipeline";
import {ListPipelineExecutionsCommand, ListPipelineExecutionsCommandOutput} from "@aws-sdk/client-codepipeline";


export const codeStarApiRef = createApiRef<CodeStarApi>({
  id: 'plugin.codestar.service2',
});

export interface Credentials {
  AccessKeyId: string;
  SecretAccessKey: string;
  SessionToken: string;
  Expiration: string;
};

export interface CodeStarApi {
  getProject(options: {region: string, project: string, creds: Credentials}): Promise<BatchGetProjectsCommandOutput>;
  getBuildIds(options: {region: string, project: string, creds: Credentials}): Promise<ListBuildsForProjectCommandOutput>;
  getBuilds(options: {region: string, ids: string[], creds: Credentials}): Promise<BatchGetBuildsCommandOutput>;

  getDeploymentGroup(options: {region: string, appName: string, deploymentGroupName: string, creds: Credentials}): Promise<BatchGetDeploymentGroupsCommandOutput>;
  getDeploymentIds(options: {region: string, appName: string, deploymentGroupName: string, creds: Credentials}): Promise<ListDeploymentsCommandOutput>;
  getDeployments(options: {region: string, ids: string[], creds: Credentials}): Promise<BatchGetDeploymentsCommandOutput>;

  getPipelineState(options: {region: string, name: string, creds: Credentials}): Promise<GetPipelineStateOutput>
  getPipelineRuns(options: {region: string, name: string, creds: Credentials}): Promise<ListPipelineExecutionsCommandOutput>

  generateCredentials(options: {iamRole: string}): Promise<Credentials>;
};

export class CodeStarClient implements CodeStarApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
  }

  async generateCredentials({iamRole}: {iamRole: string}): Promise<Credentials> {
    const url = `${await this.discoveryApi.getBaseUrl(
      'aws',
    )}/credentials`;
    const reqBody = JSON.stringify({RoleArn: iamRole});
    return await (await fetch(url, {method: 'POST', body: reqBody})).json();
  }

  async getProject({region, project, creds}: {region: string, project: string, creds: Credentials}): Promise<BatchGetProjectsCommandOutput> {
    const client = new CodeBuildClient({
      region: region,
      credentials: {
        accessKeyId: creds.AccessKeyId,
        secretAccessKey: creds.SecretAccessKey,
        sessionToken: creds.SessionToken
      }
    });
    const command = new BatchGetProjectsCommand({names: [project]});
    return await client.send(command)
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

  async getDeploymentGroup({region, appName, deploymentGroupName, creds}: {region: string, appName: string, deploymentGroupName: string, creds: Credentials}): Promise<BatchGetDeploymentGroupsCommandOutput> {
    const client = new CodeDeployClient({
      region: region,
      credentials: {
        accessKeyId: creds.AccessKeyId,
        secretAccessKey: creds.SecretAccessKey,
        sessionToken: creds.SessionToken
      }
    });
    const command = new BatchGetDeploymentGroupsCommand({applicationName: appName, deploymentGroupNames: [deploymentGroupName]});
    return await client.send(command)
  }

  async getDeploymentIds({region, appName, deploymentGroupName, creds}: {region: string, appName: string, deploymentGroupName: string, creds: Credentials}): Promise<ListDeploymentsCommandOutput> {
    const client = new CodeDeployClient({
      region: region,
      credentials: {
        accessKeyId: creds.AccessKeyId,
        secretAccessKey: creds.SecretAccessKey,
        sessionToken: creds.SessionToken
      }
    });
    const command = new ListDeploymentsCommand({applicationName: appName, deploymentGroupName: deploymentGroupName});
    return await client.send(command)
  }

  async getDeployments({region, ids, creds}: {region: string, ids: string[], creds: Credentials}): Promise<BatchGetDeploymentsCommandOutput> {
    const client = new CodeDeployClient({
      region: region,
      credentials: {
        accessKeyId: creds.AccessKeyId,
        secretAccessKey: creds.SecretAccessKey,
        sessionToken: creds.SessionToken
      }
    });
    const command = new BatchGetDeploymentsCommand({deploymentIds: ids});
    return await client.send(command);
  }

  async getPipelineState({region, name, creds}: {region: string, name: string, creds: Credentials}): Promise<GetPipelineStateOutput> {
    const client = new CodePipelineClient({
      region: region,
      credentials: {
        accessKeyId: creds.AccessKeyId,
        secretAccessKey: creds.SecretAccessKey,
        sessionToken: creds.SessionToken
      }
    });

    const command = new GetPipelineStateCommand({name: name});
    return await client.send(command);
  }

  async getPipelineRuns({region, name, creds}: {region: string, name: string, creds: Credentials}): Promise<ListPipelineExecutionsCommandOutput> {
    const client = new CodePipelineClient({
      region: region,
      credentials: {
        accessKeyId: creds.AccessKeyId,
        secretAccessKey: creds.SecretAccessKey,
        sessionToken: creds.SessionToken
      }
    });
    const command = new ListPipelineExecutionsCommand({pipelineName: name});
    return await client.send(command);
  }
};
